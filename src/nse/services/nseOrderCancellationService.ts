import { nseRequest } from './nseApi';
import type { OrderCancellationDetail, OrderCancellationResponse } from '@/types/nse';

export function buildOrderCancellation(clientCode: string, sipId: string, remarks = '') {
  if (!clientCode.trim() || clientCode.trim().length > 10 || clientCode.trim().toLowerCase() === 'string') throw new Error('A valid client code of up to 10 characters is required');
  if (!/^\d{1,12}$/.test(sipId) || !/[1-9]/.test(sipId)) throw new Error('A valid order registration ID is required');
  if (remarks.length > 500) throw new Error('Cancellation remarks must be at most 500 characters');
  return { can_data: [{ client_code: clientCode.trim(), order_no: sipId, remarks }] };
}
export async function cancelNSEOrder(clientCode: string, sipId: string, remarks = '') {
  const body = buildOrderCancellation(clientCode, sipId, remarks);
  const response = await nseRequest<OrderCancellationResponse>('/order-cancellation/cancel', body);
  const candidates = [response?.can_data, response?.reg_data].filter(Array.isArray) as OrderCancellationDetail[][];
  const rows = candidates.flat().filter(row => row && String(row.order_no).trim() === sipId && row.client_code?.trim().toUpperCase() === clientCode.trim().toUpperCase());
  if (!rows.length) throw new Error('Mutual funds returned no matching cancellation result. Check status before retrying.');
  if (rows.some(row => row.can_status === 'CAN FAILED')) throw new Error(rows.find(row => row.can_status === 'CAN FAILED')?.can_remark?.trim() || 'Mutual funds rejected the order cancellation');
  if (!rows.every(row => row.can_status === 'CAN SUCCESS')) throw new Error('Mutual funds did not confirm cancellation. Check status before retrying.');
  return rows[0].can_remark?.trim() || 'Mutual funds confirmed the order cancellation';
}
