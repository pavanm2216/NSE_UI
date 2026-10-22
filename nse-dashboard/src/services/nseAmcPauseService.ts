import { nseRequest, NSEApiError } from './nseApi';
import { parseNSEDueDate } from './nseSipPauseService';
export interface NSEAmcPauseInput { client_code: string; sip_reg_no: string; modification_type: string; no_of_installments: string; pause_from: string; }
const client = (value: string) => { if (!value.trim() || value.trim().length > 15 || value.includes(',') || value.trim().toLowerCase() === 'string') throw new Error('Enter a client code of up to 15 characters'); return value.trim(); };
const numeric = (value: string, size: number, name: string) => { if (!new RegExp(`^\\d{1,${size}}$`).test(value) || !/[1-9]/.test(value)) throw new Error(`Enter a valid ${name}`); return value; };
const action = (value: string, optional = false) => { if (!(optional ? ['', 'PAUSE', 'UNPAUSE'] : ['PAUSE', 'UNPAUSE']).includes(value)) throw new Error('Select pause or unpause'); return value; };
const date = (value: string) => { try { return parseNSEDueDate(value).split('-').reverse().join('/'); } catch { throw new Error('Enter a valid date'); } };
export function buildNSEAmcPause(input: NSEAmcPauseInput) {
  return { pause_data: [{ client_code: client(input.client_code), reg_type: 'SIP', sip_reg_no: numeric(input.sip_reg_no, 15, 'SIP registration number'), modification_type: action(input.modification_type), no_of_installments: numeric(input.no_of_installments, 5, 'installment count'), pause_from: input.pause_from.trim() ? date(input.pause_from) : '', filler_1: '', filler_2: '', filler_3: '', filler_4: '' }] };
}
export async function submitNSEAmcPause(input: NSEAmcPauseInput) {
  const body = buildNSEAmcPause(input);
  let response: { pause_data?: Record<string, unknown>[] };
  try { response = await nseRequest('/sip-amc-pause/pause', body); }
  catch (failure) { if (failure instanceof NSEApiError && failure.status === 404) throw new Error('Mutual funds AMC pause service is unavailable. No pause or unpause is confirmed.'); throw failure; }
  const rows = Array.isArray(response?.pause_data) ? response.pause_data.filter(row => row && String(row.registration_no ?? row.sip_reg_no).trim() === input.sip_reg_no) : [];
  if (!rows.length) throw new Error('Mutual funds returned no matching AMC pause result. Check the AMC pause report before retrying.');
  const failed = rows.find(row => String(row.status_flag) === '1');
  if (failed) throw new Error(String(failed.nse_remarks || 'Mutual funds rejected the AMC pause request'));
  if (!rows.every(row => String(row.status_flag) === '0' && /^\d{1,10}$/.test(String(row.request_id)) && /[1-9]/.test(String(row.request_id)))) throw new Error('Mutual funds did not confirm receipt of this AMC pause request. Check the report before retrying.');
  return { requestId: String(rows[0].request_id), message: String(rows[0].nse_remarks || 'Mutual funds received the AMC pause request') };
}
export interface NSEAmcPauseReportInput { from_date: string; to_date: string; client_code: string; registration_no: string; modification_type: string; request_id: string; }
export function buildNSEAmcPauseReport(input: NSEAmcPauseReportInput) {
  if (input.request_id.trim()) return { request_id: numeric(input.request_id.trim(), 11, 'request ID') };
  const base = { client_code: input.client_code.trim() ? client(input.client_code) : '', registration_no: input.registration_no.trim() ? numeric(input.registration_no.trim(), 15, 'registration number') : '', modification_type: action(input.modification_type, true) };
  if (base.client_code || base.registration_no) return base;
  const from = date(input.from_date), to = date(input.to_date);
  const difference = Date.parse(parseNSEDueDate(input.to_date)) - Date.parse(parseNSEDueDate(input.from_date));
  if (difference <= 0 || difference > 7 * 86400000) throw new Error('End date must be later than start date, with a maximum gap of 7 days');
  return { ...base, from_date: from, to_date: to };
}
export async function getNSEAmcPauseReport(input: NSEAmcPauseReportInput) {
  const response = await nseRequest<{ response_status?: string; report_data?: unknown[]; error_remark?: string }>('/sip-amc-pause/report', buildNSEAmcPauseReport(input), true, 'json', true);
  if (response.response_status !== 'S') throw new Error(response.error_remark || 'Mutual funds AMC pause report failed');
  if (!Array.isArray(response.report_data) || response.report_data.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('Mutual funds returned an unreadable AMC pause report');
  return response.report_data as Record<string, unknown>[];
}
