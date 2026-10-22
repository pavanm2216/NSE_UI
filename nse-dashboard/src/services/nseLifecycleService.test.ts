import { expect, it } from 'vitest';
import { buildNSELifecycle as build } from './nseLifecycleService';
const input = { from_date: '01-01-2025', to_date: '08-01-2025', Product_type: '', product_id: '', client_code: '' };
it('uses the capitalized Product_type field and ID precedence', () => {
  expect(build({ ...input, Product_type: 'PUR', product_id: '123, 456', client_code: 'TEST' })).toEqual({ from_date: input.from_date, to_date: input.to_date, Product_type: 'PUR', product_id: '123,456' });
});
it('requires IDs for a product and validates date and batch limits', () => {
  expect(() => build({ ...input, Product_type: 'PUR' })).toThrow('required');
  expect(() => build({ ...input, Product_type: 'XSIP' })).toThrow('documented');
  expect(() => build({ ...input, to_date: '09-01-2025' })).toThrow('7 days');
  expect(() => build({ ...input, product_id: Array(51).fill('123').join(',') })).toThrow();
});
