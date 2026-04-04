module.exports = async function handler(req, res) {
  res.status(200).json({
    businessName: process.env.BUSINESS_NAME || "Trattoria Roma",
    businessHours: process.env.BUSINESS_HOURS || "Tue-Sun 12:00-22:00",
    businessAddress: process.env.BUSINESS_ADDRESS || "Maximilianstraße 8, Munich",
    businessPhone: process.env.BUSINESS_PHONE || "+49 89 456789"
  });
};
