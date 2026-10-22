import { afterEach, expect, it, vi } from 'vitest';
import { buildOrderCancellation as build, cancelNSEOrder } from './nseOrderCancellationService';
import { NSE_TOKEN_KEY } from './nseApi';
afterEach(() => { vi.unstubAllGlobals(); sessionStorage.clear(); });
it('allows optional free-text remarks and omits response fields', () => {
  expect(build('TEST001', '123')).toEqual({ can_data: [{ client_code: 'TEST001', order_no: '123', remarks: '' }] });
  expect(() => build('TEST001', 'string')).toThrow();
  expect(() => build('TEST001', '123', 'a'.repeat(501))).toThrow();
});
it.each(['reg_data', 'can_data'])('supports matching CAN SUCCESS in %s', async key => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ [key]: [{ client_code: 'TEST001', order_no: '123', can_status: 'CAN SUCCESS' }] }) }));
  await expect(cancelNSEOrder('TEST001', '123')).resolves.toContain('confirmed');
});
it('preserves failure remarks from HTTP 200 responses', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ can_data: [{ client_code: 'TEST001', order_no: '123', can_status: 'CAN FAILED', can_remark: 'INVALID order REGISTRATION NUMBER.' }] }) }));
  await expect(cancelNSEOrder('TEST001', '123')).rejects.toThrow('INVALID order');
});
