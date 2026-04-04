
const Anthropic = require("@anthropic-ai/sdk");

function systemPrompt() {
  const businessName = process.env.BUSINESS_NAME || "Trattoria Roma";
  const businessHours = process.env.BUSINESS_HOURS || "Tue-Sun 12:00-22:00";
  const businessAddress = process.env.BUSINESS_ADDRESS || "Maximilianstraße 8, Munich";
  const businessPhone = process.env.BUSINESS_PHONE || "+49 89 456789";

  return `You are the booking assistant for ${businessName}.

Business details:
- Name: ${businessName}
- Hours: ${businessHours}
- Address: ${businessAddress}
- Phone: ${businessPhone}

Rules:
- Be concise, friendly, and practical.
- Help with reservations, opening hours, address, and phone number.
- If the user wants to reserve, collect: number of guests, date, time, and reservation name.
- If some booking info is missing, ask only for the missing info.
- When you have all booking details, confirm the booking request clearly.
- Do not invent unavailable systems or confirmations. Say it is a booking request confirmation.
- Keep answers short and natural.`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "ANTHROPIC_API_KEY is missing" });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const incoming = Array.isArray(body?.messages) ? body.messages : [];

    const messages = incoming
      .filter(m => m && typeof m.content === "string" && (m.role === "user" || m.role === "assistant"))
      .map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content
      }));

    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 300,
      temperature: 0.4,
      system: systemPrompt(),
      messages
    });

    const reply = response.content
      .filter(item => item.type === "text")
      .map(item => item.text)
      .join("\n")
      .trim();

    return res.status(200).json({ reply: reply || "Sorry, I could not generate a reply." });
  } catch (error) {
    return res.status(500).json({
      error: error?.message || "Unknown server error"
    });
  }
};
