import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSETwoFaReport from './NSETwoFaReport';
import { NSE_TOKEN_KEY } from '@/services/nseApi';
afterEach(() => { cleanup(); vi.unstubAllGlobals(); sessionStorage.clear(); });
it('uses lowercase product_type and shows independent holder authentication', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ response_status: 'S', report_data: [{ product_type: 'PUR', product_id: '123', primary_holder_name: 'First investor', primary_holder_authentication_status: 'SUCCESS', primary_holder_authentication_datetime: '28/12/2024 18:00:00', second_holder_name: 'Second investor', second_holder_authentication_status: 'PENDING' }] }) }); vi.stubGlobal('fetch', fetcher);
  render(<NSETwoFaReport />);
  fireEvent.click(screen.getByText('Holder authorization (2FA)'));
  fireEvent.change(screen.getByLabelText('2FA product'), { target: { value: 'PUR' } });
  fireEvent.change(screen.getByLabelText('Product / registration IDs'), { target: { value: '123' } });
  fireEvent.click(screen.getByRole('button', { name: 'Load holder authorization' }));
  expect(await screen.findByText('SUCCESS')).toBeInTheDocument();
  expect(screen.getByText('PENDING')).toBeInTheDocument();
  expect(JSON.parse(fetcher.mock.calls[0][1].body)).toHaveProperty('product_type', 'PUR');
  expect(screen.getByText(/Authentication success does not confirm payment/)).toBeInTheDocument();
});
