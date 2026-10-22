import { expect, it, vi } from 'vitest';
vi.mock('./nseApi', () => ({ nseRequest: vi.fn() }));
import { nseRequest } from './nseApi';
import { buildSwpCancellation, cancelNSESwp } from './nseSwpCancellationService';
import { buildDailyXsipCancellation as daily, cancelNSEDailyXsip, dailyXsipEarliestDate } from './nseDailyXsipCancellationService';
import { buildStepupReport, getNSEStepups } from './nseStepupReportService';
it('sends only SWP request fields and never treats null registration data as success', async () => {
  expect(buildSwpCancellation('TEST', '123', '')).toEqual({ can_data: [{ client_code: 'TEST', swp_reg_no: '123', remarks: '' }] });
  expect(() => buildSwpCancellation('TEST', 'string')).toThrow();
  expect(() => buildSwpCancellation('TEST', '123', 'x'.repeat(101))).toThrow();
  vi.mocked(nseRequest).mockResolvedValueOnce({ reg_data: null });
  await expect(cancelNSESwp('TEST', '123')).rejects.toThrow('no matching');
  vi.mocked(nseRequest).mockResolvedValueOnce({ reg_data: [{ client_code: 'TEST', swp_reg_no: '123', can_status: 'CAN_SUCCESS' }] });
  await expect(cancelNSESwp('TEST', '123')).resolves.toContain('confirmed');
  vi.mocked(nseRequest).mockResolvedValueOnce({ can_data: [{ client_code: 'TEST', swp_reg_no: '123', can_status: 'CAN_FAILED', can_remark: 'Invalid registration' }] });
  await expect(cancelNSESwp('TEST', '123')).rejects.toThrow('Invalid registration');
});
it('requires daily frequency, a valid reason and a date beyond the weekday T+2 floor', () => {
  expect(dailyXsipEarliestDate('2026-10-16')).toBe('2026-10-20');
  expect(daily('TEST', '123', '13', 'Investor request', '2026-10-20', 'DAILY', '2026-10-16')).toEqual({ can_data: [{ client_code: 'TEST', xsip_reg_no: '123', remarks: '13:(Investor request)', xsip_cancel_date: '20/10/2026' }] });
  expect(() => daily('TEST', '123', '01', '', '2026-10-19', 'DAILY', '2026-10-16')).toThrow('two working');
  expect(() => daily('TEST', '123', '01', '', '2026-10-24', 'DAILY', '2026-10-16')).toThrow();
  expect(() => daily('TEST', '123', '01', '', '2026-10-20', 'MONTHLY', '2026-10-16')).toThrow('daily');
  expect(() => daily('TEST', '123', '13', '', '2026-10-20', 'DAILY', '2026-10-16')).toThrow('reason');
});
it('matches the effective date before accepting daily cancellation', async () => {
  vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-16T06:00:00Z'));
  try {
    const row = { client_code: 'TEST', xsip_reg_no: '123', xsip_cancel_date: '20/10/2026', can_status: 'CAN_SUCCESS' };
    vi.mocked(nseRequest).mockResolvedValueOnce({ can_data: [row] });
    await expect(cancelNSEDailyXsip('TEST', '123', '01', '', '2026-10-20', 'DAILY')).resolves.toContain('effective 20/10/2026');
    vi.mocked(nseRequest).mockResolvedValueOnce({ reg_data: [{ ...row, xsip_cancel_date: '21/10/2026' }] });
    await expect(cancelNSEDailyXsip('TEST', '123', '01', '', '2026-10-20', 'DAILY')).rejects.toThrow('no matching');
  } finally { vi.useRealTimers(); }
});
it('applies step-up ID/client precedence and the documented 31-day date limit', () => {
  expect(buildStepupReport({ sip_reg_id: '123, 456', client_code: 'TEST' })).toEqual({ sip_reg_id: '123,456' });
  expect(buildStepupReport({ client_code: 'TEST' })).toEqual({ client_code: 'TEST' });
  expect(() => buildStepupReport({ from_date: '01-01-2026', to_date: '02-02-2026' })).toThrow('31 days');
  expect(() => buildStepupReport({ sip_reg_id: Array(51).fill('123').join(',') })).toThrow('50');
});
it('preserves step-up effective dates and surfaces report failures', async () => {
  const rows = [{ sip_xsip_regn_number: '123', stepup_start__effective_date: '07 MAR 2025', stepup_amount: '500', status: 'ACTIVE' }];
  vi.mocked(nseRequest).mockResolvedValueOnce({ response_status: 'S', report_data: rows });
  expect(await getNSEStepups({ sip_reg_id: '123' })).toEqual(rows);
  vi.mocked(nseRequest).mockResolvedValueOnce({ response_status: 'F', error_remark: 'Invalid SIP ID' });
  await expect(getNSEStepups({ sip_reg_id: '123' })).rejects.toThrow('Invalid SIP ID');
});
