import axios from 'axios';

const kycClient = axios.create({
  baseURL: import.meta.env.VITE_KYC_HUB_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_KYC_HUB_TOKEN}`,
  },
  timeout: 15000,
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AadhaarResult {
  success: boolean;
  verified: boolean;
  referenceId?: number;
  state?: string;
  ageBand?: string;
  gender?: string;
  mobileNumber?: string;
  message: string;
  statusMessage?: string;
}

export interface PanResult {
  success: boolean;
  verified: boolean;
  name?: string;
  panStatus?: string;
  panType?: string;
  message: string;
}

export interface BankResult {
  success: boolean;
  verified: boolean;
  nameAtBank?: string;
  bankName?: string;
  accountStatus?: string;
  message: string;
}

export interface DLResult {
  success: boolean;
  verified: boolean;
  name?: string;
  dob?: string;
  dlNumber?: string;
  message: string;
}

// ─── Aadhaar Verification ─────────────────────────────────────────────────────

export const verifyAadhaar = async (aadhaarNumber: string): Promise<AadhaarResult> => {
  // Frontend validation: exactly 12 digits
  if (!/^\d{12}$/.test(aadhaarNumber)) {
    return { success: false, verified: false, message: 'Aadhaar Number must contain exactly 12 digits.' };
  }

  try {
    const { data } = await kycClient.post('/kyc/india/v2/premmium-aadhaar-validation', { aadhaarNumber });

    switch (data.statusCode) {
      case 2011:
        return {
          success: true, verified: true,
          referenceId: data.referenceId,
          state: data.data?.state,
          ageBand: data.data?.ageBand,
          gender: data.data?.gender,
          mobileNumber: data.data?.mobileNumber,
          message: data.data?.message || 'Aadhaar Verified',
          statusMessage: data.data?.statusMessage,
        };
      case 2012:
        return { success: true, verified: false, message: 'Aadhaar does not exist.' };
      case 2013:
        return { success: false, verified: false, message: 'Invalid Aadhaar format.' };
      case 4015:
        return { success: false, verified: false, message: 'No response from Aadhaar source. Please try again.' };
      default:
        return { success: false, verified: false, message: data.data?.message || 'Unexpected response.' };
    }
  } catch (err) {
    return handleHttpError(err) as AadhaarResult;
  }
};

// ─── PAN Verification v2 ──────────────────────────────────────────────────────

export const verifyPan = async (panNumber: string): Promise<PanResult> => {
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
    return { success: false, verified: false, message: 'Invalid PAN format. Expected: ABCDE1234F' };
  }
  try {
    const { data } = await axios.post(
      '/rkyc-api/kyc/india/v2/fetch-pan',
      { pan: panNumber },
      { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_RKYC_TOKEN}` }, timeout: 15000 }
    );
    if (data.statusCode === 2009) {
      return {
        success: true, verified: true,
        name: data.data?.name,
        panStatus: data.data?.panStatus,
        panType: data.data?.category,
        message: data.data?.message || 'PAN Verified Successfully',
      };
    }
    return { success: false, verified: false, message: data.data?.message || 'PAN could not be verified.' };
  } catch (err) {
    return handleHttpError(err) as PanResult;
  }
};

// ─── Bank Account Verification v3 ────────────────────────────────────────────

export const verifyBankAccount = async (
  accountNumber: string,
  name: string,
  ifsc: string,
  phoneNumber: string
): Promise<BankResult> => {
  if (!accountNumber || !ifsc) {
    return { success: false, verified: false, message: 'Account number and IFSC are required.' };
  }
  try {
    const { data } = await axios.post(
      '/rkyc-api/kyc/india/v3/verify-bank-account',
      { account_number: accountNumber, name, ifsc, phone_number: phoneNumber },
      { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_RKYC_TOKEN}` }, timeout: 15000 }
    );
    if (data.statusCode === 1001) {
      return {
        success: true, verified: true,
        nameAtBank: data.data?.result?.nameAtBank,
        bankName: data.data?.result?.bankName,
        accountStatus: data.data?.accountStatus,
        message: data.data?.message || 'Bank Account Verified Successfully',
      };
    }
    return { success: false, verified: false, message: data.data?.message || 'Bank account could not be verified.' };
  } catch (err) {
    return handleHttpError(err) as BankResult;
  }
};

// ─── Driving Licence Verification (document upload) ──────────────────────────

export const verifyDrivingLicence = async (file: File): Promise<DLResult> => {
  try {
    const formData = new FormData();
    formData.append('multipartFile', file);
    const { data } = await axios.post(
      `${import.meta.env.VITE_KYC_HUB_BASE_URL}/kyc/india/v2/document-verification?docType=DRIVING_LICENCE`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_KYC_HUB_TOKEN}`,
        },
        timeout: 30000,
      }
    );
    if (data.statusCode === 101 || data.data?.status === 'VALID' || data.data?.documentStatus === 'VALID') {
      return {
        success: true, verified: true,
        name: data.data?.name,
        dob: data.data?.dob,
        dlNumber: data.data?.dlNumber || data.data?.documentNumber,
        message: 'Driving Licence Verified Successfully',
      };
    }
    return { success: false, verified: false, message: data.data?.message || 'Could not verify driving licence.' };
  } catch (err) {
    return handleHttpError(err) as DLResult;
  }
};

// ─── GST Verification ────────────────────────────────────────────────────────

export interface GstResult {
  success: boolean;
  verified: boolean;
  legalName?: string;
  tradeName?: string;
  companyStatus?: string;
  constitution?: string;
  effectiveDate?: string;
  gstin?: string;
  message: string;
}

export const verifyGst = async (gstNumber: string): Promise<GstResult> => {
  try {
    const { data } = await axios.post(
      '/rkyc-api/kyc/india/v2/gst-details',
      { gstNumber },
      { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_RKYC_TOKEN}` }, timeout: 15000 }
    );
    if (data.statusCode === 2101) {
      const d = data.data?.details || {};
      return {
        success: true, verified: true,
        legalName: d['LEGAL NAME OF BUSINESS'],
        tradeName: d['TRADE NAME'],
        companyStatus: d['COMPANY STATUS'],
        constitution: d['CONSTITUTION OF BUSINESS'],
        effectiveDate: d['EFFECTIVE DATE OF REGISTRATION'],
        gstin: d['GSTIN / UIN  STATUS'],
        message: 'GST Verified Successfully',
      };
    }
    return { success: false, verified: false, message: data.data?.message || 'GST could not be verified.' };
  } catch (err) {
    return handleHttpError(err) as GstResult;
  }
};

// ─── CIN Verification ────────────────────────────────────────────────────────

export interface CinResult {
  success: boolean;
  verified: boolean;
  companyName?: string;
  companyStatus?: string;
  dateOfIncorporation?: string;
  registeredAddress?: string;
  category?: string;
  message: string;
}

export const verifyCin = async (cin: string): Promise<CinResult> => {
  try {
    const { data } = await axios.post(
      '/rkyc-api/kyc/india/v2/cin-simple-search',
      { cin },
      { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_RKYC_TOKEN}` }, timeout: 15000 }
    );
    if (data.statusCode === 2151) {
      return {
        success: true, verified: true,
        companyName: data.data?.companyName,
        companyStatus: data.data?.companyStatus,
        dateOfIncorporation: data.data?.dateOfIncorporation,
        registeredAddress: data.data?.registeredAddress,
        category: data.data?.category,
        message: data.data?.message || 'CIN Verified Successfully',
      };
    }
    return { success: false, verified: false, message: data.data?.message || 'CIN could not be verified.' };
  } catch (err) {
    return handleHttpError(err) as CinResult;
  }
};

// ─── UAM / Udyam Verification ─────────────────────────────────────────────────

export interface UamResult {
  success: boolean;
  verified: boolean;
  nameOfEnterprise?: string;
  organisationType?: string;
  majorActivity?: string;
  typeOfEnterprise?: string;
  dateOfIncorporation?: string;
  message: string;
}

export const verifyUam = async (uam: string): Promise<UamResult> => {
  try {
    const { data } = await axios.post(
      '/rkyc-api/kyc/india/v3/udhyog-aadhaar-details',
      { uam },
      { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_RKYC_TOKEN}` }, timeout: 15000 }
    );
    if (data.statusCode === 2121) {
      return {
        success: true, verified: true,
        nameOfEnterprise: data.data?.nameOfEnterprise,
        organisationType: data.data?.organisationType,
        majorActivity: data.data?.majorActivity,
        typeOfEnterprise: data.data?.typeOfEnterprise,
        dateOfIncorporation: data.data?.dateOfIncorporation,
        message: data.data?.message || 'Udyam Aadhaar Verified Successfully',
      };
    }
    return { success: false, verified: false, message: data.data?.message || 'UAM could not be verified.' };
  } catch (err) {
    return handleHttpError(err) as UamResult;
  }
};

// ─── rKYC Digital Locker ─────────────────────────────────────────────────────

export interface RkycPayload {
  uid: string;
  firstName: string;
  lastName: string;
  mobile: string;
  emailId: string;
  isSendOtp: boolean;
  isHideExplanationScreen: boolean;
  redirectionUrl: string;
}

export interface RkycResult {
  success: boolean;
  url?: string;
  kycUrl?: string;
  transactionId?: string;
  referenceId?: number;
  message: string;
}

export interface RkycDetails {
  success: boolean;
  status?: string;
  name?: string;
  gender?: string;
  dob?: string;
  maskedAdharNumber?: string;
  address?: Record<string, string>;
  image?: string;
  digilockerFiles?: { docLink: string; docType: string; docExtension: string }[];
  message: string;
}

export const fetchRkycDetails = async (transactionId: string): Promise<RkycDetails> => {
  try {
    const { data } = await axios.post(
      '/rkyc-api/kyc/india/digital/locker/v1/kyc-details',
      { transactionId },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_RKYC_TOKEN}`,
        },
        timeout: 15000,
      }
    );
    if (data.statusCode === 101) {
      return {
        success: true,
        status: data.data?.status,
        name: data.data?.name,
        gender: data.data?.gender,
        dob: data.data?.dob,
        maskedAdharNumber: data.data?.maskedAdharNumber,
        address: data.data?.address,
        image: data.data?.image,
        digilockerFiles: data.data?.digilockerFiles,
        message: 'KYC details fetched successfully',
      };
    }
    return { success: false, message: data.message || 'Failed to fetch KYC details' };
  } catch (err) {
    return { ...(handleHttpError(err) as RkycDetails), success: false };
  }
};

export const generateRkycUrl = async (payload: RkycPayload): Promise<RkycResult> => {
  try {
    const { data } = await axios.post(
      '/rkyc-api/kyc/india/digital/locker/v1/generate-url',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_RKYC_TOKEN}`,
        },
        timeout: 15000,
      }
    );
    if (data.statusCode === 101) {
      return {
        success: true,
        url: data.data?.url,
        kycUrl: data.data?.kycUrl,
        transactionId: data.data?.transactionId,
        referenceId: data.referenceId,
        message: 'KYC URL generated successfully',
      };
    }
    return { success: false, message: data.message || 'Failed to generate KYC URL' };
  } catch (err) {
    return { ...(handleHttpError(err) as RkycResult), success: false };
  }
};

// ─── Shared HTTP error handler ────────────────────────────────────────────────

const handleHttpError = (err: unknown): { success: false; verified: false; message: string } => {
  if (axios.isAxiosError(err) && err.response) {
    const { status, data } = err.response;
    const msgMap: Record<number, string> = {
      400: 'Bad Request',
      401: 'Authentication Failed',
      402: data?.message || 'Subscription issue with KYC service.',
      500: 'Internal Server Error',
      503: 'Service Unavailable. Please try again later.',
    };
    return { success: false, verified: false, message: msgMap[status] || data?.message || 'KYC service error.' };
  }
  return { success: false, verified: false, message: 'Network error. Please check your connection.' };
};
