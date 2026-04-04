export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages, calendarConnected } = req.body;

  const BUSINESS_NAME = process.env.BUSINESS_NAME || 'Our Restaurant';
  const BUSINESS_HOURS = process.env.BUSINESS_HOURS || 'Tuesday to Sunday, 12:00 to 22:00';
  const BUSINESS_ADDRESS = process.env.BUSINESS_ADDRESS || 'Munich, Germany';
  const BUSINESS_PHONE = process.env.BUSINESS_PHONE || '';

  const systemPrompt = `You are a professional AI assistant for ${BUSINESS_NAME}, a restaurant.

Business info:
- Hours: ${BUSINESS_HOURS}
- Address: ${BUSINESS_ADDRESS}
- Phone: ${BUSINESS_PHONE}

YOUR JOB: Help customers book tables and answer basic questions.

BOOKING RULES — VERY IMPORTANT:
- When someone wants to book, ONLY ask for: their name, number of guests, preferred date, preferred time
- Do NOT ask about food preferences, dietary requirements, or occasion unless they bring it up
- Do NOT mention prices or menu details unless the customer specifically asks
- Do NOT ask unnecessary questions — keep it short and efficient
- Once you have: name + guests + date + time → respond with ONLY this JSON, nothing else:
{"booking":true,"name":"NAME","guests":"GUESTS","date":"DATE","time":"TIME"}

GENERAL RULES:
- Be warm and professional
- Keep answers very short — 1-3 sentences max
- If asked about menu or prices, give a brief general answer only
- Respond in the same language the customer uses (German or English)
- Never mention that you are an AI unless directly asked`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: systemPrompt,
        messages: messages.map(m => ({ role: m.role, content: m.content }))
      })
    });

    const data = await response.json();
    const reply = data.content?.map(b => b.text || '').join('') || 'Sorry, I could not respond.';

    // Check for booking JSON
    const jsonMatch = reply.match(/\{[\s\S]*?"booking"[\s\S]*?\}/);
    if (jsonMatch) {
      try {
        const booking = JSON.parse(jsonMatch[0]);
        if (booking.booking) {
          return res.json({ booking });
        }
      } catch(e) {}
    }

    return res.json({ reply });
  } catch(e) {
    return res.status(500).json({ reply: 'Something went wrong.' });
  }
}
