import { getUccProfileFields, normalizeUccProfile } from './nseUccProfileService';
import { UCC_NOMINEE_FIELDS, getUccNomineeCount, getUccNomineeShare } from './nseUccNomineeService';
import { nseApi, NSEApiError } from './nseApi';
import { validateNSEUccDraft } from './nseUccDraftService';
import { validateNSEMasterValues } from './nseDocumentMasters';
import type { UCCDetail, UCCRegistrationRequest, UCCRegistrationResponse } from '@/types/nse';

// Conditional profile fields follow the selected tax status, holding and depository.
const fieldLimits: Record<string, number> = {
  client_code: 10, primary_holder_first_name: 70, primary_holder_middle_name: 70, primary_holder_last_name: 70,
  primary_holder_pan: 10, tax_status: 5, occupation_code: 5, gender: 1, account_type_1: 2, account_no_1: 40,
  ifsc_code_1: 11, micr_no_1: 9, div_pay_mode: 2, address_1: 40, address_2: 40, address_3: 40,
  city: 35, state: 5, pincode: 6, country: 35, email: 50, indian_mobile_no: 10, communication_mode: 1,
  primary_holder_kyc_type: 1, primary_holder_ckyc_number: 14, aadhaar_updated: 1, paperless_flag: 1,
  mobile_declaration_flag: 2, email_declaration_flag: 2, nomination_opt: 1, nomination_authentication: 1,
  nominee_soa: 1, nominee_opt_out_ref_no: 20,
};
const enums: Record<string, readonly string[]> = {
  gender: ['M', 'F', 'O', 'T'], div_pay_mode: ['01', '02', '03', '04', '05'], communication_mode: ['P', 'E', 'M'],
  primary_holder_kyc_type: ['K', 'C', 'B', 'E'], aadhaar_updated: ['Y', 'N'], paperless_flag: ['P', 'Z'],
  nomination_opt: ['Y', 'N'], nominee_soa: ['Y', 'N'],
};

export function buildNSEUccRegistration(values: Record<string, string>): UCCRegistrationRequest {
  const clean = normalizeUccProfile(Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim()])));
  if (clean.primary_holder_pan) clean.primary_holder_pan = clean.primary_holder_pan.toUpperCase();
  clean.ifsc_code_1 = clean.ifsc_code_1?.toUpperCase() || '';
  for (let index = 1; index <= 3; index++) {
    if (clean[`nominee_${index}_identity_type`] === '1') clean[`nominee_${index}_identity_no`] = clean[`nominee_${index}_identity_no`]?.toUpperCase() || '';
  }
  // Clear fields which no longer apply before validation and request mapping.
  if (clean.primary_holder_kyc_type !== 'C') clean.primary_holder_ckyc_number = '';
  if (clean.nomination_opt === 'N') {
    for (const key of Object.keys(clean)) if (/^nominee_\d+_/.test(key) || key === 'nominee_soa') delete clean[key];
  } else delete clean.nominee_opt_out_ref_no;
  validateNSEUccDraft(clean);
  validateNSEMasterValues('client', clean);
  for (const [key, max] of Object.entries(fieldLimits)) {
    const value = clean[key];
    if (value && (value.length > max || /[|\r\n]/.test(value))) throw new Error(`Enter ${key.replace(/_/g, ' ')} within ${max} characters without line breaks or pipe characters`);
  }
  for (const [key, allowed] of Object.entries(enums)) {
    if ((clean[key] || key === 'aadhaar_updated') && !allowed.includes(clean[key])) throw new Error(`Select ${key.replace(/_/g, ' ')}`);
  }
  const authentication = clean.nomination_opt === 'Y' ? ['W', 'E', 'O'] : ['O', 'V'];
  if (!authentication.includes(clean.nomination_authentication)) throw new Error('Select an authentication method for this nomination choice');

  const row: UCCDetail = {
    holding_nature: clean.holding_nature, client_type: clean.client_type, primary_holder_pan_exempt: clean.primary_holder_pan_exempt, default_bank_flag_1: 'Y',
    primary_holder_dob_incorporation: clean.primary_holder_dob_incorporation.split('-').reverse().join('/'),
  };
  // Whitelist form fields: confirmation controls, unused fields and
  // reg_id/reg_status/reg_remark must never be copied into registration requests.
  for (const key of Object.keys(fieldLimits)) {
    if (!/^nominee_\d+_/.test(key) && clean[key] !== undefined) row[key] = clean[key];
  }
  for (const field of getUccProfileFields(clean)) {
    if (clean[field.key]) row[field.key] = /_dob$/.test(field.key) || field.key === 'lei_validity' ? clean[field.key].split('-').reverse().join('/') : clean[field.key];
  }
  // The domestic address country uses the API name, not the file master code.
  if (clean.country === '101') row.country = 'INDIA';
  if (clean.nomination_opt === 'Y') {
    for (let index = 1; index <= getUccNomineeCount(clean); index++) {
      const prefix = `nominee_${index}_`;
      for (const field of UCC_NOMINEE_FIELDS) {
        const wireSuffix = field.suffix === 'identity_no' ? 'identity_number' : field.suffix === 'pincode' ? 'pin' : field.suffix;
        row[prefix + wireSuffix] = field.suffix === 'applicable' ? getUccNomineeShare(clean, index) : clean[prefix + field.suffix] || '';
      }
      row[prefix + 'minor_flag'] = 'N';
    }
  }
  // PDF column 176 requires the opt-out reference. The deployed API currently
  // rejects this field; registerNSEUcc explains that backend contract mismatch.
  return { reg_details: [row] };
}

export interface NSEUccRegistrationResult {
  state: 'registered' | 'rejected' | 'unknown'; clientCode: string; registrationId?: string; remark: string;
}
export function parseNSEUccRegistration(response: UCCRegistrationResponse, clientCode: string): NSEUccRegistrationResult {
  const unknown = (remark = 'Registration is not confirmed. Check the Client Registration Report before submitting again.'): NSEUccRegistrationResult => ({ state: 'unknown', clientCode, remark });
  if (!Array.isArray(response?.reg_details) || response.reg_details.length !== 1) return unknown();
  const row = response.reg_details[0];
  if (typeof row?.client_code !== 'string' || row.client_code.trim().toUpperCase() !== clientCode.toUpperCase()) return unknown('Mutual funds returned a different client code. Check the Client Registration Report before submitting again.');
  const status = typeof row.reg_status === 'string' ? row.reg_status.trim().toUpperCase() : '';
  const remark = typeof row.reg_remark === 'string' ? row.reg_remark.trim() : '';
  if (status === 'REG_FAILED') return { state: 'rejected', clientCode, remark: remark || 'Mutual funds rejected the client registration' };
  const id = typeof row.reg_id === 'string' ? row.reg_id.trim() : '';
  const envelope = typeof response.response_status === 'string' ? response.response_status.trim().toUpperCase() : response.response_status == null ? '' : 'UNKNOWN';
  if (status === 'REG_SUCCESS' && /^\d+$/.test(id) && /[1-9]/.test(id) && (!envelope || ['S', 'SUCCESS'].includes(envelope))) {
    return { state: 'registered', clientCode, registrationId: id, remark: remark || 'Mutual funds confirmed client registration' };
  }
  return unknown(remark ? `${remark}. Registration is not confirmed; check the Client Registration Report before submitting again.` : undefined);
}

export async function registerNSEUcc(values: Record<string, string>): Promise<NSEUccRegistrationResult> {
  const body = buildNSEUccRegistration(values);
  const clientCode = body.reg_details[0].client_code!;
  try {
    return parseNSEUccRegistration(await nseApi.registerInvestor(body), clientCode);
  } catch (failure) {
    if (failure instanceof NSEApiError && failure.status === 422 && /nominee_opt_out_ref_no/i.test(failure.message) && /extra inputs are not permitted/i.test(failure.message)) {
      return { state: 'rejected', clientCode, remark: 'The registration API does not accept the nomination opt-out reference required by the registration specification. The API provider must add support for nominee_opt_out_ref_no before this opt-out registration can proceed. Your investor details do not need changing for this error.' };
    }
    const remark = failure instanceof Error ? failure.message : 'Mutual funds registration confirmation is unavailable';
    // Explicit HTTP validation/authentication failures did not accept this request.
    const rejected = failure instanceof NSEApiError && [400, 401, 403, 409, 422].includes(failure.status);
    return { state: rejected ? 'rejected' : 'unknown', clientCode, remark };
  }
}
