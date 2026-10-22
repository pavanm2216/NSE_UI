import { afterEach, expect, it, vi } from 'vitest';
import { buildStpModification as build, modifyNSEStp } from './nseStpModificationService';
import { NSE_TOKEN_KEY } from './nseApi';
afterEach(() => { vi.unstubAllGlobals(); sessionStorage.clear(); });
it('allows physical amount changes while excluding mode, units and response fields', () => {
  const row = build('123', { amount: '2000' }, '', true, true, 'PHYSICAL').mod_data[0];
  expect(row).toMatchObject({ sys_reg_no: '123', amount: '2000', send_2fa: 'Y' });
  expect(row).not.toHaveProperty('units'); expect(row).not.toHaveProperty('trans_mode'); expect(row).not.toHaveProperty('status');
  expect(() => build('123', { amount: '2000' }, '', true, true, 'DEMAT')).toThrow('physical STP');
  expect(build('123', { euin_number: 'E123456' }, '', true, true, 'DEMAT').mod_data[0]).toHaveProperty('euin_number', 'E123456');
});
it('sanitizes backend database failure and never confirms the modification', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, text: async () => JSON.stringify({ detail: 'DB save failed: internal SQL and parameters' }) }));
  await expect(modifyNSEStp('123', { amount: '2000' }, '', true, true, 'P')).rejects.toThrow('change is not confirmed');
});
it('requires matching MODIFICATION_SUCCESS and preserves business failure', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ mod_data: [{ sys_reg_no: '123', status: 'MODIFICATION_FAILED', status_remarks: 'Invalid STP' }] }) });
  vi.stubGlobal('fetch', fetcher);
  await expect(modifyNSEStp('123', { amount: '2000' }, '', true, true, 'P')).rejects.toThrow('Invalid STP');
  fetcher.mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ mod_data: [{ sys_reg_no: '123', status: 'MODIFICATION_SUCCESS' }] }) });
  await expect(modifyNSEStp('123', { amount: '2000' }, '', true, true, 'P')).resolves.toContain('confirmed');
});
