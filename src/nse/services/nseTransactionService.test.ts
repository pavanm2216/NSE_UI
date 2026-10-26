import { expect, it } from 'vitest';
import { buildNSETransaction as build } from './nseTransactionService';
const input = { from_date: '01-01-2025', to_date: '08-01-2025', date_type: 'REQUEST_DATE', order_id: '', systematic_reg_id: '', client_code: '', applicant_name: '', pan: '' };
it('applies order then registration ID precedence', () => {
  expect(build({ ...input, order_id: '123, 456', systematic_reg_id: '999' })).toEqual({ from_date: input.from_date, to_date: input.to_date, order_id: '123,456' });
  expect(build({ ...input, systematic_reg_id: '999' })).toEqual({ from_date: input.from_date, to_date: input.to_date, systematic_reg_id: '999' });
});
it('limits last activity searches to three days and validates IDs and PAN', () => {
  expect(() => build({ ...input, date_type: 'LAST_ACTIVITY_DATE' })).toThrow('3 days');
  expect(() => build({ ...input, order_id: 'string' })).toThrow();
  expect(() => build({ ...input, pan: 'invalid' })).toThrow('PAN');
  expect(build({ ...input, date_type: 'LAST_ACTIVITY_DATE', to_date: '04-01-2025' })).toHaveProperty('date_type', 'LAST_ACTIVITY_DATE');
});
