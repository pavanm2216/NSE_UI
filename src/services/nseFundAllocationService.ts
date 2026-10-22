import { nseRequest } from './nseApi';
import { parseNSEDueDate } from './nseSipPauseService';
export const NSE_PAYMENT_AGENCIES = { '3': 'Billdesk', '9': 'Digio', '4': 'ePay', '2': 'HDFC', '6': 'Razorpay', '8': 'Yes bank', '5': 'Camspay' };
export interface NSEFundAllocationInput { from_date: string; to_date: string; client_code: string; pg_bank_refno: string; order_id: string; pg_agencyid: string; }
export function buildNSEFundAllocation(input: NSEFundAllocationInput) {
  let from: string, to: string;
  try { from = parseNSEDueDate(input.from_date); to = parseNSEDueDate(input.to_date); }
  catch { throw new Error('Enter valid from and to dates'); }
  if (to < from) throw new Error('End date cannot be before start date');
  if (input.pg_agencyid && !Object.prototype.hasOwnProperty.call(NSE_PAYMENT_AGENCIES, input.pg_agencyid)) throw new Error('Select a documented payment provider');
  const list = (raw: string, numeric = false) => {
    const items = raw.split(',').map(item => item.trim());
    if (items.length > 50 || items.some(item => !item || item.toLowerCase() === 'string' || (numeric && !/^\d+$/.test(item)))) throw new Error('Enter up to 50 comma-separated values; order IDs must be numeric');
    return items.join(',');
  };
  return { from_date: from.split('-').reverse().join('-'), to_date: to.split('-').reverse().join('-'), client_code: input.client_code.trim() ? list(input.client_code) : '', pg_bank_refno: input.pg_bank_refno.trim() ? list(input.pg_bank_refno) : '', order_id: input.order_id.trim() ? list(input.order_id, true) : '', pg_agencyid: input.pg_agencyid };
}
export async function getNSEFundAllocation(input: NSEFundAllocationInput) {
  const body = buildNSEFundAllocation(input);
  const response = await nseRequest<{ response_status?: string; report_data?: unknown[]; error_remark?: string }>('/reports/member-fund-allocation/order-wise', body, true, 'json', true).catch((failure: unknown) => {
    if (failure instanceof Error && /^No record\(s\) found\.?$/i.test(failure.message.trim())) return { response_status: 'S', report_data: [], error_remark: '' };
    throw failure;
  });
  if (response.response_status === 'F' && /^No record\(s\) found\.?$/i.test(response.error_remark?.trim() || '') && Array.isArray(response.report_data) && !response.report_data.length) return [];
  if (response.response_status !== 'S') throw new Error(response.error_remark || 'Mutual funds fund allocation report failed');
  if (!Array.isArray(response.report_data) || response.report_data.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('Mutual funds returned an unreadable fund allocation report');
  return response.report_data as Record<string, unknown>[];
}
