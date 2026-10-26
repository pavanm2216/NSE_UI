import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSEMandateAuthorization from './NSEMandateAuthorization';
import { nseApi } from '@/services/nseApi';
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it('fetches only on click and opens returned holder links without claiming approval', async () => {
  const api = vi.spyOn(nseApi, 'communicationLink').mockResolvedValue({ productType: 'MANDATE_AUTH', productRefId: '123', firstHolderLink: 'https://nseinvest.com/mf/test' });
  render(<NSEMandateAuthorization mandateId="123" />);
  expect(api).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Get authorization link' }));
  const link = await screen.findByRole('link', { name: /First holder: authorize mandate/ });
  expect(link).toHaveAttribute('href', 'https://nseinvest.com/mf/test');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  expect(screen.getByText(/Opening this link does not confirm approval/)).toBeInTheDocument();
});
it('shows Mutual funds errors without an authorization link', async () => {
  vi.spyOn(nseApi, 'communicationLink').mockResolvedValue({ errorMessage: 'Mandate not found' });
  render(<NSEMandateAuthorization mandateId="123" />);
  fireEvent.click(screen.getByRole('button', { name: 'Get authorization link' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Mandate not found');
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
});
