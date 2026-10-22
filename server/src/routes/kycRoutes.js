const express = require('express');
const axios = require('axios');
const router = express.Router();
const config = require('../config/env');
const validateAadhaar = require('../middleware/validateAadhaar');
const { verifyAadhaarController } = require('../controllers/aadhaarController');

// POST /api/kyc/aadhaar/verify
router.post('/aadhaar/verify', validateAadhaar, verifyAadhaarController);

const rkycHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${config.rkyc.token}`,
});

// POST /api/kyc/rkyc/generate-url
router.post('/rkyc/generate-url', async (req, res) => {
  try {
    const { data } = await axios.post(
      `${config.rkyc.baseUrl}/kyc/india/digital/locker/v1/generate-url`,
      req.body,
      { headers: rkycHeaders(), timeout: 15000 }
    );
    res.json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: 'rKYC error' });
  }
});

// POST /api/kyc/rkyc/kyc-details
router.post('/rkyc/kyc-details', async (req, res) => {
  try {
    const { data } = await axios.post(
      `${config.rkyc.baseUrl}/kyc/india/digital/locker/v1/kyc-details`,
      req.body,
      { headers: rkycHeaders(), timeout: 15000 }
    );
    res.json(data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: 'rKYC error' });
  }
});

module.exports = router;
