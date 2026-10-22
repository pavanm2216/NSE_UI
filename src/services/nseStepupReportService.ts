import { nseRequest } from './nseApi';
import { buildSipReportRequest } from './nseSipReportService';
export function buildStepupReport(input: { sip_reg_id?: string; client_code?: string; from_date?: string; to_date?: string }) {
  return buildSipReportRequest({ sip_reg_id: input.sip_reg_id, client_code: input.client_code, from_date: input.from_date, to_date: input.to_date });
}
export async function getNSEStepups(input: Parameters<typeof buildStepupReport>[0]) {
  const response = await nseRequest<{ response_status?: string; report_data?: unknown[]; error_remark?: string }>('/reports/stepup-registration', buildStepupReport(input), true, 'json', true);
  if (response.response_status !== 'S') throw new Error(response.error_remark || 'Mutual funds step-up report failed');
  if (!Array.isArray(response.report_data) || response.report_data.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('Mutual funds returned an unreadable step-up report');
  return response.report_data as Record<string, unknown>[];
}
