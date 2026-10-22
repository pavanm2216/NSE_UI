import { expect, it } from 'vitest';
import { buildSipReportRequest as build } from './nseSipReportService';
it('applies SIP ID, member reference and client priority', () => {
  expect(build({ sip_reg_id: '123, 456', client_code: 'TEST', member_unique_ids: 'REF' })).toEqual({ sip_reg_id: '123,456' });
  expect(build({ member_unique_ids: 'REF', client_code: 'TEST' })).toEqual({ member_unique_ids: 'REF' });
  expect(build({ client_code: 'TEST, OTHER' })).toEqual({ client_code: 'TEST,OTHER' });
});
it('requires real ordered dates within a 31 day gap', () => {
  expect(build({ from_date: '01-10-2026', to_date: '01-11-2026' })).toEqual({ from_date: '01-10-2026', to_date: '01-11-2026' });
  for (const dates of [{}, { from_date: '30-02-2026', to_date: '01-03-2026' }, { from_date: '01-10-2026', to_date: '01-10-2026' }, { from_date: '01-10-2026', to_date: '02-11-2026' }]) expect(() => build(dates)).toThrow();
});
it('rejects placeholders, malformed lists and batches above 50', () => {
  expect(() => build({ sip_reg_id: 'string' })).toThrow('numeric SIP IDs');
  expect(() => build({ sip_reg_id: Array(51).fill('123').join(',') })).toThrow('50');
  expect(() => build({ client_code: 'TEST,' })).toThrow();
});
