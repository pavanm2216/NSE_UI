import { expect, it, vi } from 'vitest';
vi.mock('./nseApi', () => ({ nseRequest: vi.fn(), NSEApiError: class extends Error { constructor(message: string, public status: number) { super(message); } } }));
import { nseRequest, NSEApiError } from './nseApi';
import { buildNftSingleBank, submitNftSingleBank } from './nseNftSingleBankService';
import { buildNftImage, uploadNftImage, validateNftImage } from './nseNftImageService';
const bank = { AMC_CODE: 'TST', FOLIO_NO: '123', TAX_NUMBER: 'AAAAA1234A', DOC_TYPE: '', TWOFA_AUTH: 'E', EMAIL: 'investor@example.test', PB_ACT_NO: '000123456789', PB_HLD_NAM: 'Test holder', PB_IFSC_CD: 'TEST0000123', PB_ACT_TY: 'SB', PB_NAM: 'Test bank', PB_BR_NAM: 'Test branch' };
const tiff = () => new File([new Uint8Array([73, 73, 42, 0, 8, 0, 0, 0])], 'test.tiff', { type: 'image/tiff' });
it('uses primary-bank keys and rejects incomplete or malformed changes', () => {
  const row = buildNftSingleBank(bank).nft_change_of_bank_account_details[0];
  expect(row.PB_ACT_NO).toBe('000123456789'); expect(row).not.toHaveProperty('AB1_ACT_NO'); expect(row).not.toHaveProperty('NCT_TYPE');
  expect(() => buildNftSingleBank({ ...bank, PB_BR_NAM: '' })).toThrow('branch');
  expect(() => buildNftSingleBank({ ...bank, PB_IFSC_CD: 'invalid' })).toThrow('IFSC');
  expect(() => buildNftSingleBank({ ...bank, PB_ACT_NO: '1'.repeat(41) })).toThrow('40');
});
it('requires explicit primary-bank Success and sanitizes 404', async () => {
  vi.mocked(nseRequest).mockResolvedValueOnce({ Status: 'Success', Message: 'Request received' });
  expect(await submitNftSingleBank(bank)).toBe('Request received');
  expect(nseRequest).toHaveBeenLastCalledWith('/nft/change-of-bank-single', buildNftSingleBank(bank));
  vi.mocked(nseRequest).mockRejectedValueOnce(new NSEApiError('<html>404</html>', 404));
  await expect(submitNftSingleBank(bank)).rejects.toThrow('unavailable');
  vi.mocked(nseRequest).mockResolvedValueOnce({ Message: '' });
  await expect(submitNftSingleBank(bank)).rejects.toThrow('did not confirm');
});
it('requires an exact reference match and enforces portal size and format limits', () => {
  expect(() => validateNftImage('other.tiff', tiff())).toThrow('exactly match');
  expect(() => validateNftImage('test.tiff', new File([], 'test.tiff'))).toThrow('nonempty');
  expect(() => validateNftImage('test.tiff', new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'test.tiff'))).toThrow('5 MB');
  expect(() => validateNftImage('test.jpg', new File(['data'], 'test.jpg'))).toThrow('TIFF');
});
it('encodes raw base64 and rejects fake TIFF content', async () => {
  const body = await buildNftImage('test.tiff', tiff());
  expect(body.img_name).toBe('test.tiff'); expect(body.img_data).not.toContain('data:'); expect(atob(body.img_data).slice(0, 4)).toBe('II\x2a\x00');
  await expect(buildNftImage('test.tiff', new File(['not tiff'], 'test.tiff'))).rejects.toThrow('content');
});
it('requires successful upload of the same image reference', async () => {
  vi.mocked(nseRequest).mockResolvedValueOnce({ img_name: 'test.tiff', status: 'SUCCESS', message: 'Uploaded successfully' });
  expect(await uploadNftImage('test.tiff', tiff())).toBe('Uploaded successfully');
  vi.mocked(nseRequest).mockResolvedValueOnce({ img_name: 'other.tiff', status: 'SUCCESS' });
  await expect(uploadNftImage('test.tiff', tiff())).rejects.toThrow('different');
  vi.mocked(nseRequest).mockResolvedValueOnce({ status: 'FAIL', message: 'IMG_REF_NO is not found in system' });
  await expect(uploadNftImage('test.tiff', tiff())).rejects.toThrow('not found');
});
