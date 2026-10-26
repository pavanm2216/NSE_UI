import { nseRequest } from './nseApi';
import type { STPCancellationDetail, STPCancellationResponse } from '../types/nse';

export function buildStpCancellation(clientCode: string, sipId: string, remarks = '') {
  if (!clientCode.trim() || clientCode.trim().length > 10 || clientCode.trim().toLowerCase() === 'string') throw new Error('A valid client code of up to 10 characters is required');
  if (!/^\d{1,15}$/.test(sipId) || !/[1-9]/.test(sipId)) throw new Error('A valid STP registration ID is required');
  if (remarks.length > 100) throw new Error('Cancellation remarks must be at most 100 characters');
  return { can_data: [{ client_code: clientCode.trim(), stp_reg_no: sipId, remarks }] };
}
export async function cancelNSEStp(clientCode: string, sipId: string, remarks = '') {
  const body = buildStpCancellation(clientCode, sipId, remarks);
  const response = await nseRequest<STPCancellationResponse>('/stp-cancellation/cancel', body);
  const candidates = [response?.can_data, response?.reg_data].filter(Array.isArray) as STPCancellationDetail[][];
  const rows = candidates.flat().filter(row => row && String(row.stp_reg_no).trim() === sipId && row.client_code?.trim().toUpperCase() === clientCode.trim().toUpperCase());
  if (!rows.length) throw new Error('Mutual funds returned no matching cancellation result. Check status before retrying.');
  if (rows.some(row => row.can_status === 'CAN_FAILED')) throw new Error(rows.find(row => row.can_status === 'CAN_FAILED')?.can_remark?.trim() || 'Mutual funds rejected the STP cancellation');
  if (!rows.every(row => row.can_status === 'CAN_SUCCESS')) throw new Error('Mutual funds did not confirm cancellation. Check status before retrying.');
  return rows[0].can_remark?.trim() || 'Mutual funds confirmed the STP cancellation';
}
