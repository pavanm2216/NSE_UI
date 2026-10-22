import { expect, it } from 'vitest';
import { buildNSETwoFa as build } from './nseTwoFaService';
const input = { from_date: '01-01-2025', to_date: '08-01-2025', product_type: '', product_id: '', client_code: '' };
it('uses the capitalized product_type field and ID precedence', () => {
  expect(build({ ...input, product_type: 'PUR', product_id: '123, 456', client_code: 'TEST' })).toEqual({ from_date: input.from_date, to_date: input.to_date, product_type: 'PUR', product_id: '123,456' });
});
it('requires IDs for a product and validates date and batch limits', () => {
  expect(() => build({ ...input, product_type: 'PUR' })).toThrow('required');
  expect(() => build({ ...input, product_type: 'XSIP' })).toThrow('documented');
  expect(() => build({ ...input, to_date: '09-01-2025' })).toThrow('7 days');
  expect(() => build({ ...input, product_id: Array(51).fill('123').join(',') })).toThrow();
});
