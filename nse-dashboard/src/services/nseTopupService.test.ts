import { afterEach, expect, it, vi } from 'vitest';
import { buildNSETopup as build, registerNSETopup, type NSETopupInput } from './nseTopupService';
import { NSE_TOKEN_KEY } from './nseApi';
const input: NSETopupInput = { product: 'XSIP', id: '123', client: 'TEST001', baseAmount: '1000', baseStart: '05 DEC 2098', baseEnd: '05 DEC 2105', amount: '500', start: '2099-12-05', end: '2100-12-05', mobile: '', email: 'test@example.com', reference: 'TOPUPTEST001' };
afterEach(() => { vi.unstubAllGlobals(); sessionStorage.clear(); });
it('uses XSP and annual top-up with actual base amount and no response fields', () => {
  expect(build(input, '2099-01-01').reg_data[0]).toMatchObject({ req_type: 'XSP', sip_reg_no: '123', installment_amount: '1000', topup_frequency: 'ANNUALLY', topup_amount: '500', start_date: '05/12/2099' });
  expect(build({ ...input, product: 'SIP' }, '2099-01-01').reg_data[0].req_type).toBe('SIP');
});
it('enforces base day, future start, whole-year duration, base end and contact', () => {
  for (const update of [{ start: '2099-12-06' }, { start: '2098-12-05' }, { end: '2100-06-05' }, { end: '2106-12-05' }, { email: '' }, { amount: '1.001' }]) expect(() => build({ ...input, ...update }, '2099-01-01')).toThrow();
});
it('requires matching REG_SUCCESS with a valid nonzero registration ID', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ reg_data: [{ client_code: 'TEST001', req_type: 'XSP', sip_reg_no: '123', reg_status: 'REG_FAILED', reg_id: '0', reg_remark: 'Invalid plan' }] }) });
  vi.stubGlobal('fetch', fetcher);
  await expect(registerNSETopup(input)).rejects.toThrow('Invalid plan');
  fetcher.mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ reg_data: [{ client_code: 'TEST001', req_type: 'XSP', sip_reg_no: 123, reg_status: 'REG_SUCCESS', reg_id: '456' }] }) });
  await expect(registerNSETopup(input)).resolves.toMatchObject({ id: '456' });
});
