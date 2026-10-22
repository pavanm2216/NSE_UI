import { nseRequest } from './nseApi';
import { parseNSEDueDate } from './nseSipPauseService';
export interface NSEFundAgeInput { date: string; client_code: string; settlement_type: string; amc_code: string; scheme_code: string; }
export function buildNSEFundAge(input: NSEFundAgeInput) {
  let date: string;
  try { date = parseNSEDueDate(input.date).split('-').reverse().join('-'); }
  catch { throw new Error('Enter a valid report date'); }
  const clients = input.client_code.trim() ? input.client_code.split(',').map(value => value.trim()) : [];
  if (clients.length > 50 || clients.some(value => !value || value.toLowerCase() === 'string')) throw new Error('Enter up to 50 comma-separated client codes');
  for (const key of ['settlement_type', 'amc_code', 'scheme_code'] as const) {
    if (input[key].trim().toLowerCase() === 'string' || input[key].includes(',')) throw new Error('Enter a single code from the relevant Mutual funds master');
  }
  return { date, client_code: clients.join(','), settlement_type: input.settlement_type.trim() || 'all', amc_code: input.amc_code.trim(), scheme_code: input.scheme_code.trim() };
}
export async function getNSEFundAge(input: NSEFundAgeInput) {
  const response = await nseRequest<{ response_status?: string; report_data?: unknown[]; error_remark?: string }>('/reports/member-fund-allocation/age-wise', buildNSEFundAge(input), true, 'json', true);
  if (response.response_status !== 'S') throw new Error(response.error_remark || 'Mutual funds age-wise funds report failed');
  if (!Array.isArray(response.report_data) || response.report_data.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('Mutual funds returned an unreadable age-wise funds report');
  return response.report_data as Record<string, unknown>[];
}
