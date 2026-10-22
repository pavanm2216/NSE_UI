import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import NSESwpCancellations from './NSESwpCancellations';
import { nseApi, NSE_TOKEN_KEY } from '@/services/nseApi';
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); sessionStorage.clear(); });
it('maps documented cancellation and withdrawal fields without inventing a status', async () => {
  vi.spyOn(nseApi, 'swpCancellations').mockResolvedValue({ response_status: 'S', report_data: [{ swp_registration_no: '123', scheme_name: 'Test fund', amc: 'Test AMC', swp_cancellation_date: '01 Aug 2023 17:53:21', swp_cancelled_by: 'ADMIN', withdrawl_amount: '0', withdrawl_units: '10', no_of_withdrawls: '12', frequency_type: 'MONTHLY' }] });
  render(<NSESwpCancellations />);
  expect(await screen.findByText('10 units')).toBeInTheDocument();
  expect(screen.getByText('Cancelled on: 01 Aug 2023 17:53:21')).toBeInTheDocument();
  expect(screen.getByText('ADMIN')).toBeInTheDocument();
  expect(screen.queryByText('CXL')).not.toBeInTheDocument();
});
it('surfaces an expired token and clears the session without claiming no records', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401, text: async () => JSON.stringify({ detail: 'Invalid or expired token' }) }));
  render(<NSESwpCancellations />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Invalid or expired token');
  expect(sessionStorage.getItem(NSE_TOKEN_KEY)).toBeNull();
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});
