import { expect, it, vi } from 'vitest';
vi.mock('./nseApi', () => ({ nseRequest: vi.fn() }));
import { nseRequest } from './nseApi';
import { buildNSEFundAllocation as build, getNSEFundAllocation } from './nseFundAllocationService';
const input = { from_date: '2025-01-01', to_date: '2026-01-01', client_code: 'TEST1, TEST2', pg_bank_refno: '000REF', order_id: '123, 456', pg_agencyid: '6' };
it('keeps mandatory dates and combines filters without a fabricated date limit', () => {
  expect(build(input)).toEqual({ ...input, from_date: '01-01-2025', to_date: '01-01-2026', client_code: 'TEST1,TEST2', order_id: '123,456' });
  expect(() => build({ ...input, from_date: '' })).toThrow('dates');
  expect(() => build({ ...input, to_date: '2024-01-01' })).toThrow('before');
});
it('validates provider codes and batch limits', () => {
  expect(() => build({ ...input, pg_agencyid: '1' })).toThrow('provider');
  expect(() => build({ ...input, order_id: 'string' })).toThrow();
  expect(() => build({ ...input, pg_bank_refno: Array(51).fill('REF').join(',') })).toThrow();
});
it('preserves allocation amounts and calls the documented wrapper path', async () => {
  const rows = [{ totalamount: '10000', totalallocatedamount: '0', remainingamount: '10000', allotment_flag: 'Y' }];
  vi.mocked(nseRequest).mockResolvedValueOnce({ response_status: 'S', report_data: rows });
  expect(await getNSEFundAllocation(input)).toEqual(rows);
  expect(nseRequest).toHaveBeenLastCalledWith('/reports/member-fund-allocation/order-wise', build(input), true, 'json', true);
});
it('handles the documented no-record failure and rejects other failures', async () => {
  vi.mocked(nseRequest).mockRejectedValueOnce(new Error('No record(s) found'));
  expect(await getNSEFundAllocation(input)).toEqual([]);
  vi.mocked(nseRequest).mockResolvedValueOnce({ response_status: 'F', report_data: [], error_remark: 'Invalid provider' });
  await expect(getNSEFundAllocation(input)).rejects.toThrow('Invalid provider');
  vi.mocked(nseRequest).mockResolvedValueOnce({ response_status: 'S', report_data: ['unreadable'] });
  await expect(getNSEFundAllocation(input)).rejects.toThrow('unreadable');
});
