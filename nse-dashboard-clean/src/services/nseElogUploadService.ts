import { nseRequest } from './nseApi';
export interface NSEHolderLog { pan: string; ip: string; date: string; }
export interface NSEElogUploadInput { client: string; holders: NSEHolderLog[]; }
export function buildNSEElogUpload(input: NSEElogUploadInput) {
  if (!input.client.trim() || input.client.trim().length > 20 || input.client.trim().toLowerCase() === 'string') throw new Error('Enter a client code of up to 20 characters');
  if (input.holders.length < 1 || input.holders.length > 3) throw new Error('Include one to three holders as registered in the UCC');
  const body: Record<string, string> = { client_code: input.client.trim() };
  const prefixes = ['primary_holder', 'second_holder', 'third_holder'];
  input.holders.forEach((holder, index) => {
    const pan = holder.pan.trim().toUpperCase(), ip = holder.ip.trim(), date = holder.date.trim().toUpperCase();
    if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(pan)) throw new Error(`Holder ${index + 1}: enter a valid PAN`);
    if (ip.length > 100 || !/^\d{1,3}(\.\d{1,3}){3}$/.test(ip) || ip.split('.').some(part => Number(part) > 255)) throw new Error(`Holder ${index + 1}: enter a valid IPv4 address from the consent log`);
    const match = /^(\d{2})-([A-Z]{3})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(date);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    if (!match || !months.includes(match[2]) || Number(match[4]) > 23 || Number(match[5]) > 59 || Number(match[6]) > 59) throw new Error(`Holder ${index + 1}: use DD-MON-YY HH:MM:SS`);
    const iso = `20${match[3]}-${String(months.indexOf(match[2]) + 1).padStart(2, '0')}-${match[1]}`;
    if (!Number.isFinite(Date.parse(iso)) || new Date(iso).toISOString().slice(0, 10) !== iso) throw new Error(`Holder ${index + 1}: enter a valid calendar date`);
    body[`${prefixes[index]}_pan`] = pan; body[`${prefixes[index]}_ip_address`] = ip; body[`${prefixes[index]}_log_date`] = date;
  });
  return body;
}
export async function uploadNSEElog(input: NSEElogUploadInput) {
  const body = buildNSEElogUpload(input);
  const response = await nseRequest<Record<string, unknown>>('/elog/upload', body);
  if (String(response?.elog_status) !== '100') throw new Error(typeof response?.elog_status_message === 'string' ? response.elog_status_message : 'Mutual funds did not confirm eLOG upload');
  if (String(response.client_code).trim().toUpperCase() !== input.client.trim().toUpperCase() || input.holders.some((holder, index) => String(response[`${['primary_holder', 'second_holder', 'third_holder'][index]}_pan`]).trim().toUpperCase() !== holder.pan.trim().toUpperCase())) throw new Error('Mutual funds returned a different client or holder; eLOG upload is not confirmed');
  return typeof response.elog_status_message === 'string' ? response.elog_status_message : 'Mutual funds confirmed eLOG upload';
}
