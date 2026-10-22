import { expect, it } from 'vitest';
import { buildXsipReportRequest as build } from './nseXsipReportService';
it('uses XSIP wire field and filter precedence', () => {
  expect(build({ xsip_reg_id: '123, 456', client_code: 'TEST', member_unique_ids: 'REF' })).toEqual({ xsip_reg_id: '123,456' });
  expect(build({ member_unique_ids: 'REF', client_code: 'TEST' })).toEqual({ member_unique_ids: 'REF' });
  expect(build({ client_code: 'TEST' })).toEqual({ client_code: 'TEST' });
});
it('enforces 50 numeric IDs and ordered real dates with 31 day gap', () => {
  expect(() => build({ xsip_reg_id: 'string' })).toThrow();
  expect(() => build({ xsip_reg_id: Array(51).fill('123').join(',') })).toThrow();
  expect(build({ from_date: '01-01-2025', to_date: '01-02-2025' })).toEqual({ from_date: '01-01-2025', to_date: '01-02-2025' });
  expect(() => build({ from_date: '01-01-2025', to_date: '02-02-2025' })).toThrow();
  expect(() => build({ from_date: '30-02-2025', to_date: '01-03-2025' })).toThrow();
});
