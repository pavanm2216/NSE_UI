import { nseRequest } from './nseApi';
import { buildXsipCancellation } from './nseXsipCancellationService';
import { parseNSEDueDate } from './nseSipPauseService';
export function dailyXsipEarliestDate(today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })) {
  const day = new Date(`${today}T00:00:00Z`);
  let days = 0;
  while (days < 2) { day.setUTCDate(day.getUTCDate() + 1); if (![0, 6].includes(day.getUTCDay())) days++; }
  return day.toISOString().slice(0, 10);
}
export function buildDailyXsipCancellation(client: string, id: string, reason: string, other: string, date: string, frequency: string, today?: string) {
  if (frequency.toUpperCase() !== 'DAILY') throw new Error('This service is only for daily XSIPs');
  const base = buildXsipCancellation(client, id, reason, other);
  let iso: string;
  try { iso = parseNSEDueDate(date); } catch { throw new Error('Enter a valid cancellation date'); }
  if (iso < dailyXsipEarliestDate(today) || [0, 6].includes(new Date(`${iso}T00:00:00Z`).getUTCDay())) throw new Error('Choose a weekday at least two working days ahead. Mutual funds also validates exchange holidays.');
  return { can_data: [{ ...base.can_data[0], xsip_cancel_date: iso.split('-').reverse().join('/') }] };
}
export async function cancelNSEDailyXsip(client: string, id: string, reason: string, other: string, date: string, frequency: string) {
  const body = buildDailyXsipCancellation(client, id, reason, other, date, frequency);
  const response = await nseRequest<{ can_data?: Record<string, unknown>[]; reg_data?: Record<string, unknown>[] }>('/daily-xsip-cancellation/cancel', body);
  const rows = [response?.can_data, response?.reg_data].filter(Array.isArray).flat().filter(row => row && String(row.xsip_reg_no).trim() === id && String(row.client_code).trim().toUpperCase() === client.trim().toUpperCase() && String(row.xsip_cancel_date).trim() === body.can_data[0].xsip_cancel_date);
  if (!rows.length) throw new Error('Mutual funds returned no matching scheduled cancellation result. Check status before retrying.');
  const failure = rows.find(row => row.can_status === 'CAN_FAILED');
  if (failure) throw new Error(String(failure.can_remark || 'Mutual funds rejected the daily XSIP cancellation'));
  if (!rows.every(row => row.can_status === 'CAN_SUCCESS')) throw new Error('Mutual funds did not confirm the scheduled cancellation. Check status before retrying.');
  return `Mutual funds accepted cancellation effective ${body.can_data[0].xsip_cancel_date}. Check the latest reports to confirm the plan stops.`;
}
