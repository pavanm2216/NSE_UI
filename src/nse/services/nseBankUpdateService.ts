import { nseRequest } from './nseApi';
export interface NSEBankUpdate { client: string; action: 'ADD' | 'DEL'; type: string; account: string; ifsc: string; micr: string; isDefault: boolean; }
export function buildNSEBankUpdate(input: NSEBankUpdate) {
  if (!input.client.trim() || input.client.trim().length > 20 || input.client.trim().toLowerCase() === 'string') throw new Error('Enter a client code of up to 20 characters');
  if (!['ADD', 'DEL'].includes(input.action) || !['SB', 'CB', 'NE', 'NO'].includes(input.type)) throw new Error('Select a documented action and account type');
  if (!/^\d{1,40}$/.test(input.account.trim())) throw new Error('Account number must contain up to 40 digits');
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(input.ifsc.trim().toUpperCase())) throw new Error('Enter a valid IFSC');
  if (input.micr.trim() && !/^\d{9}$/.test(input.micr.trim())) throw new Error('MICR must contain nine digits');
  if (input.action === 'DEL' && input.isDefault) throw new Error('A deletion cannot mark the bank as a new default');
  return { bank_dtl: [{ client_code: input.client.trim(), action_type: input.action, account_type: input.type, account_no: input.account.trim(), micr_no: input.micr.trim(), ifsc_code: input.ifsc.trim().toUpperCase(), default_bank_flag: input.isDefault ? 'Y' : 'N' }] };
}
export async function updateNSEBank(input: NSEBankUpdate) {
  const body = buildNSEBankUpdate(input);
  const response = await nseRequest<{ bank_dtl?: Array<{ client_code?: string; action_type?: string; account_no?: string; ifsc_code?: string; status?: string; error_remark?: string }> }>('/client-bank-detail/update', body);
  const rows = response?.bank_dtl;
  if (!Array.isArray(rows) || rows.length !== 1 || rows[0]?.client_code?.trim().toUpperCase() !== input.client.trim().toUpperCase() || rows[0]?.action_type !== input.action || rows[0]?.account_no?.trim() !== input.account.trim() || rows[0]?.ifsc_code?.trim().toUpperCase() !== input.ifsc.trim().toUpperCase()) throw new Error('Mutual funds returned no matching bank update result. Check Investor profiles before retrying.');
  if (rows[0].status !== 'SUCCESS') throw new Error(rows[0].error_remark?.trim() || 'Mutual funds did not confirm the bank update');
  return input.action === 'ADD' ? 'Mutual funds confirmed the bank addition. Bank approval is separate.' : 'Mutual funds confirmed the bank deletion.';
}
