import { expect, it } from 'vitest';
import { buildSipDueRequest as build } from './nseSipDueService';
it('uses ID and client filter priority without requiring dates', () => {
  expect(build({ sip_reg_id: '123, 456', client_code: 'TEST', from_date: 'string' })).toEqual({ sip_reg_id: '123,456' });
  expect(build({ client_code: 'TEST,OTHER' })).toEqual({ client_code: 'TEST,OTHER' });
  expect(() => build({ sip_reg_id: 'string' })).toThrow('numeric SIP IDs');
  expect(() => build({ sip_reg_id: Array(51).fill('123').join(',') })).toThrow('50');
});
it('enforces real dates, no past start, a later end and seven day gap', () => {
  const today = '2026-10-15';
  expect(build({ from_date: '15-10-2026', to_date: '22-10-2026' }, today)).toEqual({ from_date: '15-10-2026', to_date: '22-10-2026' });
  for (const [from_date, to_date] of [['14-10-2026', '16-10-2026'], ['15-10-2026', '15-10-2026'], ['15-10-2026', '23-10-2026'], ['30-02-2026', '01-03-2026']]) expect(() => build({ from_date, to_date }, today)).toThrow();
});
