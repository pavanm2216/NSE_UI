import { expect, it, vi } from 'vitest';
vi.mock('./nseApi', () => ({ nseRequest: vi.fn() }));
import { nseRequest } from './nseApi';
import { buildNSEFundAge as build, getNSEFundAge } from './nseFundAgeService';
const input = { date: '2026-10-16', client_code: '', settlement_type: '', amc_code: '', scheme_code: '' };
it('formats the required date and uses the documented lowercase all default', () => {
  expect(build(input)).toEqual({ ...input, date: '16-10-2026', settlement_type: 'all' });
  expect(() => build({ ...input, date: 'string' })).toThrow('date');
  expect(() => build({ ...input, date: '31-02-2026' })).toThrow('date');
});
it('combines master filters and validates client batch limits', () => {
  expect(build({ ...input, client_code: 'TEST1, TEST2', settlement_type: 'T1', amc_code: 'TESTAMC', scheme_code: 'TESTSCH' })).toEqual({ date: '16-10-2026', client_code: 'TEST1,TEST2', settlement_type: 'T1', amc_code: 'TESTAMC', scheme_code: 'TESTSCH' });
  expect(() => build({ ...input, client_code: Array(51).fill('TEST').join(',') })).toThrow('50');
  expect(() => build({ ...input, client_code: 'TEST,' })).toThrow();
  expect(() => build({ ...input, settlement_type: 'string' })).toThrow('master');
});
it('preserves status codes and distinguishes empty, failed and malformed responses', async () => {
  const rows = [{ orderstatus: 'payment_not_initiated', funds_received_status: 'C' }];
  vi.mocked(nseRequest).mockResolvedValueOnce({ response_status: 'S', report_data: rows });
  expect(await getNSEFundAge(input)).toEqual(rows);
  expect(nseRequest).toHaveBeenLastCalledWith('/reports/member-fund-allocation/age-wise', build(input), true, 'json', true);
  vi.mocked(nseRequest).mockResolvedValueOnce({ response_status: 'S', report_data: [], error_remark: 'No record(s) found.' });
  expect(await getNSEFundAge(input)).toEqual([]);
  vi.mocked(nseRequest).mockResolvedValueOnce({ response_status: 'F', report_data: [], error_remark: 'date value is not valid.' });
  await expect(getNSEFundAge(input)).rejects.toThrow('date value');
  vi.mocked(nseRequest).mockResolvedValueOnce({ response_status: 'S', report_data: ['string'] });
  await expect(getNSEFundAge(input)).rejects.toThrow('unreadable');
});
