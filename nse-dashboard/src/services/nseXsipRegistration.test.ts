import { afterEach, expect, it, vi } from 'vitest';
import { buildNSEXsip, registerNSEXsip, loadXSIPMandates, type NSEXsipInput } from './nseXsipService';
import { nseApi } from './nseApi';
const input: NSEXsipInput = { amcCode: 'TEST_MF', schemeCode: 'TEST-GR', investor: { clientCode: 'TEST001', memberCode: '123', clientType: 'NON DEMAT', depository: 'PHYS', name: 'Test Investor', kycType: 'KRA', kycVerified: true, bank: { id: '1', label: 'Bank', status: 'ACTIVE', active: true, isDefault: true } }, memberCode: '123', amount: 3000, startDate: '2099-10-15', frequency: 'MONTHLY', installments: '12', endDate: '', dpMode: 'P', folio: '', mandateId: '456', approvedMandate: { id: '456', bank: 'Test bank', amount: 10000 }, euinDeclaration: 'N', euin: '', firstOrderToday: false, reference: 'XSIPREF001' };
afterEach(() => vi.restoreAllMocks());
it('uses XSIP-specific fields, zero fees and disabled step-up without SIP fields', () => {
  const row = buildNSEXsip(input).reg_data[0];
  expect(row).toMatchObject({ xsip_mandate_id: '456', convenience_fee: '0', frequency_allowed: '1', status: '1', step_up_required: 'N', step_up_amount: '', trans_mode: 'P', dp_txn_mode: 'P', member_unique_id: 'XSIPREF001' });
  expect(row).not.toHaveProperty('sip_mandate_id'); expect(row).not.toHaveProperty('internal_ref_no'); expect(row).not.toHaveProperty('reg_status');
});
it.each(['FORTNIGHTLY', 'SEMI-ANNUAL', 'ANNUAL'])('preserves documented XSIP frequency %s', frequency => {
  expect(buildNSEXsip({ ...input, frequency }).reg_data[0].frequency_type).toBe(frequency);
});
it('requires approved mandate, debit limit, verified investor and daily end date', () => {
  expect(() => buildNSEXsip({ ...input, approvedMandate: null })).toThrow('approved mandate');
  expect(() => buildNSEXsip({ ...input, amount: 10001 })).toThrow('debit limit');
  expect(() => buildNSEXsip({ ...input, investor: { ...input.investor, kycVerified: false } })).toThrow('KYC');
  expect(() => buildNSEXsip({ ...input, frequency: 'DAILY' })).toThrow('date');
  expect(buildNSEXsip({ ...input, frequency: 'DAILY', endDate: '2099-12-15' }).reg_data[0]).toMatchObject({ installment_no: '', end_date: '15/12/2099' });
});
it('filters mandates by client and approval and rechecks before registration', async () => {
  const row = { clientCode: 'TEST001', status: 'APPROVED', mandateId: '456', amount: '10000', bankName: 'Test bank' };
  const report = vi.spyOn(nseApi, 'mandateStatus').mockResolvedValue({ response_status: 'S', report_data: [row, { ...row, clientCode: 'OTHER' }, { ...row, status: 'PENDING' }] });
  expect(await loadXSIPMandates('TEST001')).toHaveLength(1);
  const register = vi.spyOn(nseApi, 'registerXsip').mockResolvedValue({ reg_data: [{ client_code: 'TEST001', sch_code: 'TEST-GR', reg_status: 'REG_SUCCESS', reg_id: '12345' }] });
  expect(await registerNSEXsip(input)).toMatchObject({ status: 'successful', registrationId: '12345' });
  report.mockResolvedValue({ response_status: 'S', report_data: [{ ...row, status: 'PENDING' }] });
  await expect(registerNSEXsip(input)).rejects.toThrow('approval');
  expect(register).toHaveBeenCalledOnce();
});
