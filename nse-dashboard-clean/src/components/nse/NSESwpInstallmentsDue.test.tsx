import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import NSESwpInstallmentsDue from './NSESwpInstallmentsDue';
import { nseApi } from '@/services/nseApi';
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it('fetches the selected SWP and maps units sold separately from the due withdrawal', async () => {
  const api = vi.spyOn(nseApi, 'swpInstallmentsDue').mockResolvedValue({ response_status: 'S', report_data: [{ swp_regn_no: '123', scheme_name: 'Test fund', installment_amt: '0', installment_units: '10', due_date: '01 APR 2025', unit_sold: '30', total_installment_amt_sold: '0', prev_paid_date: '03 MAR 2025', no_of_installments_paid: '3' }] });
  render(<NSESwpInstallmentsDue plan={{ id: '123', name: 'Test fund' }} />);
  expect(await screen.findByText('10 units')).toBeInTheDocument();
  expect(screen.getByText('30')).toBeInTheDocument();
  expect(screen.getByText('Due: 01 APR 2025')).toBeInTheDocument();
  expect(api).toHaveBeenCalledWith({ swp_reg_id: '123' });
});
it('shows backend failures instead of claiming no upcoming withdrawals', async () => {
  vi.spyOn(nseApi, 'swpInstallmentsDue').mockResolvedValue({ response_status: 'F', report_data: [], error_remark: 'Invalid SWP ID' });
  render(<NSESwpInstallmentsDue />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Invalid SWP ID');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});
