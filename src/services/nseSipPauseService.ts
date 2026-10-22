import { nseApi, nseRequest } from './nseApi';
export function parseNSEDueDate(value: string): string {
  const cleaned = value.trim();
  let iso = '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) iso = cleaned;
  else if (/^\d{2}[/-]\d{2}[/-]\d{4}$/.test(cleaned)) iso = cleaned.split(/[/-]/).reverse().join('-');
  else {
    const match = /^(\d{1,2}) ([A-Za-z]{3}) (\d{4})$/.exec(cleaned);
    const month = match ? ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].indexOf(match[2].toUpperCase()) + 1 : 0;
    if (match && month) iso = `${match[3]}-${String(month).padStart(2, '0')}-${match[1].padStart(2, '0')}`;
  }
  if (!iso || !Number.isFinite(Date.parse(iso)) || new Date(iso).toISOString().slice(0, 10) !== iso) throw new Error('Mutual funds did not return a usable next installment date');
  return iso;
}
export async function nextNSEInstallment(product: 'SIP' | 'XSIP', id: string, client: string) {
  const response = product === 'SIP' ? await nseApi.sipInstallmentsDue({ sip_reg_id: id }) : await nseApi.xsipInstallmentsDue({ xsip_reg_id: id });
  if (response.response_status !== 'S' || !Array.isArray(response.report_data)) throw new Error(response.error_remark || 'Unable to verify the next installment');
  const dates = response.report_data.flatMap(value => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
    const row = value as Record<string, unknown>;
    if (String(row.sip_reg_number).trim() !== id || String(row.client_code).trim() !== client) return [];
    return [parseNSEDueDate(String(row.due_date || ''))];
  }).sort();
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const next = dates.find(date => date >= today);
  if (!next) throw new Error('No upcoming installment date confirmed for this client and registration');
  return next;
}
export function buildSipPause(id: string, effective: string, next: string, flag: 'Y' | 'N', remarks: string, frequency: string, today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })) {
  if (!/^\d{1,15}$/.test(id) || !/[1-9]/.test(id)) throw new Error('A valid registration ID is required');
  if (!frequency || frequency.toUpperCase() === 'DAILY') throw new Error('Pause/resume is unavailable for daily or unconfirmed frequencies');
  if (!['Y', 'N'].includes(flag)) throw new Error('Select pause or resume');
  const date = parseNSEDueDate(effective), due = parseNSEDueDate(next);
  if (date <= today || date >= due) throw new Error('Effective date must be in the future and before the next installment');
  if (remarks.length > 255) throw new Error('Remarks must be at most 255 characters');
  return { pause_data: [{ sip_reg_no: id, effective_date: date.split('-').reverse().join('/'), pause_flag: flag, remarks: remarks.trim() }] };
}
export async function submitSipPause(product: 'SIP' | 'XSIP', id: string, client: string, effective: string, flag: 'Y' | 'N', remarks: string, frequency: string) {
  const next = await nextNSEInstallment(product, id, client);
  const body = buildSipPause(id, effective, next, flag, remarks, frequency);
  const response = await nseRequest<{ pause_data?: Array<{ sip_reg_no?: string; effective_date?: string; pause_flag?: string; pause_status?: string; pause_remark?: string }> }>('/registration/sip-xsip-pause', body);
  const rows = response?.pause_data;
  if (!Array.isArray(rows) || rows.length !== 1 || String(rows[0]?.sip_reg_no).trim() !== id || rows[0]?.pause_flag !== flag || rows[0]?.effective_date !== body.pause_data[0].effective_date) throw new Error('Mutual funds returned no matching pause/resume confirmation. Check status before retrying.');
  if (rows[0].pause_status !== 'SUCCESS') throw new Error(rows[0].pause_remark || 'Mutual funds did not confirm pause/resume');
  return rows[0].pause_remark?.trim() || (flag === 'Y' ? 'Mutual funds confirmed the pause request' : 'Mutual funds confirmed the resume request');
}
