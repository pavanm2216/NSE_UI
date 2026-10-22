import { expect, it } from 'vitest';
import { buildSwpDueRequest as build } from './nseSwpDueService';
it('uses the STP request field and prioritizes IDs then clients', () => {
  expect(build({ swp_reg_id: '123, 456', client_code: 'TEST', from_date: 'string' })).toEqual({ swp_reg_id: '123,456' });
  expect(build({ client_code: 'TEST,OTHER' })).toEqual({ client_code: 'TEST,OTHER' });
  expect(() => build({ swp_reg_id: 'string' })).toThrow();
  expect(() => build({ swp_reg_id: Array(51).fill('123').join(',') })).toThrow();
});
it('allows at most a seven day gap with no past start and a later end', () => {
  const today = '2026-10-15';
  expect(build({ from_date: '15-10-2026', to_date: '22-10-2026' }, today)).toEqual({ from_date: '15-10-2026', to_date: '22-10-2026' });
  for (const [from_date, to_date] of [['14-10-2026', '16-10-2026'], ['15-10-2026', '15-10-2026'], ['15-10-2026', '23-10-2026'], ['30-02-2026', '01-03-2026']]) expect(() => build({ from_date, to_date }, today)).toThrow();
});
