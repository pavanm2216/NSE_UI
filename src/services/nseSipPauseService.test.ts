import { afterEach, expect, it, vi } from 'vitest';
import { nseApi, NSE_TOKEN_KEY } from './nseApi';
import { buildSipPause, nextNSEInstallment, submitSipPause } from './nseSipPauseService';
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); sessionStorage.clear(); });
it('requires a future effective date strictly before the due date and excludes DAILY', () => {
  expect(buildSipPause('123', '2099-10-16', '2099-10-20', 'Y', 'Requested', 'MONTHLY', '2099-10-15')).toEqual({ pause_data: [{ sip_reg_no: '123', effective_date: '16/10/2099', pause_flag: 'Y', remarks: 'Requested' }] });
  for (const effective of ['2099-10-15', '2099-10-20', '2099-10-21']) expect(() => buildSipPause('123', effective, '2099-10-20', 'Y', '', 'MONTHLY', '2099-10-15')).toThrow();
  expect(() => buildSipPause('123', '2099-10-16', '2099-10-20', 'N', '', 'DAILY', '2099-10-15')).toThrow('daily');
});
it('matches client and registration in the installment report', async () => {
  const report = vi.spyOn(nseApi, 'xsipInstallmentsDue').mockResolvedValue({ response_status: 'S', report_data: [{ client_code: 'OTHER', sip_reg_number: '123', due_date: '18 OCT 2099' }, { client_code: 'TEST', sip_reg_number: '123', due_date: '20 Oct 2099' }] });
  expect(await nextNSEInstallment('XSIP', '123', 'TEST')).toBe('2099-10-20');
  expect(report).toHaveBeenCalledWith({ xsip_reg_id: '123' });
});
it('requires SUCCESS and surfaces nested 404 errors without claiming success', async () => {
  vi.spyOn(nseApi, 'sipInstallmentsDue').mockResolvedValue({ response_status: 'S', report_data: [{ client_code: 'TEST', sip_reg_number: '123', due_date: '20 OCT 2099' }] });
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const fetcher = vi.fn().mockResolvedValue({ ok: false, status: 404, text: async () => JSON.stringify({ detail: JSON.stringify({ status: '404', message: 'Service unavailable.' }) }) });
  vi.stubGlobal('fetch', fetcher);
  await expect(submitSipPause('SIP', '123', 'TEST', '2099-10-16', 'Y', '', 'MONTHLY')).rejects.toThrow('Service unavailable.');
  fetcher.mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ pause_data: [{ sip_reg_no: '123', effective_date: '16/10/2099', pause_flag: 'Y', pause_status: 'SUCCESS', pause_remark: 'Pause confirmed' }] }) });
  await expect(submitSipPause('SIP', '123', 'TEST', '2099-10-16', 'Y', '', 'MONTHLY')).resolves.toBe('Pause confirmed');
});
