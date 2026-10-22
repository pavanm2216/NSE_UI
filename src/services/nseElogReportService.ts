import { nseRequest } from './nseApi';
import { parseNSEDueDate } from './nseSipPauseService';
export interface NSEElogFilters { client_code: string; from_date: string; to_date: string; }
export function buildNSEElogReport(input: NSEElogFilters) {
  if (input.client_code.trim()) {
    const values = input.client_code.split(',').map(value => value.trim().toUpperCase());
    if (values.length > 50 || values.some(value => !/^[A-Z0-9]+$/.test(value) || value === 'STRING')) throw new Error('Enter up to 50 client codes');
    return { client_code: values.join(',') };
  }
  const from = parseNSEDueDate(input.from_date), to = parseNSEDueDate(input.to_date);
  if (to < from || Date.parse(to) - Date.parse(from) > 31 * 86400000) throw new Error('Choose ordered dates with a maximum gap of 31 days');
  return { from_date: from.split('-').reverse().join('-'), to_date: to.split('-').reverse().join('-') };
}
export async function getNSEElogReport(input: NSEElogFilters) {
  const response = await nseRequest<{ response_status?: string; report_data?: unknown[]; error_remark?: string }>('/reports/elog-upload', buildNSEElogReport(input), true, 'json', true);
  if (response?.response_status !== 'S') throw new Error(response?.error_remark || 'Mutual funds eLOG report failed');
  if (!Array.isArray(response.report_data) || response.report_data.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('Mutual funds returned an unreadable eLOG report');
  return response.report_data as Record<string, unknown>[];
}
