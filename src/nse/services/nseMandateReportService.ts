import type { MandateStatusReportRequest } from '../types/nse';

export function buildMandateReportRequest(input: MandateStatusReportRequest): MandateStatusReportRequest {
  const list = (value: string | null | undefined, name: string, numeric = false, maxLength?: number) => {
    if (!value?.trim()) return '';
    const values = value.split(',').map(item => item.trim());
    if (values.length > 50 || values.some(item => !item || item.toLowerCase() === 'string' || (numeric && !/^\d+$/.test(item)) || (maxLength && item.length > maxLength))) {
      throw new Error(`${name}: enter up to 50 comma-separated ${numeric ? 'numeric IDs' : 'values'}${maxLength ? `, each at most ${maxLength} characters` : ''}`);
    }
    return values.join(',');
  };
  const mandate = list(input.mandate_id, 'Mandate IDs', true);
  if (mandate) return { mandate_id: mandate };
  const member = list(input.memberMandateIds, 'Member mandate IDs');
  if (member) return { memberMandateIds: member };
  const client = list(input.client_code, 'Client codes', false, 20);
  if (client) return { client_code: client };
  const from = input.from_date?.trim() || '', to = input.to_date?.trim() || '';
  const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  if (!validDate(from) || !validDate(to)) throw new Error('Choose valid from and to dates, or enter mandate IDs, member mandate IDs or client codes');
  if (from > to) throw new Error('From date must be on or before to date');
  return { from_date: from, to_date: to };
}
