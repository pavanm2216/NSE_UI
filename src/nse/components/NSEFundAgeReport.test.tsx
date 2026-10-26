import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSEFundAgeReport from './NSEFundAgeReport';
import { NSE_TOKEN_KEY } from '../services/nseApi';
afterEach(() => { cleanup(); vi.unstubAllGlobals(); sessionStorage.clear(); });
it('shows order and funds status independently with masked accounts', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ response_status: 'S', report_data: [{ orderno: '123456789012', orderstatus: 'payment_not_initiated', funds_received_status: 'C', accountno: '000009876543', dp_folio_no: 'IN0000012345678' }] }) });
  vi.stubGlobal('fetch', fetcher);
  render(<NSEFundAgeReport />);
  fireEvent.click(screen.getByText('Funds received by date and bank'));
  fireEvent.click(screen.getByRole('button', { name: 'Load age-wise funds report' }));
  expect(await screen.findByText('payment_not_initiated')).toBeInTheDocument();
  expect(screen.getByText('C')).toBeInTheDocument();
  expect(screen.getByText('Account ending 6543')).toBeInTheDocument();
  expect(screen.queryByText('IN0000012345678')).not.toBeInTheDocument();
  expect(JSON.parse(fetcher.mock.calls[0][1].body).settlement_type).toBe('all');
});
