const axios = require('axios');
const config = require('../config/env');

// Axios instance for KYC Hub API
const kycHubClient = axios.create({
  baseURL: config.kycHub.baseUrl,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.kycHub.token}`,
  },
  timeout: 15000,
});

module.exports = kycHubClient;
