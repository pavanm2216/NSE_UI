import { expect, it } from 'vitest';
import { buildSipTopupReportRequest as build } from './nseSipTopupReportService';
it('prioritizes parent SIP IDs and client codes', () => {
  expect(build({ parent_sip_reg_id: '123, 456', client_code: 'TEST' })).toEqual({ parent_sip_reg_id: '123,456' });
  expect(build({ client_code: 'TEST' })).toEqual({ client_code: 'TEST' });
});
it('enforces numeric batches and 31 day historical date ranges', () => {
  expect(() => build({ parent_sip_reg_id: 'string' })).toThrow();
  expect(() => build({ parent_sip_reg_id: Array(51).fill('123').join(',') })).toThrow();
  expect(build({ from_date: '01-01-2025', to_date: '01-02-2025' })).toEqual({ from_date: '01-01-2025', to_date: '01-02-2025' });
  expect(() => build({ from_date: '01-01-2025', to_date: '02-02-2025' })).toThrow();
});
