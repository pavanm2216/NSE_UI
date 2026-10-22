import { afterEach, expect, it, vi } from 'vitest';
import { buildSipModification as build, modifyNSESip } from './nseSipModificationService';
import { NSE_TOKEN_KEY } from './nseApi';
afterEach(() => { vi.unstubAllGlobals(); sessionStorage.clear(); });
it('sends selected changes, flags and registration ID without response or transaction mode fields', () => {
  const row = build('123', { amount: '10000', euin_number: 'e123456' }, '', true, true).mod_data[0];
  expect(row).toMatchObject({ sys_reg_no: '123', amount: '10000', euin_number: 'E123456', send_2fa: 'Y', send_comm: 'Y' });
  expect(row).not.toHaveProperty('trans_mode'); expect(row).not.toHaveProperty('status'); expect(row).not.toHaveProperty('units');
});
it('validates changes and documented field formats', () => {
  for (const edits of [{}, { amount: '0' }, { amount: '1.001' }, { primary_holder_email: 'bad' }, { primary_holder_mobile: '123' }, { euin_number: '1234567' }, { sub_broker_arn: 'BAD' }]) expect(() => build('123', edits, '', true, true)).toThrow();
  expect(() => build('string', { amount: '100' }, '', true, true)).toThrow();
});
it('requires matching MODIFICATION_SUCCESS and preserves failure remarks', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ mod_data: [{ sys_reg_no: '123', status: 'MODIFICATION_FAILED', status_remarks: 'SIP REG. NO. IS NOT VALID.' }] }) });
  vi.stubGlobal('fetch', fetcher);
  await expect(modifyNSESip('123', { amount: '1000' }, '', true, true)).rejects.toThrow('SIP REG. NO.');
  fetcher.mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ mod_data: [{ sys_reg_no: '123', status: 'MODIFICATION_SUCCESS' }] }) });
  await expect(modifyNSESip('123', { amount: '1000' }, '', true, true)).resolves.toContain('confirmed');
});
