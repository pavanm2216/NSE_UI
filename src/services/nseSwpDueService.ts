import type { SWPInstDueReportRequest } from '@/types/nse';
import { buildSipDueRequest } from './nseSipDueService';
export function buildSwpDueRequest(input: SWPInstDueReportRequest, today?: string): SWPInstDueReportRequest {
  const { sip_reg_id, ...filters } = buildSipDueRequest({ sip_reg_id: input.swp_reg_id, client_code: input.client_code, from_date: input.from_date, to_date: input.to_date }, today);
  return sip_reg_id ? { swp_reg_id: sip_reg_id } : filters;
}
