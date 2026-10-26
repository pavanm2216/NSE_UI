import { nseRequest } from './nseApi';
import { buildNSERedemptionRequest } from './nseRedemptionService';
export const NSE_PAYOUT_DATE_TYPES = ['Order Date', 'Payout Date', 'Fund Transfer Date'] as const;
export interface NSEPayoutInput { report_type: string; from_date: string; to_date: string; amc_code?: string; order_id?: string; member_unique_ids?: string; }
export function buildNSEPayout(input: NSEPayoutInput) {
  if (!(NSE_PAYOUT_DATE_TYPES as readonly string[]).includes(input.report_type)) throw new Error('Select a valid report date basis');
  const base = buildNSERedemptionRequest({ from_date: input.from_date, to_date: input.to_date, order_ids: input.order_id, member_unique_ids: input.member_unique_ids });
  const required = { report_type: input.report_type, from_date: base.from_date, to_date: base.to_date };
  if (base.order_ids) return { ...required, order_id: base.order_ids };
  if (base.member_unique_ids) return { ...required, member_unique_ids: base.member_unique_ids };
  if (input.amc_code?.trim().toLowerCase() === 'string') throw new Error('Enter an actual AMC code or leave it blank');
  return { ...required, amc_code: input.amc_code?.trim() || '' };
}
export async function getNSEPayouts(input: NSEPayoutInput, nonDemat = false) {
  const response = await nseRequest<{ response_status?: string; report_data?: unknown[]; error_remark?: string }>(nonDemat ? '/reports/redemption-payout-non-demat' : '/reports/redemption-payout', buildNSEPayout(input), true, 'json', true);
  if (response?.response_status !== 'S') throw new Error(response?.error_remark || 'Mutual funds payout report failed');
  if (!Array.isArray(response.report_data) || response.report_data.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('Mutual funds returned an unreadable payout report');
  return response.report_data as Record<string, unknown>[];
}
