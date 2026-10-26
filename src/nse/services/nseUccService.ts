import { nseApi } from './nseApi';
import type { UCCRegistrationRequest, UCCRegistrationResponse } from '@/types/nse';

// Common checks only. Tax-status-specific requirements need the referenced
// master tables before an onboarding form can produce a complete request.
export function validateNSEUccRequest(body: UCCRegistrationRequest) {
  if (!Array.isArray(body.reg_details) || body.reg_details.length < 1 || body.reg_details.length > 50) throw new Error('Provide between 1 and 50 investor registrations');
  for (const item of body.reg_details) {
    const row = item as Record<string, unknown>;
    const text = (key: string) => String(row[key] ?? '').trim();
    if (Object.entries(row).some(([key, value]) => key !== key.trim() || typeof value === 'string' && value.trim().toLowerCase() === 'string')) throw new Error('Remove Swagger placeholders and spaces from field names');
    if (['reg_id', 'reg_status', 'reg_remark'].some(key => text(key))) throw new Error('Registration ID, status and remark are response fields and must be blank');
    const required: Record<string, number> = { client_code: 10, primary_holder_first_name: 70, tax_status: 5, primary_holder_dob_incorporation: 10, occupation_code: 5, holding_nature: 5, client_type: 1, div_pay_mode: 2, city: 35, state: 5, pincode: 6, email: 50, communication_mode: 1, primary_holder_kyc_type: 1, paperless_flag: 1, mobile_declaration_flag: 2, email_declaration_flag: 2 };
    for (const [key, max] of Object.entries(required)) if (!text(key) || text(key).length > max) throw new Error(`${key.replace(/_/g, ' ')} is required and must be at most ${max} characters`);
    const flags: Record<string, string[]> = { holding_nature: ['SI', 'JO', 'AS'], client_type: ['D', 'P'], primary_holder_pan_exempt: ['Y', 'N'], communication_mode: ['P', 'E', 'M'], primary_holder_kyc_type: ['K', 'C', 'B', 'E'], paperless_flag: ['P', 'Z'], div_pay_mode: ['01', '02', '03', '04', '05'] };
    for (const [key, options] of Object.entries(flags)) if (!options.includes(text(key))) throw new Error(`Use the documented code for ${key.replace(/_/g, ' ')}`);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text('email')) || !/^\d{6}$/.test(text('pincode'))) throw new Error('Enter a valid email and six-digit pincode');
    const date = text('primary_holder_dob_incorporation');
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date)) throw new Error('Date of birth/incorporation must use DD/MM/YYYY');
    const iso = date.split('/').reverse().join('-');
    if (!Number.isFinite(Date.parse(iso)) || new Date(iso).toISOString().slice(0, 10) !== iso || iso > new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })) throw new Error('Enter a valid nonfuture date of birth/incorporation');
    if (text('primary_holder_pan_exempt') === 'N' && !/^[A-Z]{5}\d{4}[A-Z]$/.test(text('primary_holder_pan'))) throw new Error('A valid primary holder PAN is required');
    if (text('primary_holder_pan_exempt') === 'Y' && (!text('primary_holder_exempt_category') || !text('primary_holder_kra_exempt_ref_no'))) throw new Error('PAN-exempt investors require category and KRA reference');
    if (text('primary_holder_kyc_type') === 'C' && !/^\d{14}$/.test(text('primary_holder_ckyc_number'))) throw new Error('CKYC requires a 14-digit CKYC number');
    for (let bank = 1; bank <= 5; bank++) {
      if (!text(`account_type_${bank}`)) continue;
      if (!['SB', 'CB', 'NE', 'NO'].includes(text(`account_type_${bank}`)) || !/^\d{1,40}$/.test(text(`account_no_${bank}`)) || !['Y', 'N'].includes(text(`default_bank_flag_${bank}`))) throw new Error(`Bank ${bank} requires valid account type, number and default flag`);
      if (bank === 1 || !text(`micr_no_${bank}`)) if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(text(`ifsc_code_${bank}`))) throw new Error(`Bank ${bank} requires a valid IFSC`);
      if (text(`micr_no_${bank}`) && !/^\d{9}$/.test(text(`micr_no_${bank}`))) throw new Error(`Bank ${bank} MICR must be nine digits`);
    }
    if (text('client_type') === 'D') {
      if (!['Y', 'N'].includes(text('pms')) || !['CDSL', 'NSDL'].includes(text('default_dp'))) throw new Error('Demat clients require PMS and default depository codes');
      const fields = text('default_dp') === 'CDSL' ? ['cdsl_dpid', 'cdslcltid'] : ['cmbp_id', 'nsdldpid', 'nsdlcltid'];
      if (fields.some(key => !text(key))) throw new Error('Supply the required demat account identifiers');
    }
  }
  return body;
}
export function parseNSEUccResponse(response: UCCRegistrationResponse, clientCode: string) {
  if (!Array.isArray(response?.reg_details) || response.reg_details.length !== 1) throw new Error('Mutual funds returned an unreadable investor registration result');
  const raw = response.reg_details[0];
  if (!raw || typeof raw !== 'object') throw new Error('Mutual funds returned an unreadable investor registration result');
  const row = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key.trim(), String(value ?? '').trim()]));
  if (row.client_code?.toUpperCase() !== clientCode.trim().toUpperCase()) throw new Error('Mutual funds returned a different client; registration is not confirmed');
  if (row.reg_status === 'REG_FAILED') return { state: 'rejected' as const, id: '', remark: row.reg_remark || 'Mutual funds rejected investor registration' };
  if (row.reg_status === 'REG_SUCCESS' && /^\d+$/.test(row.reg_id) && /[1-9]/.test(row.reg_id)) return { state: 'registered' as const, id: row.reg_id, remark: row.reg_remark };
  return { state: 'unknown' as const, id: '', remark: row.reg_remark || 'Registration is not confirmed. Check Mutual funds before retrying.' };
}
export async function registerNSEUcc(body: UCCRegistrationRequest) {
  validateNSEUccRequest(body);
  if (body.reg_details.length !== 1) throw new Error('This registration flow supports one investor at a time');
  return parseNSEUccResponse(await nseApi.registerInvestor(body), body.reg_details[0].client_code || '');
}
