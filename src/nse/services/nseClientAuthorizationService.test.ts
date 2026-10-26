import { expect, it } from 'vitest';
import { buildClientAuthorization as build } from './nseClientAuthorizationService';
const input = { from_date: '01-01-2025', to_date: '08-01-2025', client_code: '', auth_status: '', date_type: 'AUTH_SENT_DATE' };
it('prioritizes client codes while retaining mandatory dates', () => {
  expect(build({ ...input, client_code: 'TEST, OTHER', auth_status: 'string' })).toEqual({ from_date: input.from_date, to_date: input.to_date, client_code: 'TEST,OTHER' });
});
it('validates status filters and seven day date gap', () => {
  expect(() => build({ ...input, auth_status: 'SUCCESS' })).toThrow('documented');
  expect(() => build({ ...input, to_date: '09-01-2025' })).toThrow('7 days');
  expect(() => build({ ...input, client_code: Array(51).fill('TEST').join(',') })).toThrow('50');
});
