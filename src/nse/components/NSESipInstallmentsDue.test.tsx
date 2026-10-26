import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSESipInstallmentsDue from './NSESipInstallmentsDue';
import { nseApi } from '@/services/nseApi';
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it('loads a future date range and maps due and previous payment fields', async () => {
  const api = vi.spyOn(nseApi, 'sipInstallmentsDue').mockResolvedValue({ response_status: 'S', report_data: [{ scheme_name: 'Test fund', sip_reg_number: '123', installment_amt: '1000', due_date: '22 OCT 2026', prev_paid_date: '22 SEP 2026', no_of_installments_paid: '1', total_installment_amt_paid: '1000' }] });
  render(<NSESipInstallmentsDue />);
  expect(await screen.findByText('Test fund')).toBeInTheDocument();
  expect(screen.getByText('Due: 22 OCT 2026')).toBeInTheDocument();
  expect(screen.getByText('22 SEP 2026')).toBeInTheDocument();
  expect(api).toHaveBeenCalledWith({ from_date: expect.stringMatching(/^\d{2}-\d{2}-\d{4}$/), to_date: expect.stringMatching(/^\d{2}-\d{2}-\d{4}$/) });
});
it('clears stale results and supports client-only searches', async () => {
  const api = vi.spyOn(nseApi, 'sipInstallmentsDue').mockResolvedValueOnce({ response_status: 'S', report_data: [{ scheme_name: 'Old fund' }] }).mockResolvedValueOnce({ response_status: 'S', report_data: [], error_remark: 'No record(s) found.' });
  render(<NSESipInstallmentsDue />);
  await screen.findByText('Old fund');
  fireEvent.change(screen.getByLabelText('Client codes for installments'), { target: { value: 'TEST' } });
  expect(screen.queryByText('Old fund')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Load upcoming installments' }));
  expect(await screen.findByRole('status')).toHaveTextContent('Mutual funds returned no installments');
  expect(api).toHaveBeenLastCalledWith({ client_code: 'TEST' });
});
it('keeps failed reports distinct from empty results', async () => {
  vi.spyOn(nseApi, 'sipInstallmentsDue').mockResolvedValue({ response_status: 'F', report_data: [], error_remark: 'Invalid SIP ID' });
  render(<NSESipInstallmentsDue />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Invalid SIP ID');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});
