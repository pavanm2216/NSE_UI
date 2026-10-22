import { afterEach, expect, it, vi } from 'vitest';
import { buildNSESwp as build, registerNSESwp, type NSESwpInput } from './nseSwpService';
import { nseApi } from './nseApi';
const input: NSESwpInput = { investor: { clientCode: 'TEST001', name: 'Test investor', kycVerified: true, kycType: 'KRA', clientType: 'NON DEMAT', depository: 'PHYS', bank: { id: '1', label: 'Bank', accountNo: '000011112222', active: true, status: 'ACTIVE', isDefault: true } }, scheme: 'SOURCE', mode: 'P', folio: 'REALFOLIO', start: '2099-10-15', end: '', frequency: 'MONTHLY', transfers: '12', amount: '1000', units: '', firstToday: false, euinDeclaration: 'N', euin: '', mobile: '', email: 'test@example.com', remarks: '', reference: 'STPTEST001' };
afterEach(() => vi.restoreAllMocks());
it('accepts the four PDF frequencies and rejects undocumented SWP frequencies', () => {
  for (const frequency of ['WEEKLY', 'MONTHLY', 'QUARTERLY']) expect(build({ ...input, frequency }).reg_data[0]).toHaveProperty('frequency_type', frequency);
  for (const frequency of ['FORTNIGHTLY', 'SEMI-ANNUAL', 'ANNUAL', 'ANNUALLY']) expect(() => build({ ...input, frequency })).toThrow('SWP frequency');
});
it('requires an unmasked registered payout account and SWP decimal precision', () => {
  expect(() => build({ ...input, investor: { ...input.investor, bank: { ...input.investor.bank, accountNo: undefined } } })).toThrow('payout bank');
  expect(() => build({ ...input, amount: '10000000000' })).toThrow('10 integer');
  expect(() => build({ ...input, amount: '', units: '1000000000' })).toThrow('9 integer');
  expect(build(input).reg_data[0]).toHaveProperty('account_no', '000011112222');
});
it('uses documented P/D mode and sends only request fields', () => {
  expect(build(input).reg_data[0]).toMatchObject({ trans_mode: 'P', installment_amount: '1000', installment_units: '', start_date: '15/10/2099', no_of_withdrawals: '12', first_order_today: 'N' });
  expect(build(input).reg_data[0]).not.toHaveProperty('reg_status');
});
it('requires physical folio, contact and either amount or units', () => {
  for (const change of [{ folio: '' }, { email: '' }, { units: '10' }, { amount: '' }, { amount: '1.001' }]) expect(() => build({ ...input, ...change })).toThrow();
});
it('requires demat units and prohibits demat for physical clients', () => {
  expect(() => build({ ...input, mode: 'D', units: '10', amount: '' })).toThrow('physical client');
  const demat = { ...input, investor: { ...input.investor, clientType: 'DEMAT', depository: 'CDSL' }, mode: 'D' as const, units: '10.123', amount: '' };
  expect(build(demat).reg_data[0]).toMatchObject({ trans_mode: 'D', installment_units: '10.123', installment_amount: '' });
  expect(() => build({ ...demat, amount: '1000' })).toThrow('units');
});
it('handles daily end dates and response business failures', async () => {
  expect(build({ ...input, frequency: 'DAILY', end: '2099-12-15' }).reg_data[0]).toMatchObject({ no_of_withdrawals: '', end_date: '15/12/2099' });
  vi.spyOn(nseApi, 'registerSwp').mockResolvedValue({ reg_data: [{ client_code: 'TEST001', scheme_code: 'SOURCE', reg_status: 'REG_FAILED', reg_id: '0', reg_remark: 'CLIENT DOES NOT EXISTS.' }] });
  expect(await registerNSESwp(input)).toMatchObject({ status: 'rejected', registrationId: undefined });
});
