import { afterEach, expect, it, vi } from 'vitest';
import { buildNSEElogUpload as build, uploadNSEElog } from './nseElogUploadService';
import { NSE_TOKEN_KEY } from './nseApi';
const input = { client: 'TEST001', holders: [{ pan: 'ABCDE1234F', ip: '192.168.1.1', date: '01-JAN-25 10:10:01' }] };
afterEach(() => { vi.unstubAllGlobals(); sessionStorage.clear(); });
it('sends actual holder log fields and validates conditional holder data', () => {
  expect(build(input)).toMatchObject({ client_code: 'TEST001', primary_holder_pan: 'ABCDE1234F', primary_holder_log_date: '01-JAN-25 10:10:01' });
  expect(() => build({ ...input, holders: [...input.holders, { pan: '', ip: '', date: '' }] })).toThrow('Holder 2');
  expect(() => build({ ...input, holders: [{ ...input.holders[0], ip: '999.1.1.1' }] })).toThrow('IPv4');
  expect(() => build({ ...input, holders: [{ ...input.holders[0], date: '30-FEB-25 10:10:01' }] })).toThrow('calendar');
});
it('requires matching holder and client with elog_status 100', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ ...build(input), elog_status: '100', elog_status_message: 'Uploaded' }) }); vi.stubGlobal('fetch', fetcher);
  await expect(uploadNSEElog(input)).resolves.toBe('Uploaded');
  fetcher.mockResolvedValue({ ok: false, status: 500, text: async () => JSON.stringify({ detail: 'internal validation with client data' }) });
  await expect(uploadNSEElog(input)).rejects.toThrow('Upload is not confirmed');
});
