import type { SIPRegReportRequest } from '../types/nse';

export function buildSipReportRequest(input: SIPRegReportRequest): SIPRegReportRequest {
  const list = (value: string | null | undefined, numeric = false) => {
    if (!value?.trim()) return '';
    const entries = value.split(',').map(item => item.trim());
    if (entries.length > 50 || entries.some(item => !item || item.toLowerCase() === 'string' || (numeric && !/^\d+$/.test(item)))) throw new Error(`Enter up to 50 comma-separated ${numeric ? 'numeric SIP IDs' : 'values'}`);
    return entries.join(',');
  };
  const sip = list(input.sip_reg_id, true);
  if (sip) return { sip_reg_id: sip };
  const member = list(input.member_unique_ids);
  if (member) return { member_unique_ids: member };
  const client = list(input.client_code);
  if (client) return { client_code: client };
  const parse = (value: string | null | undefined) => {
    if (!value || !/^\d{2}-\d{2}-\d{4}$/.test(value)) throw new Error('Choose valid dates in DD-MM-YYYY format');
    const [day, month, year] = value.split('-'); const iso = `${year}-${month}-${day}`;
    const time = Date.parse(iso);
    if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== iso) throw new Error('Choose valid dates');
    return time;
  };
  const from = parse(input.from_date), to = parse(input.to_date);
  if (to <= from || to - from > 31 * 86400000) throw new Error('To date must be later than from date, with a maximum gap of 31 days');
  return { from_date: input.from_date, to_date: input.to_date };
}
