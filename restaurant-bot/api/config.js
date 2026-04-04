export default function handler(req, res) {
  res.json({
    businessName: process.env.BUSINESS_NAME || 'Our Restaurant',
    calendarConnected: !!process.env.GOOGLE_REFRESH_TOKEN
  });
}
