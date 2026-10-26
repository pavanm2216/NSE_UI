import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSETransactionReport from './NSETransactionReport';
import { NSE_TOKEN_KEY } from '@/services/nseApi';
afterEach(() => { cleanup(); vi.unstubAllGlobals(); sessionStorage.clear(); });
it('preserves amount/units text, payment-pending remarks and masks account/PAN', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ response_status: 'S', report_data: [{ product_id: '123', scheme_name_from: 'Test fund', amount_units: '5040.00(A)', order_status: 'VALID', order_remark: 'PAYMENT CONFIRMATION PENDING', payment_account_no: '000011112222', primary_holder_pan: 'ABCDE1234F' }] }) }));
  render(<NSETransactionReport />);
  fireEvent.click(screen.getByText('Transaction details'));
  fireEvent.click(screen.getByRole('button', { name: 'Load transaction details' }));
  expect(await screen.findByText('5040.00(A)')).toBeInTheDocument();
  expect(screen.getByText('PAYMENT CONFIRMATION PENDING')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Authorization, payment and other details'));
  expect(screen.getByText('•••• 2222')).toBeInTheDocument();
  expect(screen.queryByText('ABCDE1234F')).not.toBeInTheDocument();
});
