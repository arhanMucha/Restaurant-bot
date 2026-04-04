import { google } from 'googleapis';

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('No authorization code received.');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    const refreshToken = tokens.refresh_token;

    // Show the refresh token to the owner so they can add it to env vars
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Calendar Connected</title>
        <style>
          body { font-family: sans-serif; padding: 40px; background: #0f0f13; color: #fff; text-align: center; }
          .box { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 24px; max-width: 600px; margin: 0 auto; }
          .token { background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px; font-family: monospace; font-size: 13px; word-break: break-all; margin: 16px 0; }
          .success { color: #4ade80; font-size: 24px; margin-bottom: 12px; }
          .instruction { color: rgba(255,255,255,0.6); font-size: 13px; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="box">
          <div class="success">✅ Google Calendar Connected!</div>
          <p style="margin-bottom:16px">Copy this refresh token and add it to your Vercel environment variables as <strong>GOOGLE_REFRESH_TOKEN</strong>:</p>
          <div class="token">${refreshToken || 'No refresh token received — please try again and make sure to revoke access first at myaccount.google.com/permissions'}</div>
          <p class="instruction">
            1. Go to your Vercel project dashboard<br>
            2. Settings → Environment Variables<br>
            3. Add: GOOGLE_REFRESH_TOKEN = the token above<br>
            4. Redeploy your project<br>
            5. Done — bookings now go directly into Google Calendar!
          </p>
        </div>
      </body>
      </html>
    `);
  } catch(e) {
    res.status(500).send('Error getting tokens: ' + e.message);
  }
}
