import { afterEach, expect, it, vi } from 'vitest';
import { uploadNSEPoa, validateNSEPoa } from './nsePoaService';
import { NSE_TOKEN_KEY } from './nseApi';
afterEach(() => { vi.unstubAllGlobals(); sessionStorage.clear(); });
it.each([['test.pdf', '%PDF-1.7'], ['test.tif', 'II\x2a\x00test'], ['test.tiff', 'MM\x00\x2atest']])('supports documented format %s with raw base64', async (name, data) => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ status: '100', message: 'POA Uploaded Successfully.' }) }); vi.stubGlobal('fetch', fetcher);
  await expect(uploadNSEPoa('TEST001', new File([data], name))).resolves.toContain('Successfully');
  expect(fetcher).toHaveBeenCalledWith('/nse-api/poa/upload', expect.objectContaining({ body: JSON.stringify({ client_code: 'TEST001', file_name: name, file_data: btoa(data) }) }));
});
it('rejects unsupported and renamed content, and surfaces mapping failures', async () => {
  expect(() => validateNSEPoa('TEST001', new File(['test'], 'test.exe'))).toThrow('Choose');
  await expect(uploadNSEPoa('TEST001', new File(['not pdf'], 'test.pdf'))).rejects.toThrow('content');
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ status: '101', message: 'Client Code is not active or not mapped with the specified Member ID.' }) }));
  await expect(uploadNSEPoa('TEST001', new File(['%PDF-1.7'], 'test.pdf'))).rejects.toThrow('not mapped');
});
