import { nseRequest } from './nseApi';
import { parseNSEDueDate } from './nseSipPauseService';
export interface NSEUtrInput { client: string; order: string; bank: string; account: string; ifsc: string; utr: string; date: string; }
export function buildNSEUtr(input: NSEUtrInput) {
  if (!input.client.trim() || input.client.length > 10 || input.client.toLowerCase() === 'string') throw new Error('Enter a valid client code of up to 10 characters');
  if (!/^\d{1,12}$/.test(input.order) || !/[1-9]/.test(input.order)) throw new Error('A confirmed purchase order ID is required');
  if (!input.bank.trim() || input.bank.length > 100 || input.bank.toLowerCase() === 'string') throw new Error('Enter the investor bank name of up to 100 characters');
  if (!/^\d{1,20}$/.test(input.account.trim())) throw new Error('Account number must contain up to 20 digits');
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(input.ifsc.trim().toUpperCase())) throw new Error('Enter a valid IFSC');
  if (!input.utr.trim() || input.utr.trim().length > 30 || input.utr.trim().toLowerCase() === 'string') throw new Error('Enter the bank UTR of up to 30 characters');
  const date = parseNSEDueDate(input.date);
  if (date > new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })) throw new Error('Fund credit date cannot be in the future');
  return { utr_details: [{ client_code: input.client.trim(), order_id: input.order, bank_name: input.bank.trim(), account_no: input.account.trim(), ifsc: input.ifsc.trim().toUpperCase(), utr_no: input.utr.trim(), transfer_date: date.split('-').reverse().join('/') }] };
}
export async function updateNSEUtr(input: NSEUtrInput) {
  const body = buildNSEUtr(input);
  const response = await nseRequest<{ utr_details?: Array<{ client_code?: string; order_id?: string; utr_no?: string; status?: string | number; message?: string }> }>('/utr/update', body);
  const rows = response?.utr_details;
  if (!Array.isArray(rows) || rows.length !== 1 || String(rows[0]?.order_id) !== input.order || rows[0]?.client_code?.trim().toUpperCase() !== input.client.trim().toUpperCase() || rows[0]?.utr_no?.trim() !== input.utr.trim()) throw new Error('Mutual funds returned no matching UTR confirmation. Check order lifecycle before retrying.');
  if (String(rows[0].status) !== '100') throw new Error(rows[0].message?.trim() || 'Mutual funds did not confirm the UTR update');
  return rows[0].message?.trim() || 'Mutual funds confirmed the UTR update';
}
