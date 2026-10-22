import type { XSIPRegReportRequest } from '@/types/nse';
import { buildSipReportRequest } from './nseSipReportService';
export function buildXsipReportRequest(input: XSIPRegReportRequest): XSIPRegReportRequest {
  const result = buildSipReportRequest({ sip_reg_id: input.xsip_reg_id, client_code: input.client_code, member_unique_ids: input.member_unique_ids, from_date: input.from_date, to_date: input.to_date });
  const { sip_reg_id, ...filters } = result;
  return sip_reg_id ? { xsip_reg_id: sip_reg_id } : filters;
}
