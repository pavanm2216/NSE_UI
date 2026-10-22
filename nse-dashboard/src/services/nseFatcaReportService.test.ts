import { expect, it } from 'vitest';
import { buildNSEFatcaReport as build } from './nseFatcaReportService';
it('prioritizes up to fifty PAN/PKERN identifiers', () => {
  expect(build({ pan_pkern_no: 'abcde1234f, NTND006', from_date: '', to_date: '' })).toEqual({ pan_pkern_no: 'ABCDE1234F,NTND006' });
  expect(() => build({ pan_pkern_no: Array(51).fill('TEST').join(','), from_date: '', to_date: '' })).toThrow();
});
it('enforces conditional date ranges up to 31 days', () => {
  expect(build({ pan_pkern_no: '', from_date: '01-01-2025', to_date: '01-02-2025' })).toEqual({ from_date: '01-01-2025', to_date: '01-02-2025' });
  expect(() => build({ pan_pkern_no: '', from_date: '01-01-2025', to_date: '02-02-2025' })).toThrow();
});
