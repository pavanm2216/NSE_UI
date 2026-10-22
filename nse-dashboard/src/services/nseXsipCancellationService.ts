import { nseRequest } from './nseApi';
import type { XSIPCancellationDetail, XSIPCancellationResponse } from '@/types/nse';

export const XSIP_CANCELLATION_REASONS = [
  ['01', 'Non availability of funds'], ['02', 'Scheme not performing'], ['03', 'Service issue'], ['04', 'Load revised'],
  ['05', 'Wish to invest in other schemes'], ['06', 'Change in fund manager'], ['07', 'Goal achieved'],
  ['08', 'Not comfortable with market volatility'], ['09', 'Will restart XSIP after a few months'],
  ['10', 'Modifications in bank, mandate or date'], ['11', 'Decided to invest elsewhere'], ['12', 'Not the right time to invest'], ['13', 'Other reason'],
] as const;
export function buildXsipCancellation(clientCode: string, sipId: string, reason: string, other = '') {
  if (!clientCode.trim() || clientCode.trim().length > 10 || clientCode.trim().toLowerCase() === 'string') throw new Error('A valid client code of up to 10 characters is required');
  if (!/^\d{1,15}$/.test(sipId) || !/[1-9]/.test(sipId)) throw new Error('A valid XSIP registration ID is required');
  if (!XSIP_CANCELLATION_REASONS.some(([code]) => code === reason)) throw new Error('Select a cancellation reason');
  if (reason === '13' && !other.trim()) throw new Error('Specify the other cancellation reason');
  const remarks = reason === '13' ? `13:(${other.trim()})` : reason;
  if (remarks.length > 100) throw new Error('Cancellation remarks must be at most 100 characters');
  return { can_data: [{ client_code: clientCode.trim(), xsip_reg_no: sipId, remarks }] };
}
export async function cancelNSEXsip(clientCode: string, sipId: string, reason: string, other = '') {
  const body = buildXsipCancellation(clientCode, sipId, reason, other);
  const response = await nseRequest<XSIPCancellationResponse>('/xsip-cancellation/cancel', body);
  const candidates = [response?.can_data, response?.reg_data].filter(Array.isArray) as XSIPCancellationDetail[][];
  const rows = candidates.flat().filter(row => row && String(row.xsip_reg_no).trim() === sipId && row.client_code?.trim().toUpperCase() === clientCode.trim().toUpperCase());
  if (!rows.length) throw new Error('Mutual funds returned no matching cancellation result. Check status before retrying.');
  if (rows.some(row => row.can_status === 'CAN_FAILED')) throw new Error(rows.find(row => row.can_status === 'CAN_FAILED')?.can_remark?.trim() || 'Mutual funds rejected the XSIP cancellation');
  if (!rows.every(row => row.can_status === 'CAN_SUCCESS')) throw new Error('Mutual funds did not confirm cancellation. Check status before retrying.');
  return rows[0].can_remark?.trim() || 'Mutual funds confirmed the XSIP cancellation';
}
