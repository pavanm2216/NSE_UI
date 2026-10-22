import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSEStpReport from './NSEStpReport';
import { nseApi } from '@/services/nseApi';
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it('maps source, destination, demat units and schedule without displaying zero as a transfer amount', async () => {
  vi.spyOn(nseApi, 'stpReport').mockResolvedValue({ response_status: 'S', report_data: [{ status: 'ACTIVE', stp_registration_no: '123', from_scheme_name: 'Source fund', to_scheme_name: 'Destination fund', transfer_amount: '0', transfer_units: '10', frequency_type: 'FORTNIGHTLY', trxn_mode: 'DEMAT', no_of_transfers: '60', stp_start_date: '31 MAR 2025', stp_end_date: '18 JUL 2027' }] });
  render(<NSEStpReport />);
  expect(await screen.findByText('Source fund')).toBeInTheDocument();
  expect(screen.getByText('Destination fund')).toBeInTheDocument();
  expect(screen.getByText('10 units')).toBeInTheDocument();
  expect(screen.getByText('DEMAT')).toBeInTheDocument();
  expect(screen.getByText('31 MAR 2025')).toBeInTheDocument();
});
it('uses the selected STP IDs and distinguishes an empty response', async () => {
  const api = vi.spyOn(nseApi, 'stpReport').mockResolvedValue({ response_status: 'S', report_data: [] });
  render(<NSEStpReport />); await screen.findByRole('status');
  fireEvent.change(screen.getByLabelText('STP registration IDs'), { target: { value: '123' } });
  fireEvent.click(screen.getByRole('button', { name: "Load Mutual funds STPs" }));
  expect(await screen.findByRole('status')).toHaveTextContent('no STP registrations');
  expect(api).toHaveBeenLastCalledWith({ stp_reg_id: '123' });
});
