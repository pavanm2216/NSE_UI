import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSEXsipCancellations from './NSEXsipCancellations';
import { nseApi } from '@/services/nseApi';
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it('maps the documented cancellation fields and reason without submitting a cancellation', async () => {
  const api = vi.spyOn(nseApi, 'xsipCancellations').mockResolvedValue({ response_status: 'S', report_data: [{ scheme_name: 'Test fund', xsip_registration_no: '123', xsip_cancellation_date: '03/10/2025 09:00:05 PM', status: 'CXL', nse_mandate_id: '456', installments_amt: '1000', remark: 'Three consecutive invalid installments' }] });
  render(<NSEXsipCancellations />);
  expect(await screen.findByText('Test fund')).toBeInTheDocument();
  expect(screen.getByText('Cancelled (CXL)')).toBeInTheDocument();
  expect(screen.getByText('456')).toBeInTheDocument();
  expect(screen.getByText('Three consecutive invalid installments')).toBeInTheDocument();
  expect(screen.getByText('Cancelled on: 03/10/2025 09:00:05 PM')).toBeInTheDocument();
  expect(api).toHaveBeenCalledWith({ from_date: expect.stringMatching(/^\d{2}-\d{2}-\d{4}$/), to_date: expect.stringMatching(/^\d{2}-\d{2}-\d{4}$/) });
});
it('filters by client code and clears stale results', async () => {
  const api = vi.spyOn(nseApi, 'xsipCancellations').mockResolvedValueOnce({ response_status: 'S', report_data: [{ scheme_name: 'Old fund' }] }).mockResolvedValueOnce({ response_status: 'S', report_data: [] });
  render(<NSEXsipCancellations />);
  await screen.findByText('Old fund');
  fireEvent.change(screen.getByLabelText('Client codes for cancellations'), { target: { value: 'TEST' } });
  expect(screen.queryByText('Old fund')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Load cancellations' }));
  expect(await screen.findByRole('status')).toHaveTextContent('Mutual funds returned no cancellations');
  expect(api).toHaveBeenLastCalledWith({ client_code: 'TEST' });
});
it('does not present report failures as no cancellations', async () => {
  vi.spyOn(nseApi, 'xsipCancellations').mockResolvedValue({ response_status: 'F', report_data: [], error_remark: 'Invalid ID' });
  render(<NSEXsipCancellations />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Invalid ID');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});
