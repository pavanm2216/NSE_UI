import { expect, it } from 'vitest';
import { buildNSEAofReport as build } from './nseAofReportService';
it('prioritizes up to fifty PAN/PKERN identifiers', () => {
  expect(build({ client_code: 'abcde1234f, NTND006', from_date: '', to_date: '' })).toEqual({ client_code: 'ABCDE1234F,NTND006' });
  expect(() => build({ client_code: Array(51).fill('TEST').join(','), from_date: '', to_date: '' })).toThrow();
});
it('enforces conditional date ranges up to 31 days', () => {
  expect(build({ client_code: '', from_date: '01-01-2025', to_date: '01-02-2025' })).toEqual({ from_date: '01-01-2025', to_date: '01-02-2025' });
  expect(() => build({ client_code: '', from_date: '01-01-2025', to_date: '02-02-2025' })).toThrow();
});
