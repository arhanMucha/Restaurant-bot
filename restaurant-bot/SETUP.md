# Restaurant AI Chatbot — Setup Guide

## STEP 1: Get your Anthropic API Key
1. Go to console.anthropic.com
2. Sign up → API Keys → Create Key
3. Copy it (starts with sk-ant-)
4. Add €10-20 credit in Billing

## STEP 2: Get Google Calendar API credentials
1. Go to console.cloud.google.com
2. Create new project → name it "Restaurant Bot"
3. Enable APIs → search "Google Calendar API" → Enable
4. Credentials → Create Credentials → OAuth 2.0 Client ID
5. Application type: Web Application
6. Add Authorized redirect URI: https://YOUR-APP.vercel.app/api/auth/callback
7. Download credentials — copy Client ID and Client Secret

## STEP 3: Deploy to Vercel
1. Go to vercel.com → Sign up free
2. Click "Add New Project" → "Import" → drag this entire folder
3. Before deploying, add these Environment Variables:

| Variable | Value |
|---|---|
| ANTHROPIC_API_KEY | your key from Step 1 |
| GOOGLE_CLIENT_ID | from Step 2 |
| GOOGLE_CLIENT_SECRET | from Step 2 |
| GOOGLE_REDIRECT_URI | https://YOUR-APP.vercel.app/api/auth/callback |
| BUSINESS_NAME | Trattoria Roma |
| BUSINESS_HOURS | Tuesday–Sunday, 12:00–22:00 |
| BUSINESS_ADDRESS | Maximilianstraße 8, Munich |
| BUSINESS_PHONE | +49 89 456789 |
| GOOGLE_CALENDAR_ID | primary |

4. Click Deploy → wait 2 minutes → you get a live URL

## STEP 4: Connect Google Calendar (owner does this ONCE)
1. Go to your live URL
2. Click "Connect Calendar" button
3. Sign in with the restaurant owner's Google account
4. You'll see a refresh token on screen
5. Copy it → go to Vercel → Settings → Environment Variables
6. Add: GOOGLE_REFRESH_TOKEN = the token
7. Redeploy → Done!

## STEP 5: Add to client's website
Paste this one line before </body> on their website:
<script src="https://YOUR-APP.vercel.app/widget.js"></script>

## FOR EACH NEW CLIENT:
- Create a new Vercel project (free, unlimited)
- Change the BUSINESS_NAME, HOURS, ADDRESS, PHONE variables
- Get the owner to connect their own Google Calendar (Step 4)
- Deploy → give them the embed code
- Takes about 15 minutes per client
