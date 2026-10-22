import type { STPRegReportRequest } from '@/types/nse';
import { buildSipReportRequest } from './nseSipReportService';
export function buildStpReportRequest(input: STPRegReportRequest): STPRegReportRequest {
  const { sip_reg_id, ...filters } = buildSipReportRequest({ sip_reg_id: input.stp_reg_id, client_code: input.client_code, member_unique_ids: input.member_unique_ids, from_date: input.from_date, to_date: input.to_date });
  return sip_reg_id ? { stp_reg_id: sip_reg_id } : filters;
}
