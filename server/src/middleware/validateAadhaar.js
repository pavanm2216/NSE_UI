/**
 * Middleware: Validate Aadhaar number
 * Rules: required, exactly 12 digits, numbers only
 */
const validateAadhaar = (req, res, next) => {
  const { aadhaarNumber } = req.body;

  if (!aadhaarNumber) {
    return res.status(400).json({ success: false, message: 'Aadhaar Number is required.' });
  }

  if (!/^\d{12}$/.test(String(aadhaarNumber))) {
    return res.status(400).json({
      success: false,
      message: 'Aadhaar Number must contain exactly 12 digits.',
    });
  }

  next();
};

module.exports = validateAadhaar;
