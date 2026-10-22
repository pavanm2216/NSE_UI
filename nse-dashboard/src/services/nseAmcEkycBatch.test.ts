import { expect, it, vi } from 'vitest';
vi.mock('./nseApi', () => ({ nseRequest: vi.fn(), NSEApiError: class extends Error { constructor(message: string, public status: number) { super(message); } } }));
import { nseRequest, NSEApiError } from './nseApi';
import { buildNSEAmcPause, submitNSEAmcPause, buildNSEAmcPauseReport, getNSEAmcPauseReport } from './nseAmcPauseService';
import { buildNSEEkyc, registerNSEEkyc } from './nseEkycService';
const pause = { client_code: 'TEST', sip_reg_no: '123', modification_type: 'PAUSE', no_of_installments: '10', pause_from: '2026-11-16' };
const report = { from_date: '2026-10-01', to_date: '2026-10-08', client_code: '', registration_no: '', modification_type: '', request_id: '' };
const ekyc = { amcCode: 'TESTAMC', panNo: 'AAAAA1234A', mobileNo: '9000000000', invEmail: 'investor@example.test' };
it('uses the sample pause request keys and excludes response-only fields', () => {
  expect(buildNSEAmcPause(pause)).toEqual({ pause_data: [{ ...pause, pause_from: '16/11/2026', reg_type: 'SIP', filler_1: '', filler_2: '', filler_3: '', filler_4: '' }] });
  expect(() => buildNSEAmcPause({ ...pause, no_of_installments: '0' })).toThrow('count');
  expect(() => buildNSEAmcPause({ ...pause, modification_type: 'RESUME' })).toThrow();
  expect(() => buildNSEAmcPause({ ...pause, pause_from: '31/02/2026' })).toThrow('date');
});
it('requires matching registration, success flag and request ID for pause receipt', async () => {
  vi.mocked(nseRequest).mockResolvedValueOnce({ pause_data: [{ registration_no: '123', status_flag: '0', request_id: '567', nse_remarks: 'Request posted' }] });
  expect(await submitNSEAmcPause(pause)).toEqual({ requestId: '567', message: 'Request posted' });
  vi.mocked(nseRequest).mockResolvedValueOnce({ pause_data: [{ registration_no: '999', status_flag: '0', request_id: '567' }] });
  await expect(submitNSEAmcPause(pause)).rejects.toThrow('no matching');
  vi.mocked(nseRequest).mockRejectedValueOnce(new NSEApiError('Service unavailable', 404));
  await expect(submitNSEAmcPause(pause)).rejects.toThrow('unavailable');
});
it('formats report dates with slashes and applies request ID priority', () => {
  expect(buildNSEAmcPauseReport(report)).toMatchObject({ from_date: '01/10/2026', to_date: '08/10/2026' });
  expect(buildNSEAmcPauseReport({ ...report, request_id: '567', registration_no: 'string' })).toEqual({ request_id: '567' });
  expect(buildNSEAmcPauseReport({ ...report, client_code: 'TEST', registration_no: '123' })).toEqual({ client_code: 'TEST', registration_no: '123', modification_type: '' });
  expect(() => buildNSEAmcPauseReport({ ...report, to_date: '2026-10-09' })).toThrow('7 days');
});
it('preserves pause report activation and installment details and rejects failed reports', async () => {
  const rows = [{ request_id: '567', date_of_activation: '16/01/2026', modified_instalments: '8' }];
  vi.mocked(nseRequest).mockResolvedValueOnce({ response_status: 'S', report_data: rows });
  expect(await getNSEAmcPauseReport(report)).toEqual(rows);
  vi.mocked(nseRequest).mockResolvedValueOnce({ response_status: 'F', error_remark: 'Invalid request_id' });
  await expect(getNSEAmcPauseReport(report)).rejects.toThrow('Invalid request_id');
});
it('validates all fresh eKYC fields and preserves exact camelCase keys', () => {
  expect(buildNSEEkyc(ekyc)).toEqual(ekyc);
  expect(() => buildNSEEkyc({ ...ekyc, panNo: 'string' })).toThrow('PAN');
  expect(() => buildNSEEkyc({ ...ekyc, mobileNo: '123' })).toThrow('mobile');
  expect(() => buildNSEEkyc({ ...ekyc, invEmail: 'invalid' })).toThrow('email');
});
it('accepts only a usable secure eKYC link and surfaces rejection', async () => {
  vi.mocked(nseRequest).mockResolvedValueOnce({ link: 'https://example.test/ekyc/123', message: 'Request received' });
  expect(await registerNSEEkyc(ekyc)).toEqual({ link: 'https://example.test/ekyc/123', message: 'Request received' });
  vi.mocked(nseRequest).mockResolvedValueOnce({ link: 'javascript:alert(1)' });
  await expect(registerNSEEkyc(ekyc)).rejects.toThrow('unusable');
  vi.mocked(nseRequest).mockResolvedValueOnce({ success: false, message: 'Invalid RTA AMC code' });
  await expect(registerNSEEkyc(ekyc)).rejects.toThrow('Invalid RTA');
});
