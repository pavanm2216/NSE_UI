import { nseRequest } from './nseApi';
import { parseNSEDueDate } from './nseSipPauseService';
export interface NSETopupInput {
  product: 'SIP' | 'XSIP'; id: string; client: string; baseAmount: string; baseStart: string; baseEnd: string;
  amount: string; start: string; end: string; mobile: string; email: string; reference: string;
}
export function buildNSETopup(input: NSETopupInput, today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })) {
  if (!['SIP', 'XSIP'].includes(input.product) || !/^\d{1,15}$/.test(input.id) || !/[1-9]/.test(input.id) || !input.client.trim() || input.client.length > 10 || input.client.toLowerCase() === 'string') throw new Error('A valid Mutual funds plan and client are required');
  const money = (value: string) => /^\d{1,10}(\.\d{1,2})?$/.test(value) && Number(value) > 0;
  if (!money(input.baseAmount) || !money(input.amount)) throw new Error('Base and top-up amounts must be positive with at most two decimal places');
  const baseStart = parseNSEDueDate(input.baseStart), baseEnd = parseNSEDueDate(input.baseEnd);
  const start = parseNSEDueDate(input.start), end = parseNSEDueDate(input.end);
  if (start <= today || start < baseStart || start.slice(-2) !== baseStart.slice(-2)) throw new Error('Top-up start must be in the future, on the base plan’s installment day, and on or after its start date');
  const months = (Number(end.slice(0, 4)) - Number(start.slice(0, 4))) * 12 + Number(end.slice(5, 7)) - Number(start.slice(5, 7));
  if (end > baseEnd || months < 12 || months % 12 !== 0 || end.slice(-2) !== start.slice(-2)) throw new Error('End date must be a whole number of years after top-up start, at least one year, and no later than the base plan end');
  const mobile = input.mobile.trim(), email = input.email.trim();
  if (!mobile && !email) throw new Error('Enter a primary holder mobile number or email');
  if (mobile && !/^[6-9]\d{9}$/.test(mobile)) throw new Error('Enter a valid 10-digit mobile number');
  if (email && (email.length > 50 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) throw new Error('Enter a valid email of up to 50 characters');
  if (!input.reference || input.reference.length > 25) throw new Error('A unique reference of up to 25 characters is required');
  return { reg_data: [{ client_code: input.client.trim(), req_type: input.product === 'XSIP' ? 'XSP' : 'SIP', sip_reg_no: input.id, installment_amount: input.baseAmount, topup_frequency: 'ANNUALLY', topup_amount: input.amount, start_date: start.split('-').reverse().join('/'), end_date: end.split('-').reverse().join('/'), internal_ref_no: input.reference, primary_holder_mobile: mobile, primary_holder_email: email }] };
}
export async function registerNSETopup(input: NSETopupInput) {
  const body = buildNSETopup(input);
  const response = await nseRequest<{ reg_data?: Array<{ client_code?: string; sip_reg_no?: string | number; req_type?: string; reg_id?: string | number; reg_status?: string; reg_remark?: string }> }>('/sip-topup/register', body);
  const rows = response?.reg_data;
  if (!Array.isArray(rows) || rows.length !== 1 || String(rows[0]?.sip_reg_no) !== input.id || rows[0]?.client_code?.trim().toUpperCase() !== input.client.trim().toUpperCase() || rows[0]?.req_type !== body.reg_data[0].req_type) throw new Error('Mutual funds returned no matching top-up result. Check status before retrying.');
  const row = rows[0], id = String(row.reg_id ?? '').trim();
  if (row.reg_status === 'REG_FAILED') throw new Error(row.reg_remark?.trim() || 'Mutual funds rejected the top-up registration');
  if (row.reg_status !== 'REG_SUCCESS' || !/^\d{1,15}$/.test(id) || !/[1-9]/.test(id)) throw new Error('Top-up registration is not confirmed. Check status before retrying.');
  return { id, remark: row.reg_remark?.trim() || 'Mutual funds confirmed top-up registration' };
}
