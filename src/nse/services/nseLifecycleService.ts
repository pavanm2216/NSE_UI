import { nseRequest } from './nseApi';
import { parseNSEDueDate } from './nseSipPauseService';
export const NSE_LIFECYCLE_PRODUCTS = ['', 'PUR', 'RED', 'SWITCH', 'SIP', 'STP', 'SWP', 'MANDATE', 'SIP CANCEL', 'XSIP CANCEL', 'STP CANCEL', 'SWP CANCEL'] as const;
export interface NSELifecycleInput { from_date: string; to_date: string; Product_type: string; product_id: string; client_code: string; }
export function buildNSELifecycle(input: NSELifecycleInput) {
  const from = parseNSEDueDate(input.from_date), to = parseNSEDueDate(input.to_date);
  if (to < from || Date.parse(to) - Date.parse(from) > 7 * 86400000) throw new Error('Choose ordered dates with a maximum gap of 7 days');
  if (!(NSE_LIFECYCLE_PRODUCTS as readonly string[]).includes(input.Product_type)) throw new Error('Select a documented product type');
  const list = (value: string, numeric: boolean) => {
    const entries = value.split(',').map(item => item.trim());
    if (entries.length > 50 || entries.some(item => !item || item.toLowerCase() === 'string' || (numeric && !/^\d+$/.test(item)))) throw new Error(`Enter up to 50 comma-separated ${numeric ? 'numeric product IDs' : 'client codes'}`);
    return entries.join(',');
  };
  const base = { from_date: from.split('-').reverse().join('-'), to_date: to.split('-').reverse().join('-'), Product_type: input.Product_type };
  if (input.Product_type && !input.product_id.trim()) throw new Error('Product IDs are required when a product type is selected');
  if (input.product_id.trim()) return { ...base, product_id: list(input.product_id, true) };
  return { ...base, ...(input.client_code.trim() ? { client_code: list(input.client_code, false) } : {}) };
}
export async function getNSELifecycle(input: NSELifecycleInput) {
  const response = await nseRequest<{ response_status?: string; report_data?: unknown[]; error_remark?: string }>('/reports/order-lifecycle', buildNSELifecycle(input), true, 'json', true);
  if (response?.response_status !== 'S') throw new Error(response?.error_remark || 'Mutual funds lifecycle report failed');
  if (!Array.isArray(response.report_data) || response.report_data.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('Mutual funds returned an unreadable lifecycle report');
  return response.report_data as Record<string, unknown>[];
}
