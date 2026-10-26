import { expect, it } from 'vitest';
import { buildSipCancellationReportRequest as build } from './nseSipCancellationReportService';
it('applies ID and client priority and accepts a historical 31 day gap', () => {
  expect(build({ sip_reg_id: '123, 456', client_code: 'TEST' })).toEqual({ sip_reg_id: '123,456' });
  expect(build({ client_code: 'TEST' })).toEqual({ client_code: 'TEST' });
  expect(build({ from_date: '01-01-2025', to_date: '01-02-2025' })).toEqual({ from_date: '01-01-2025', to_date: '01-02-2025' });
});
it('rejects invalid IDs and dates', () => {
  expect(() => build({ sip_reg_id: 'string' })).toThrow();
  expect(() => build({ sip_reg_id: Array(51).fill('123').join(',') })).toThrow();
  expect(() => build({ from_date: '01-01-2025', to_date: '02-02-2025' })).toThrow();
  expect(() => build({ from_date: '01-01-2025', to_date: '01-01-2025' })).toThrow();
});
