import type { SIPInstDueReportRequest } from '../types/nse';
import { buildSipReportRequest } from './nseSipReportService';

export function buildSipDueRequest(input: SIPInstDueReportRequest, today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })): SIPInstDueReportRequest {
  const body = buildSipReportRequest({ sip_reg_id: input.sip_reg_id, client_code: input.client_code, from_date: input.from_date, to_date: input.to_date });
  if (body.sip_reg_id || body.client_code) return body;
  const iso = (date: string) => date.split('-').reverse().join('-');
  const from = iso(body.from_date!), to = iso(body.to_date!);
  if (from < today) throw new Error('From date cannot be in the past');
  if (Date.parse(to) - Date.parse(from) > 7 * 86400000) throw new Error('Choose a date range with a maximum gap of 7 days');
  return body;
}
