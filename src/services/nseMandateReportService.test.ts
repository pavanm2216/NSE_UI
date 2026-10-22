import { describe, expect, it } from 'vitest';
import { buildMandateReportRequest as build } from './nseMandateReportService';
describe('Mandate report filters', () => {
  it('applies mandate, member and client filter priority', () => {
    expect(build({ mandate_id: '123, 456', memberMandateIds: 'REF1', client_code: 'CLIENT' })).toEqual({ mandate_id: '123,456' });
    expect(build({ memberMandateIds: 'REF1', client_code: 'CLIENT' })).toEqual({ memberMandateIds: 'REF1' });
    expect(build({ client_code: 'CLIENT1, CLIENT2' })).toEqual({ client_code: 'CLIENT1,CLIENT2' });
  });
  it('requires real ordered dates when no lookup IDs are supplied', () => {
    expect(() => build({})).toThrow('Choose valid');
    expect(() => build({ from_date: '2026-02-30', to_date: '2026-03-01' })).toThrow('Choose valid');
    expect(() => build({ from_date: '2026-10-15', to_date: '2026-10-01' })).toThrow('From date');
    expect(build({ from_date: '2026-10-01', to_date: '2026-10-15' })).toEqual({ from_date: '2026-10-01', to_date: '2026-10-15' });
  });
  it('rejects placeholders, nonnumeric mandate IDs and overlarge batches', () => {
    expect(() => build({ mandate_id: 'string' })).toThrow('numeric IDs');
    expect(() => build({ mandate_id: Array(51).fill('123').join(',') })).toThrow('50');
    expect(() => build({ client_code: 'A'.repeat(21) })).toThrow('20 characters');
    expect(() => build({ memberMandateIds: 'ref,' })).toThrow();
  });
});
