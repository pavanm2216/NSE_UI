import { expect, it } from 'vitest';
import { buildNSEKycRequest as build } from './nseKycRequest';
it('sends PAN or client codes exclusively, with PAN priority', () => {
  expect(build({ pan_no: 'abcde1234f', client_code: 'TEST', from_date: 'string' })).toEqual({ pan_no: 'ABCDE1234F' });
  expect(build({ client_code: 'TEST, OTHER' })).toEqual({ client_code: 'TEST,OTHER' });
});
it('rejects placeholders and validates conditional dates and batch sizes', () => {
  expect(() => build({ pan_no: 'string' })).toThrow('valid PAN');
  expect(() => build({ pan_no: Array(51).fill('ABCDE1234F').join(',') })).toThrow();
  expect(build({ from_date: '01-01-2025', to_date: '08-01-2025' })).toEqual({ from_date: '01-01-2025', to_date: '08-01-2025' });
  expect(() => build({ from_date: '01-01-2025', to_date: '09-01-2025' })).toThrow('7 days');
});
