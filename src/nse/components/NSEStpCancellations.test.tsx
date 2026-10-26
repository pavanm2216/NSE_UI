import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import NSEStpCancellations from './NSEStpCancellations';
import { nseApi } from '../services/nseApi';
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it('maps cancellation date, actor, funds and units without inventing a status code', async () => {
  vi.spyOn(nseApi, 'stpCancellations').mockResolvedValue({ response_status: 'S', report_data: [{ stp_registration_no: '123', from_scheme_name: 'Source fund', to_scheme_name: 'Target fund', transfer_amount: '0', transfer_units: '10', stp_cancellation_date: '02 AUG 2023', stp_cancelled_by: 'ADMIN', frequency: 'MONTHLY' }] });
  render(<NSEStpCancellations />);
  expect(await screen.findByText('10 units')).toBeInTheDocument();
  expect(screen.getByText('Target fund')).toBeInTheDocument();
  expect(screen.getByText('Cancelled on: 02 AUG 2023')).toBeInTheDocument();
  expect(screen.getByText('ADMIN')).toBeInTheDocument();
  expect(screen.queryByText('CXL')).not.toBeInTheDocument();
});
it('shows report failures rather than no cancellations', async () => {
  vi.spyOn(nseApi, 'stpCancellations').mockResolvedValue({ response_status: 'F', report_data: [], error_remark: 'Invalid ID' });
  render(<NSEStpCancellations />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Invalid ID');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});
