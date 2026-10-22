import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import NSEStpInstallmentsDue from './NSEStpInstallmentsDue';
import { nseApi } from '@/services/nseApi';
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it('fetches from the selected STP and maps documented transfer fields', async () => {
  const api = vi.spyOn(nseApi, 'stpInstallmentsDue').mockResolvedValue({ response_status: 'S', report_data: [{ stp_registration_no: '123', from_scheme_name: 'Source fund', to_scheme_name: 'Destination fund', transfer_amount: '0', transfer_units: '333', due_date: '05 APR 2025', prev_transfer_date: '05 MAR 2025', no_of_transfer_completed: '10', dp_trans: 'P' }] });
  render(<NSEStpInstallmentsDue plan={{ id: '123', name: 'Source fund' }} />);
  expect(await screen.findByText('333 units')).toBeInTheDocument();
  expect(screen.getByText('Destination fund', { selector: 'dd' })).toBeInTheDocument();
  expect(screen.getByText('05 MAR 2025')).toBeInTheDocument();
  expect(api).toHaveBeenCalledWith({ stp_reg_id: '123' });
});
it('does not claim empty results on an API failure', async () => {
  vi.spyOn(nseApi, 'stpInstallmentsDue').mockResolvedValue({ response_status: 'F', report_data: [], error_remark: 'Invalid STP ID' });
  render(<NSEStpInstallmentsDue />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Invalid STP ID');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});
