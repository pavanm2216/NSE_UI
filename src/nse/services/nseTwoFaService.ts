import { nseRequest } from './nseApi';
import { parseNSEDueDate } from './nseSipPauseService';
export const NSE_TWOFA_PRODUCTS = ['', 'PUR', 'RED', 'SWITCH', 'SIP', 'STP', 'SWP', ] as const;
export interface NSETwoFaInput { from_date: string; to_date: string; product_type: string; product_id: string; client_code: string; }
export function buildNSETwoFa(input: NSETwoFaInput) {
  const from = parseNSEDueDate(input.from_date), to = parseNSEDueDate(input.to_date);
  if (to < from || Date.parse(to) - Date.parse(from) > 7 * 86400000) throw new Error('Choose ordered dates with a maximum gap of 7 days');
  if (!(NSE_TWOFA_PRODUCTS as readonly string[]).includes(input.product_type)) throw new Error('Select a documented product type');
  const list = (value: string, numeric: boolean) => {
    const entries = value.split(',').map(item => item.trim());
    if (entries.length > 50 || entries.some(item => !item || item.toLowerCase() === 'string' || (numeric && !/^\d+$/.test(item)))) throw new Error(`Enter up to 50 comma-separated ${numeric ? 'numeric product IDs' : 'client codes'}`);
    return entries.join(',');
  };
  const base = { from_date: from.split('-').reverse().join('-'), to_date: to.split('-').reverse().join('-'), product_type: input.product_type };
  if (input.product_type && !input.product_id.trim()) throw new Error('Product IDs are required when a product type is selected');
  if (input.product_id.trim()) return { ...base, product_id: list(input.product_id, true) };
  return { ...base, ...(input.client_code.trim() ? { client_code: list(input.client_code, false) } : {}) };
}
export async function getNSETwoFa(input: NSETwoFaInput) {
  const response = await nseRequest<{ response_status?: string; report_data?: unknown[]; error_remark?: string }>('/reports/2fa', buildNSETwoFa(input), true, 'json', true);
  if (response?.response_status !== 'S') throw new Error(response?.error_remark || 'Mutual funds 2FA report failed');
  if (!Array.isArray(response.report_data) || response.report_data.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('Mutual funds returned an unreadable 2FA report');
  return response.report_data as Record<string, unknown>[];
}
