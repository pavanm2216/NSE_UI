import { expect, it } from 'vitest';
import { buildNSEPayout as build } from './nsePayoutService';
const dates = { report_type: 'Order Date', from_date: '01-01-2025', to_date: '31-01-2025' };
it('preserves mandatory fields and applies order and reference priority', () => {
  expect(build({ ...dates, order_id: '123, 456', amc_code: 'TEST', member_unique_ids: 'REF' })).toEqual({ ...dates, order_id: '123,456' });
  expect(build({ ...dates, member_unique_ids: 'REF', amc_code: 'TEST' })).toEqual({ ...dates, member_unique_ids: 'REF' });
});
it('validates date basis, date ranges and numeric ID batches', () => {
  expect(() => build({ ...dates, report_type: 'string' })).toThrow();
  expect(() => build({ ...dates, order_id: 'string' })).toThrow();
  expect(() => build({ ...dates, to_date: '01-02-2025' })).toThrow();
  expect(() => build({ ...dates, order_id: Array(51).fill('123').join(',') })).toThrow();
});
