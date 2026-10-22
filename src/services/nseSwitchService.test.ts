import { afterEach, expect, it, vi } from 'vitest';
import { buildNSESwitch as build, submitNSESwitch, nseSwitchInvestorMode, type NSESwitchInput } from './nseSwitchService';
import { NSE_TOKEN_KEY } from './nseApi';
const input: NSESwitchInput = { investor: { clientCode: 'TEST001', name: 'Test', kycType: 'KRA', kycVerified: true, clientType: 'NON DEMAT', bank: { id: '1', label: 'Bank', active: true, status: 'ACTIVE', isDefault: true } }, from: 'SOURCE', to: 'TARGET', mode: 'P', folio: 'FOLIO1', amount: '1000', units: '', allUnits: false, euinDeclaration: 'N', euin: '', mobile: '', email: '', remarks: '', reference: 'SWITCHTEST001' };
afterEach(() => { vi.unstubAllGlobals(); sessionStorage.clear(); });
it('recognizes physical P and both depositories from Client Master', () => {
  expect(nseSwitchInvestorMode({ ...input.investor, clientType: 'P', depository: '' })).toBe('P');
  expect(() => build({ ...input, investor: { ...input.investor, clientType: 'P' }, mode: 'C', amount: '', units: '10' })).toThrow('physical client');
  expect(nseSwitchInvestorMode({ ...input.investor, clientType: 'D', depository: 'NSDL' })).toBe('N');
  expect(nseSwitchInvestorMode({ ...input.investor, clientType: 'D', depository: 'CDSL' })).toBe('C');
  expect(() => build({ ...input, investor: { ...input.investor, clientType: 'D', depository: 'NSDL' }, mode: 'C', amount: '', units: '10' })).toThrow('must match Client Master');
});
it('validates document lengths and optional ARN-prefixed distributor fields', () => {
  expect(build({ ...input, subBrokerCode: 'arn-1234', subBrokerArn: 'ARN-5678' }).transaction_details[0]).toMatchObject({ sub_broker_code: 'ARN-1234', sub_broker_arn: 'ARN-5678' });
  for (const change of [{ subBrokerCode: '1234' }, { subBrokerArn: '1234' }, { subBrokerCode: 'ARN' + '1'.repeat(13) }, { subBrokerArn: 'ARN' + '1'.repeat(18) }, { folio: '1'.repeat(16) }, { remarks: 'x'.repeat(201) }, { amount: '1000', units: '10' }, { to: 'SOURCE' }]) expect(() => build({ ...input, ...change })).toThrow();
});
it('supports physical amount or all units and omits response fields', () => {
  expect(build(input).transaction_details[0]).toMatchObject({ demat_physical: 'P', amount: '1000', kyc_flag: 'Y', all_units: 'N' });
  expect(build({ ...input, allUnits: true, amount: '' }).transaction_details[0]).toMatchObject({ all_units: 'Y', amount: '', units: '' });
  expect(() => build({ ...input, allUnits: true })).toThrow('blank');
});
it('requires units for demat and checks client depository and folio', () => {
  expect(() => build({ ...input, mode: 'C' })).toThrow('physical client');
  expect(() => build({ ...input, folio: '' })).toThrow('folio');
  const demat = { ...input, investor: { ...input.investor, clientType: 'DEMAT', depository: 'CDSL' }, mode: 'C' as const, amount: '', units: '10' };
  expect(build(demat).transaction_details[0]).toHaveProperty('units', '10');
  expect(() => build({ ...demat, allUnits: true })).toThrow();
});
it('tracks both exchange IDs without claiming execution', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ transaction_details: [{ client_code: 'TEST001', from_scheme_code: 'SOURCE', to_scheme_code: 'TARGET', trxn_status: 'TRXN SUCCESS', trxn_so_order_id: '123', trxn_si_order_id: '456' }] }) }));
  expect(await submitNSESwitch(input)).toMatchObject({ accepted: true, status: 'pending', outId: '123', inId: '456' });
});
