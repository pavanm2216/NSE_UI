import { afterEach, expect, it, vi } from 'vitest';
import { buildNSEBankUpdate as build, updateNSEBank, type NSEBankUpdate } from './nseBankUpdateService';
import { NSE_TOKEN_KEY } from './nseApi';
const input: NSEBankUpdate = { client: 'TEST001', action: 'ADD', type: 'SB', account: '000011112222', ifsc: 'TEST0001234', micr: '', isDefault: true };
afterEach(() => { vi.unstubAllGlobals(); sessionStorage.clear(); });
it('uses ADD/DEL values despite the inconsistent two-character field size', () => {
  expect(build(input).bank_dtl[0]).toMatchObject({ action_type: 'ADD', default_bank_flag: 'Y' });
  expect(build(input).bank_dtl[0]).not.toHaveProperty('status');
  expect(() => build({ ...input, action: 'DEL' })).toThrow('default');
  expect(() => build({ ...input, micr: '123' })).toThrow('nine digits');
});
it('requires a matching SUCCESS and preserves failed or uncertain results', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ bank_dtl: [{ ...build(input).bank_dtl[0], status: 'SUCCESS' }] }) }); vi.stubGlobal('fetch', fetcher);
  await expect(updateNSEBank(input)).resolves.toContain('approval is separate');
  fetcher.mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ bank_dtl: [{ ...build(input).bank_dtl[0], status: 'FAIL', error_remark: 'bank not found' }] }) });
  await expect(updateNSEBank(input)).rejects.toThrow('bank not found');
  fetcher.mockResolvedValue({ ok: false, status: 500, text: async () => JSON.stringify({ detail: 'DB save failed: internal SQL' }) });
  await expect(updateNSEBank(input)).rejects.toThrow('not confirmed');
});
