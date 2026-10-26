import type { SIPCanReportRequest } from '../types/nse';
import { buildSipReportRequest } from './nseSipReportService';
export function buildSipCancellationReportRequest(input: SIPCanReportRequest): SIPCanReportRequest {
  return buildSipReportRequest({ sip_reg_id: input.sip_reg_id, client_code: input.client_code, from_date: input.from_date, to_date: input.to_date });
}
