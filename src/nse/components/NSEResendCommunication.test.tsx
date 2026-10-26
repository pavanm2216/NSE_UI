import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSEResendCommunication from './NSEResendCommunication';
import { NSE_TOKEN_KEY } from '../services/nseApi';
afterEach(() => { cleanup(); vi.unstubAllGlobals(); sessionStorage.clear(); });
function mockResponse(body: unknown) {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const request = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify(body) });
  vi.stubGlobal('fetch', request); return request;
}
it('sends on click only and prevents another send after confirmed success', async () => {
  const request = mockResponse({ productType: 'MANDATE_AUTH', productRefId: '123', response_status: 'S', error_remark: '' });
  render(<NSEResendCommunication productType="MANDATE_AUTH" productRefId="123" />);
  expect(request).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button'));
  expect(await screen.findByRole('status')).toHaveTextContent('does not confirm delivery or investor authorization');
  expect(screen.getByRole('button')).toBeDisabled();
  expect(request).toHaveBeenCalledWith('/nse-api/communication/resend', expect.objectContaining({ body: JSON.stringify({ productType: 'MANDATE_AUTH', productRefId: '123' }) }));
});
it.each([
  [{ response_status: null, error_remark: null }, 'did not confirm'],
  [{ response_status: 'F', error_remark: 'Invalid reference' }, 'Invalid reference'],
  [{ response_status: 'S', productType: 'SIP_REG', productRefId: '456' }, 'different product reference'],
])('does not claim success for an unconfirmed response', async (body, message) => {
  mockResponse(body);
  render(<NSEResendCommunication productType="SIP_REG" productRefId="123" />);
  fireEvent.click(screen.getByRole('button'));
  expect(await screen.findByRole('alert')).toHaveTextContent(message);
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});
it('rejects placeholder references without contacting Mutual funds', async () => {
  const request = mockResponse({});
  render(<NSEResendCommunication productType="SIP_STEPUP" productRefId="string" />);
  fireEvent.click(screen.getByRole('button'));
  expect(await screen.findByRole('alert')).toHaveTextContent('valid product reference');
  expect(request).not.toHaveBeenCalled();
});
