import { expect, it } from 'vitest';
import { buildNSERedemptionRequest as build, parseNSERedemptions as parse } from './nseRedemptionService';
it('enforces mandatory dates, thirty day gap and order ID priority without date_type', () => {
  expect(build({ from_date: '01-01-2025', to_date: '31-01-2025', order_ids: '123', client_code: 'TEST' })).toEqual({ from_date: '01-01-2025', to_date: '31-01-2025', order_ids: '123' });
  expect(() => build({ from_date: '01-01-2025', to_date: '01-02-2025' })).toThrow();
  expect(() => build({ from_date: '01-01-2025', to_date: '02-01-2025', order_ids: 'string' })).toThrow();
  expect(build({ from_date: '01-01-2025', to_date: '02-01-2025' })).not.toHaveProperty('date_type');
});
it('keeps requested units separate from statement units, amount and charges', () => {
  const result = parse({ response_status: 'S', report_data: [{ orderno: '123', clientcode: 'TEST', schemecode: 'TEST-GR', scheme_name: 'Test fund', amount: '-', qty: '100', allottedqty: '5000', allottednav: '10', allottedamt: '50000', validflag: 'Y', load_amount: '10', tax_amount: '20', stt: '0' }] });
  expect(result[0]).toMatchObject({ schemeName: 'Test fund', requestedUnits: 100, units: 5000, nav: 10, allottedAmount: 50000, orderAmount: null, load: 10, tax: 20, stt: 0, valid: true });
});
