import { expect, it } from 'vitest';
import { buildStpReportRequest as build } from './nseStpReportService';
it('prioritizes STP IDs, member references and clients', () => {
  expect(build({ stp_reg_id: '123, 456', client_code: 'TEST', member_unique_ids: 'REF' })).toEqual({ stp_reg_id: '123,456' });
  expect(build({ member_unique_ids: 'REF', client_code: 'TEST' })).toEqual({ member_unique_ids: 'REF' });
});
it('enforces numeric batches and 31 day date gap', () => {
  expect(() => build({ stp_reg_id: 'string' })).toThrow();
  expect(() => build({ stp_reg_id: Array(51).fill('123').join(',') })).toThrow();
  expect(build({ from_date: '01-01-2025', to_date: '01-02-2025' })).toEqual({ from_date: '01-01-2025', to_date: '01-02-2025' });
  expect(() => build({ from_date: '01-01-2025', to_date: '02-02-2025' })).toThrow();
});
