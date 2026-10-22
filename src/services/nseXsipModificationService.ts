import { nseRequest } from './nseApi';
export const XSIP_EDIT_FIELDS = [
  ['amount', 'Installment amount (₹)', 13], ['primary_holder_email', 'Primary holder email', 50],
  ['primary_holder_mobile', 'Primary holder mobile', 10], ['folio_no', 'Folio number', 15],
  ['euin_number', 'EUIN', 7], ['sub_broker_code', 'Sub-broker code', 15], ['sub_broker_arn', 'Sub-broker ARN', 20],
] as const;
export type XsipEditField = typeof XSIP_EDIT_FIELDS[number][0];
export type XsipEdits = Partial<Record<XsipEditField, string>>;
export function buildXsipModification(id: string, edits: XsipEdits, remarks: string, send2fa: boolean, sendComm: boolean) {
  if (!/^\d{1,15}$/.test(id) || !/[1-9]/.test(id)) throw new Error('A valid XSIP registration ID is required');
  const changes: Record<string, string> = {};
  for (const [key, label, max] of XSIP_EDIT_FIELDS) {
    const value = edits[key]?.trim();
    if (!value) continue;
    if (value.length > max || value.toLowerCase() === 'string') throw new Error(`${label} is invalid or too long`);
    if (key === 'amount' && (!/^\d{1,10}(\.\d{1,2})?$/.test(value) || Number(value) <= 0)) throw new Error('Enter a positive amount with at most 10 integer digits and two decimal places');
    if (key === 'primary_holder_email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error('Enter a valid email address');
    if (key === 'primary_holder_mobile' && !/^[6-9]\d{9}$/.test(value)) throw new Error('Enter a valid 10-digit mobile number');
    if (key === 'euin_number' && !/^E\d{6}$/.test(value.toUpperCase())) throw new Error('EUIN must be E followed by six digits');
    if (key === 'sub_broker_arn' && !/^ARN/i.test(value)) throw new Error('Sub-broker ARN must start with ARN');
    changes[key] = key === 'euin_number' ? value.toUpperCase() : value;
  }
  if (!Object.keys(changes).length) throw new Error('Enter at least one change');
  if (remarks.length > 100) throw new Error('Remarks must be at most 100 characters');
  return { mod_data: [{ sys_reg_no: id, ...changes, remarks: remarks.trim(), send_2fa: send2fa ? 'Y' : 'N', send_comm: sendComm ? 'Y' : 'N', filler_1: '', filler_2: '' }] };
}
export async function modifyNSEXsip(id: string, edits: XsipEdits, remarks: string, send2fa: boolean, sendComm: boolean) {
  const body = buildXsipModification(id, edits, remarks, send2fa, sendComm);
  const response = await nseRequest<{ mod_data?: Array<{ sys_reg_no?: string; status?: string; status_remarks?: string }> }>('/modification/xsip', body);
  const rows = response?.mod_data;
  if (!Array.isArray(rows) || rows.length !== 1 || String(rows[0]?.sys_reg_no).trim() !== id) throw new Error('Mutual funds returned no matching modification result. Check the XSIP report before retrying.');
  if (rows[0].status !== 'MODIFICATION_SUCCESS') throw new Error(rows[0].status_remarks?.trim() || 'Mutual funds did not confirm the XSIP modification');
  return rows[0].status_remarks?.trim() || 'Mutual funds confirmed the XSIP modification';
}
