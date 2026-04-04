module.exports = async function handler(req, res) {
  const connected = Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REDIRECT_URI &&
    process.env.GOOGLE_CALENDAR_ID
  );
  res.status(200).json({ connected });
};
