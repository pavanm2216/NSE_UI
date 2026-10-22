import { nseApi } from './nseApi';
export interface ApprovedSipMandate { id: string; umrn: string; bank: string; amount: string; }
export async function loadApprovedSipMandates(clientCode: string): Promise<ApprovedSipMandate[]> {
  if (!clientCode.trim()) throw new Error('The SIP must have a client code');
  const response = await nseApi.mandateStatus({ client_code: clientCode.trim() });
  if (response.response_status !== 'S' || !Array.isArray(response.report_data)) throw new Error(response.error_remark || 'Unable to read mandate status');
  return response.report_data.flatMap(value => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
    const row = value as Record<string, unknown>;
    const text = (key: string) => String(row[key] ?? '').trim();
    if (text('clientCode') !== clientCode.trim() || text('status').toUpperCase() !== 'APPROVED' || !/^[A-Za-z0-9]{1,20}$/.test(text('umrnNo'))) return [];
    return [{ id: text('mandateId'), umrn: text('umrnNo'), bank: text('bankName'), amount: text('amount') }];
  });
}
export async function linkSipMandate(sipId: string, clientCode: string, selected: ApprovedSipMandate, remark: string) {
  if (!/^\d{1,15}$/.test(sipId) || !/[1-9]/.test(sipId)) throw new Error('A valid SIP registration ID is required');
  if (remark.length > 100) throw new Error('Remark must be at most 100 characters');
  // Recheck ownership and approval immediately before a mutation.
  const mandates = await loadApprovedSipMandates(clientCode);
  if (!mandates.some(item => item.id === selected.id && item.umrn === selected.umrn)) throw new Error('The selected mandate is no longer confirmed approved for this client');
  const response = await nseApi.mapSipMandate({ sip_reg_id: sipId, umrn: selected.umrn, remark: remark.trim() });
  if (String(response.status) !== '100') throw new Error(response.message || 'Mutual funds did not confirm SIP mandate mapping');
  if (String(response.sip_reg_id) !== sipId || response.umrn?.trim() !== selected.umrn) throw new Error('Mutual funds returned a different mapping reference; mapping is not confirmed');
  return response.message?.trim() || 'Mutual funds confirmed the SIP mandate mapping';
}
