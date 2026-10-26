import { nseRequest } from './nseApi';
import type { SecuritiesDeliveryRequest } from '../types/nse';
import { parseNSEDueDate } from './nseSipPauseService';
export interface NSEDeliveryInput { from_date: string; to_date: string; date_type: string; client_code: string; settlement_type: string; dp_type: string; order_ids: string; member_unique_ids: string; }
export function buildNSEDelivery(input: NSEDeliveryInput, today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })): SecuritiesDeliveryRequest {
  const list = (value: string, numeric = false) => {
    const items = value.split(',').map(item => item.trim());
    if (items.length > 50 || items.some(item => !item || item.toLowerCase() === 'string' || (numeric && !/^\d+$/.test(item)))) throw new Error('Enter up to 50 valid comma-separated values; order IDs must be numeric');
    return items.join(',');
  };
  if (!['ALL', 'L0', 'OTHERS'].includes(input.settlement_type)) throw new Error('Select a valid settlement type');
  if (!['ALL', 'CDSL', 'NSDL'].includes(input.dp_type)) throw new Error('Select a valid depository');
  if (input.date_type !== 'TRANSACTION DATE') throw new Error('Select transaction date');
  const from = parseNSEDueDate(input.from_date), to = parseNSEDueDate(input.to_date);
  if (from > today || to > today) throw new Error('Future report dates are not allowed');
  if (to <= from || Date.parse(to) - Date.parse(from) > 7 * 86400000) throw new Error('End date must be later than start date, with a maximum gap of 7 days');
  const dates = { from_date: from.split('-').reverse().join('-'), to_date: to.split('-').reverse().join('-') };
  if (input.order_ids.trim()) return { ...dates, order_ids: list(input.order_ids, true) };
  if (input.member_unique_ids.trim()) return { ...dates, member_unique_ids: list(input.member_unique_ids) };
  if (input.client_code.trim()) return { ...dates, client_code: list(input.client_code) };
  return { from_date: from.split('-').reverse().join('-'), to_date: to.split('-').reverse().join('-'), date_type: input.date_type, settlement_type: input.settlement_type, dp_type: input.dp_type };
}
export async function getNSEDelivery(input: NSEDeliveryInput) {
  const response = await nseRequest<{ response_status?: string; report_data?: unknown[]; error_remark?: string }>('/reports/securities-delivery-shortage', buildNSEDelivery(input), true, 'json', true);
  if (response.response_status !== 'S') throw new Error(response.error_remark || 'Mutual funds delivery report failed');
  if (!Array.isArray(response.report_data) || response.report_data.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('Mutual funds returned an unreadable delivery report');
  return response.report_data as Record<string, unknown>[];
}
