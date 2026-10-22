import { afterEach, expect, it, vi } from 'vitest';
import { NSE_TOKEN_KEY } from './nseApi';
import { buildSipCancellation, cancelNSESip } from './nseSipCancellationService';
afterEach(() => { vi.unstubAllGlobals(); sessionStorage.clear(); });
const mock = (body: unknown) => { sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token'); const fn = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify(body) }); vi.stubGlobal('fetch', fn); return fn; };
it('validates reasons and sends no response-only fields', () => {
  expect(buildSipCancellation('TEST001', '123', '01')).toEqual({ can_data: [{ client_code: 'TEST001', sip_reg_no: '123', remarks: '01' }] });
  expect(buildSipCancellation('TEST001', '123', '13', 'Reason').can_data[0].remarks).toBe('13:(Reason)');
  for (const [id, code, other] of [['string', '01', ''], ['123', '00', ''], ['123', '13', ''], ['123', '13', 'a'.repeat(96)]]) expect(() => buildSipCancellation('TEST001', id, code, other)).toThrow();
});
it.each(['can_data', 'reg_data'])('accepts matching CAN_SUCCESS from %s', async key => {
  mock({ [key]: [{ client_code: 'TEST001', sip_reg_no: '123', can_status: 'CAN_SUCCESS' }] });
  await expect(cancelNSESip('TEST001', '123', '01')).resolves.toContain('confirmed');
});
it('rejects HTTP 200 business failure and mismatched responses', async () => {
  mock({ can_data: [{ client_code: 'TEST001', sip_reg_no: '123', can_status: 'CAN_FAILED', can_remark: 'Invalid SIP registration number' }] });
  await expect(cancelNSESip('TEST001', '123', '01')).rejects.toThrow('Invalid SIP');
  mock({ reg_data: [{ client_code: 'OTHER', sip_reg_no: '123', can_status: 'CAN_SUCCESS' }] });
  await expect(cancelNSESip('TEST001', '123', '01')).rejects.toThrow('no matching');
});
