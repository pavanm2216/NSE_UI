import { afterEach, expect, it, vi } from 'vitest';
import { nseApi } from './nseApi';
import { getNSEHolderLinks } from './nseCommunicationService';
afterEach(() => vi.restoreAllMocks());
it('requests mandate authorization and preserves each holder identity', async () => {
  const api = vi.spyOn(nseApi, 'communicationLink').mockResolvedValue({ productType: 'MANDATE_AUTH', productRefId: '123', firstHolderLink: 'https://nseinvest.com/mf/test', secondHolderLink: '', thirdHolderLink: 'https://nseinvest.com/mf/third', errorMessage: '' });
  expect(await getNSEHolderLinks('MANDATE_AUTH', '123')).toEqual([{ holder: 'First holder', url: 'https://nseinvest.com/mf/test' }, { holder: 'Third holder', url: 'https://nseinvest.com/mf/third' }]);
  expect(api).toHaveBeenCalledWith({ productType: 'MANDATE_AUTH', productRefId: '123' });
});
it('rejects invalid IDs before making a request but allows client codes', async () => {
  const api = vi.spyOn(nseApi, 'communicationLink').mockResolvedValue({ productType: 'CL_ACT', productRefId: 'TEST001', firstHolderLink: 'https://nseinvest.com/mf/test' });
  await expect(getNSEHolderLinks('MANDATE_AUTH', 'string')).rejects.toThrow('valid product');
  expect(api).not.toHaveBeenCalled();
  await expect(getNSEHolderLinks('CL_ACT', 'TEST001')).resolves.toHaveLength(1);
});
it('handles HTTP 200 application errors and empty results', async () => {
  const api = vi.spyOn(nseApi, 'communicationLink').mockResolvedValue({ errorMessage: 'Only numeric value is allowed.' });
  await expect(getNSEHolderLinks('MANDATE_AUTH', '123')).rejects.toThrow('Only numeric');
  api.mockResolvedValue({ productType: 'MANDATE_AUTH', productRefId: '123', firstHolderLink: '' });
  await expect(getNSEHolderLinks('MANDATE_AUTH', '123')).rejects.toThrow('no authorization link');
});
it('rejects reference mismatches and unsafe URLs', async () => {
  const api = vi.spyOn(nseApi, 'communicationLink').mockResolvedValue({ productType: 'MANDATE_AUTH', productRefId: '456', firstHolderLink: 'https://nseinvest.com/test' });
  await expect(getNSEHolderLinks('MANDATE_AUTH', '123')).rejects.toThrow('different product');
  for (const firstHolderLink of ['javascript:alert(1)', 'http://nseinvest.com/test', 'https://user:password@nseinvest.com/test']) {
    api.mockResolvedValue({ productType: 'MANDATE_AUTH', productRefId: '123', firstHolderLink });
    await expect(getNSEHolderLinks('MANDATE_AUTH', '123')).rejects.toThrow('unsafe');
  }
});
