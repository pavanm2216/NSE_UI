import { afterEach, expect, it, vi } from 'vitest';
import { uploadNSEMandateImage } from './nseMandateImageService';
import { NSE_TOKEN_KEY } from './nseApi';
afterEach(() => { vi.unstubAllGlobals(); sessionStorage.clear(); });
const jpeg = () => new File([new Uint8Array([255, 216, 255, 224, 0])], 'mandate.jpg', { type: 'image/jpeg' });
it('sends raw base64 with the mandate identity and requires status 100', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ status: '100', message: 'Mandate Uploaded Successfully.' }) });
  vi.stubGlobal('fetch', fetcher);
  await expect(uploadNSEMandateImage('TEST001', '123', jpeg())).resolves.toBe('Mandate Uploaded Successfully.');
  expect(fetcher).toHaveBeenCalledWith('/nse-api/mandate/image-upload', expect.objectContaining({ body: JSON.stringify({ client_code: 'TEST001', mandate_id: '123', file_name: 'mandate.jpg', file_data: '/9j/4AA=' }) }));
});
it('surfaces application failure even when HTTP is 200', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ status: '101', message: 'Image already uploaded.' }) }));
  await expect(uploadNSEMandateImage('TEST001', '123', jpeg())).rejects.toThrow('Image already uploaded.');
});
it('blocks invalid IDs, filenames, empty images and renamed documents before sending', async () => {
  const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
  await expect(uploadNSEMandateImage('TEST001', '0', jpeg())).rejects.toThrow('confirmed numeric');
  await expect(uploadNSEMandateImage('TEST001', '123', new File(['test'], 'scan.pdf'))).rejects.toThrow('.jpg');
  await expect(uploadNSEMandateImage('TEST001', '123', new File([], 'scan.jpg'))).rejects.toThrow('nonempty');
  await expect(uploadNSEMandateImage('TEST001', '123', new File(['not an image'], 'scan.jpg'))).rejects.toThrow('JPEG image');
  expect(fetcher).not.toHaveBeenCalled();
});
