# Restaurant Bot Complete

This is a simple Vercel-ready bot:
- `index.html` = frontend
- `api/chat.js` = Anthropic backend
- `api/health.js` = health check
- `api/config.js` = public business details
- `api/calendar-status.js` = shows if Google Calendar is connected

## What works
- Real Anthropic replies when `ANTHROPIC_API_KEY` is set
- Booking conversation
- Business details shown from env vars
- Vercel deployment

## What is not finished automatically
- Full Google Calendar OAuth connect flow for end users
- Automatic calendar event creation
- Website widget embed snippet

## Deploy on Vercel
1. Upload this project to GitHub
2. Import the repo in Vercel
3. Root directory: repo root
4. Add env vars from `.env.example`
5. Deploy

## Required env vars
- `ANTHROPIC_API_KEY`
- `BUSINESS_NAME`
- `BUSINESS_HOURS`
- `BUSINESS_ADDRESS`
- `BUSINESS_PHONE`

## Optional for later
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `GOOGLE_CALENDAR_ID`
- `GOOGLE_REFRESH_TOKEN`

## Test
Open the site and say:
`I want to book a table for 2 on Saturday at 19:00`

## Important
Do not paste secret keys into chat. Put them only in Vercel environment variables.
