import { afterEach, expect, it, vi } from 'vitest';
import { buildNSEUtr as build, updateNSEUtr } from './nseUtrService';
import { NSE_TOKEN_KEY } from './nseApi';
const input = { client: 'TEST001', order: '123', bank: 'Test bank', account: '000011112222', ifsc: 'TEST0001234', utr: 'UTRTEST001', date: '2025-01-01' };
afterEach(() => { vi.unstubAllGlobals(); sessionStorage.clear(); });
it('validates limits and converts dates without response-only fields', () => {
  expect(build(input).utr_details[0]).toMatchObject({ transfer_date: '01/01/2025', utr_no: 'UTRTEST001' });
  expect(build(input).utr_details[0]).not.toHaveProperty('status');
  expect(() => build({ ...input, account: '1'.repeat(21) })).toThrow('20 digits');
  expect(() => build({ ...input, date: '2099-01-01' })).toThrow('future');
});
it('confirms only matching status 100 and surfaces backend failure safely', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ utr_details: [{ ...build(input).utr_details[0], status: 100 }] }) }); vi.stubGlobal('fetch', fetcher);
  await expect(updateNSEUtr(input)).resolves.toContain('confirmed');
  fetcher.mockResolvedValue({ ok: false, status: 500, text: async () => JSON.stringify({ detail: "'list' object has no attribute 'get'" }) });
  await expect(updateNSEUtr(input)).rejects.toThrow('not confirmed');
});
