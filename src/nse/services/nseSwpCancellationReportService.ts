import type { SWPCanReportRequest } from '../types/nse';
import { buildSipCancellationReportRequest } from './nseSipCancellationReportService';
export function buildSwpCancellationReportRequest(input: SWPCanReportRequest): SWPCanReportRequest {
  const { sip_reg_id, ...filters } = buildSipCancellationReportRequest({ sip_reg_id: input.swp_reg_id, client_code: input.client_code, from_date: input.from_date, to_date: input.to_date });
  return sip_reg_id ? { swp_reg_id: sip_reg_id } : filters;
}
