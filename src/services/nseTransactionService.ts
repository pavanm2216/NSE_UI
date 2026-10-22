import { nseRequest } from './nseApi';
import { parseNSEDueDate } from './nseSipPauseService';
export const NSE_TRANSACTION_DATES = ['REQUEST_DATE', 'ORDER_DATE', 'LAST_ACTIVITY_DATE'] as const;
export interface NSETransactionInput { from_date: string; to_date: string; date_type: string; order_id: string; systematic_reg_id: string; client_code: string; applicant_name: string; pan: string; }
export function buildNSETransaction(input: NSETransactionInput) {
  if (!(NSE_TRANSACTION_DATES as readonly string[]).includes(input.date_type)) throw new Error('Select a valid date basis');
  const from = parseNSEDueDate(input.from_date), to = parseNSEDueDate(input.to_date);
  const gap = input.date_type === 'LAST_ACTIVITY_DATE' ? 3 : 7;
  if (to < from || Date.parse(to) - Date.parse(from) > gap * 86400000) throw new Error(`Maximum date gap for this basis is ${gap} days`);
  const base = { from_date: from.split('-').reverse().join('-'), to_date: to.split('-').reverse().join('-') };
  const ids = (value: string) => { const entries = value.split(',').map(item => item.trim()); if (entries.length > 50 || entries.some(item => !/^\d+$/.test(item))) throw new Error('Enter up to 50 numeric IDs'); return entries.join(','); };
  if (input.order_id.trim()) return { ...base, order_id: ids(input.order_id) };
  if (input.systematic_reg_id.trim()) return { ...base, systematic_reg_id: ids(input.systematic_reg_id) };
  if (input.client_code.trim().length > 20) throw new Error('Client code must be at most 20 characters');
  const pan = input.pan.trim().toUpperCase();
  if (pan && !/^[A-Z]{5}\d{4}[A-Z]$/.test(pan)) throw new Error('Enter a valid PAN');
  if ([input.client_code, input.applicant_name].some(value => value.trim().toLowerCase() === 'string')) throw new Error('Replace placeholders with actual filters');
  return { ...base, date_type: input.date_type, client_code: input.client_code.trim(), applicant_name: input.applicant_name.trim(), pan };
}
export async function getNSETransactions(input: NSETransactionInput) {
  const response = await nseRequest<{ response_status?: string; report_data?: unknown[]; error_remark?: string }>('/reports/transaction-detail', buildNSETransaction(input), true, 'json', true);
  if (response?.response_status !== 'S') throw new Error(response?.error_remark || 'Mutual funds transaction detail report failed');
  if (!Array.isArray(response.report_data) || response.report_data.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('Mutual funds returned an unreadable transaction report');
  return response.report_data as Record<string, unknown>[];
}
