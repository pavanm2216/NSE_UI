import { expect, it, vi } from 'vitest';
vi.mock('./nseApi', () => ({ nseRequest: vi.fn() }));
import { nseRequest } from './nseApi';
import { buildNSEDelivery as build, getNSEDelivery } from './nseDeliveryService';
const input = { from_date: '01-10-2026', to_date: '08-10-2026', date_type: 'TRANSACTION DATE', client_code: '', settlement_type: 'ALL', dp_type: 'ALL', order_ids: '', member_unique_ids: '' };
it('uses wrapper keys and documented filters', () => {
  expect(build(input, '2026-10-16')).toEqual(inputWithoutEmpty());
  function inputWithoutEmpty() { return { from_date: input.from_date, to_date: input.to_date, date_type: input.date_type, settlement_type: 'ALL', dp_type: 'ALL' }; }
  expect(() => build({ ...input, settlement_type: 'L1' }, '2026-10-16')).toThrow('settlement');
});
it('applies identifier precedence and batch validation', () => {
  expect(build({ ...input, order_ids: '123, 456', client_code: 'TEST', member_unique_ids: 'REF' })).toEqual({ from_date: input.from_date, to_date: input.to_date, order_ids: '123,456' });
  expect(build({ ...input, member_unique_ids: 'REF', client_code: 'TEST' })).toEqual({ from_date: input.from_date, to_date: input.to_date, member_unique_ids: 'REF' });
  expect(build({ ...input, client_code: 'TEST' })).toEqual({ from_date: input.from_date, to_date: input.to_date, client_code: 'TEST' });
  expect(() => build({ ...input, order_ids: 'string' })).toThrow();
  expect(() => build({ ...input, order_ids: Array(51).fill('123').join(',') })).toThrow();
});
it('rejects future, equal and oversized date ranges', () => {
  expect(() => build(input, '2026-10-07')).toThrow('Future');
  expect(() => build({ ...input, to_date: input.from_date }, '2026-10-16')).toThrow('later');
  expect(() => build({ ...input, to_date: '09-10-2026' }, '2026-10-16')).toThrow('7 days');
});
it('keeps NA and zero distinct and surfaces business failures', async () => {
  vi.mocked(nseRequest).mockResolvedValueOnce({ response_status: 'S', report_data: [{ units_delivered: 'NA', cdsl_shortage: '0' }] });
  expect(await getNSEDelivery({ ...input, client_code: 'TEST' })).toEqual([{ units_delivered: 'NA', cdsl_shortage: '0' }]);
  vi.mocked(nseRequest).mockResolvedValueOnce({ response_status: 'F', report_data: [], error_remark: 'Invalid settlement_type' });
  await expect(getNSEDelivery({ ...input, client_code: 'TEST' })).rejects.toThrow('Invalid settlement_type');
});
