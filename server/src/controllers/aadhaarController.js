const { verifyAadhaar } = require('../services/aadhaarService');

/**
 * POST /api/kyc/aadhaar/verify
 * Body: { aadhaarNumber: "123456789012" }
 */
const verifyAadhaarController = async (req, res, next) => {
  try {
    const { aadhaarNumber } = req.body;
    const result = await verifyAadhaar(aadhaarNumber);
    return res.status(200).json(result);
  } catch (error) {
    next(error); // Forward to global error handler
  }
};

module.exports = { verifyAadhaarController };
