import { nseRequest } from './nseApi';
import { parseNSEDueDate } from './nseSipPauseService';
export interface NSEClientAuthorizationInput { from_date: string; to_date: string; client_code: string; auth_status: string; date_type: string; }
export function buildClientAuthorization(input: NSEClientAuthorizationInput) {
  const from = parseNSEDueDate(input.from_date), to = parseNSEDueDate(input.to_date);
  if (to < from || Date.parse(to) - Date.parse(from) > 7 * 86400000) throw new Error('Choose ordered dates with a maximum gap of 7 days');
  const base = { from_date: from.split('-').reverse().join('-'), to_date: to.split('-').reverse().join('-') };
  if (input.client_code.trim()) {
    const codes = input.client_code.split(',').map(code => code.trim());
    if (codes.length > 50 || codes.some(code => !code || code.toLowerCase() === 'string')) throw new Error('Enter up to 50 client codes');
    return { ...base, client_code: codes.join(',') };
  }
  if (!['', 'PENDING', 'AUTHORIZE', 'REVIEW'].includes(input.auth_status) || !['AUTH_SENT_DATE', 'AUTH_DONE_DATE'].includes(input.date_type)) throw new Error('Select documented authorization and date filters');
  return { ...base, auth_status: input.auth_status, date_type: input.date_type };
}
export async function getClientAuthorizations(input: NSEClientAuthorizationInput) {
  const response = await nseRequest<{ response_status?: string; report_data?: unknown[]; error_remark?: string }>('/reports/client-authorization', buildClientAuthorization(input), true, 'json', true);
  if (response?.response_status !== 'S') throw new Error(response?.error_remark || 'Mutual funds client authorization report failed');
  if (!Array.isArray(response.report_data) || response.report_data.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('Mutual funds returned an unreadable authorization report');
  return response.report_data as Record<string, unknown>[];
}
