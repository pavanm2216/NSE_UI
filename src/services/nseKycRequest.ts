import type { ClientKYCReportRequest } from '@/types/nse';
import { parseNSEDueDate } from './nseSipPauseService';
export function buildNSEKycRequest(input: ClientKYCReportRequest): ClientKYCReportRequest {
  const list = (value: string, pan: boolean) => {
    const entries = value.split(',').map(item => item.trim().toUpperCase());
    if (entries.length > 50 || entries.some(item => !item || item === 'STRING' || (pan && !/^[A-Z]{5}\d{4}[A-Z]$/.test(item)))) throw new Error(`Enter up to 50 ${pan ? 'valid PAN numbers' : 'client codes'}`);
    return entries.join(',');
  };
  if (input.pan_no?.trim()) return { pan_no: list(input.pan_no, true) };
  if (input.client_code?.trim()) return { client_code: list(input.client_code, false) };
  const from = parseNSEDueDate(input.from_date || ''), to = parseNSEDueDate(input.to_date || '');
  if (to < from || Date.parse(to) - Date.parse(from) > 7 * 86400000) throw new Error('KYC creation dates must have a gap of at most 7 days');
  return { from_date: from.split('-').reverse().join('-'), to_date: to.split('-').reverse().join('-') };
}
