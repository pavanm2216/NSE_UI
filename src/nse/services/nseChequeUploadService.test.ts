import { afterEach, expect, it, vi } from 'vitest';
import { uploadNSECheque, validateNSEChequeBank } from './nseChequeUploadService';
import { NSE_TOKEN_KEY } from './nseApi';
const bank = { client: 'TEST001', account: '000011112222', ifsc: 'TEST0001234', type: 'SB' };
afterEach(() => { vi.unstubAllGlobals(); sessionStorage.clear(); });
it('validates documented bank lengths and types', () => {
  expect(() => validateNSEChequeBank(bank)).not.toThrow();
  expect(() => validateNSEChequeBank({ ...bank, account: '1'.repeat(26) })).toThrow('25');
  expect(() => validateNSEChequeBank({ ...bank, type: 'string' })).toThrow('type');
});
it('sends raw PNG base64 and preserves HTTP 200 business failures', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const file = new File([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], 'cheque.png', { type: 'image/png' });
  const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ status: '100', message: 'Cheque Uploaded Successfully.' }) }); vi.stubGlobal('fetch', fetcher);
  await expect(uploadNSECheque(bank, file)).resolves.toContain('Successfully');
  expect(fetcher).toHaveBeenCalledWith('/nse-api/cancel-cheque/upload', expect.objectContaining({ body: JSON.stringify({ file_name: 'cheque.png', client_code: bank.client, account_no: bank.account, ifsc: bank.ifsc, account_type: bank.type, file_data: 'iVBORw0KGgo=' }) }));
  fetcher.mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ status: '101', message: 'Invalid Client Code.' }) });
  await expect(uploadNSECheque(bank, file)).rejects.toThrow('Invalid Client Code');
});
