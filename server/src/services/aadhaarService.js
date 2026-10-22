const kycHubClient = require('../api/kycHubClient');

const KYC_ENDPOINT = '/kyc/india/v2/premmium-aadhaar-validation';

/**
 * Maps KYC Hub statusCode to a clean frontend response
 */
const mapKycResponse = (kycData) => {
  const { statusCode, data, referenceId } = kycData;

  switch (statusCode) {
    case 2011:
      return {
        success: true,
        verified: true,
        referenceId,
        state: data.state,
        ageBand: data.ageBand,
        gender: data.gender,
        mobileNumber: data.mobileNumber,
        message: data.message,
        statusMessage: data.statusMessage,
      };

    case 2012:
      return { success: true, verified: false, message: 'Aadhar does not exist' };

    case 2013:
      return { success: false, verified: false, message: 'Invalid Aadhaar format' };

    case 4015:
      return {
        success: false,
        verified: false,
        message: 'No response from Aadhaar source. Please try again later.',
      };

    default:
      return {
        success: false,
        verified: false,
        message: data?.message || 'Unexpected response from KYC service.',
      };
  }
};

/**
 * Calls KYC Hub Premium Aadhaar Validation API
 * @param {string} aadhaarNumber - 12-digit Aadhaar number
 */
const verifyAadhaar = async (aadhaarNumber) => {
  try {
    const response = await kycHubClient.post(KYC_ENDPOINT, { aadhaarNumber });
    return mapKycResponse(response.data);
  } catch (error) {
    // HTTP error responses from KYC Hub
    if (error.response) {
      const { status, data } = error.response;
      console.error(`[KYC Hub Error] HTTP ${status}:`, data);

      switch (status) {
        case 400:
          return { success: false, message: 'Bad Request' };

        case 401:
          return { success: false, message: 'Authentication Failed' };

        case 402:
          // Return actual subscription message from KYC Hub
          return {
            success: false,
            message: data?.message || data?.error || 'Subscription issue. Please check your KYC Hub plan.',
          };

        case 500:
          return { success: false, message: 'Internal Server Error' };

        case 503:
          return { success: false, message: 'Service Unavailable' };

        default:
          return { success: false, message: data?.message || 'KYC service error.' };
      }
    }

    // Network / timeout errors
    console.error('[KYC Hub Network Error]', error.message);
    throw error; // Let global error handler catch it
  }
};

module.exports = { verifyAadhaar };
