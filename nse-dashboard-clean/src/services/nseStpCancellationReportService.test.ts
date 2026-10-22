import { expect, it } from 'vitest';
import { buildStpCancellationReportRequest as build } from './nseStpCancellationReportService';
it('uses XSIP IDs with priority over client and date filters', () => {
  expect(build({ stp_reg_id: '123, 456', client_code: 'TEST', from_date: 'string' })).toEqual({ stp_reg_id: '123,456' });
  expect(build({ client_code: 'TEST, OTHER' })).toEqual({ client_code: 'TEST,OTHER' });
});
it('validates numeric batches and historical date ranges with a 31 day gap', () => {
  expect(() => build({ stp_reg_id: 'string' })).toThrow();
  expect(() => build({ stp_reg_id: Array(51).fill('123').join(',') })).toThrow();
  expect(build({ from_date: '01-01-2025', to_date: '01-02-2025' })).toEqual({ from_date: '01-01-2025', to_date: '01-02-2025' });
  expect(() => build({ from_date: '01-01-2025', to_date: '02-02-2025' })).toThrow();
  expect(() => build({ from_date: '01-01-2025', to_date: '01-01-2025' })).toThrow();
});
