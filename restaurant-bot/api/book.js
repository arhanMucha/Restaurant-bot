import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, guests, date, time } = req.body;

  // Parse date and time into a proper datetime
  // Expected format: date = "Saturday 4 April", time = "19:00"
  const parseDateTime = (dateStr, timeStr) => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const dateInput = `${dateStr} ${year} ${timeStr}`;
      const parsed = new Date(dateInput);
      if (isNaN(parsed.getTime())) {
        // Fallback: use tomorrow at the given time
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const [hours, minutes] = timeStr.split(':').map(Number);
        tomorrow.setHours(hours, minutes, 0, 0);
        return tomorrow;
      }
      return parsed;
    } catch(e) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    }
  };

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Use stored refresh token
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    const startTime = parseDateTime(date, time);
    const endTime = new Date(startTime.getTime() + 90 * 60 * 1000); // 90 min booking

    // Check if slot is free
    const freeBusyRes = await calendar.freebusy.query({
      requestBody: {
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        items: [{ id: calendarId }]
      }
    });

    const busy = freeBusyRes.data.calendars[calendarId]?.busy || [];

    if (busy.length > 0) {
      // Slot is taken — find next available 30 min later
      let suggestedStart = new Date(startTime.getTime() + 30 * 60 * 1000);
      let found = false;

      for (let i = 0; i < 8; i++) {
        const suggestedEnd = new Date(suggestedStart.getTime() + 90 * 60 * 1000);
        const checkRes = await calendar.freebusy.query({
          requestBody: {
            timeMin: suggestedStart.toISOString(),
            timeMax: suggestedEnd.toISOString(),
            items: [{ id: calendarId }]
          }
        });
        const checkBusy = checkRes.data.calendars[calendarId]?.busy || [];
        if (checkBusy.length === 0) {
          found = true;
          const suggestedHour = suggestedStart.getHours().toString().padStart(2,'0');
          const suggestedMin = suggestedStart.getMinutes().toString().padStart(2,'0');
          return res.json({ success: false, suggestedSlot: `${suggestedHour}:${suggestedMin}` });
        }
        suggestedStart = new Date(suggestedStart.getTime() + 30 * 60 * 1000);
      }

      if (!found) {
        return res.json({ success: false, suggestedSlot: null });
      }
    }

    // Slot is free — create the event
    const businessName = process.env.BUSINESS_NAME || 'Restaurant';
    await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: `Table for ${guests} — ${name}`,
        description: `Booking via AI Assistant\nName: ${name}\nGuests: ${guests}`,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
        colorId: '3' // green
      }
    });

    return res.json({ success: true });

  } catch(e) {
    console.error('Calendar error:', e.message);
    // If calendar not set up, return success anyway (fallback mode)
    return res.json({ success: true, fallback: true });
  }
}
