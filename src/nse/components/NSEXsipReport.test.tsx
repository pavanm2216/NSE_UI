import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSEXsipReport from './NSEXsipReport';
import { nseApi } from '../services/nseApi';
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it('shows the documented cancelled XSIP and mandate without authorization actions', async () => {
  vi.spyOn(nseApi, 'xsipReport').mockResolvedValue({ response_status: 'S', report_data: [{ status: 'CXL', xsip_registration_no: '123', xsip_registration_date: '13 MAR 2025', nse_mandate_id: '456', scheme_name: 'Cancelled test fund', installments_amount: '10000' }] });
  render(<NSEXsipReport />);
  expect(await screen.findByText('Cancelled (CXL)')).toBeInTheDocument();
  expect(screen.getByText('456')).toBeInTheDocument();
  expect(screen.getByText('13 MAR 2025')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Resend authorization/ })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Cancel SIP' })).not.toBeInTheDocument();
});
it('loads earlier registrations with documented dates and displays scheme and schedule', async () => {
  const api = vi.spyOn(nseApi, 'xsipReport').mockResolvedValue({ response_status: 'S', report_data: [{ status: 'ACTIVE', xsip_registration_no: '123', scheme_name: 'Test fund', installments_amount: '2000', frequency_type: 'MONTHLY', client_code: 'TEST', start_date: '28 APR 2025', end_date: '27 APR 2026', no_of_installments: '12' }] });
  render(<NSEXsipReport />);
  expect(await screen.findByText('Test fund')).toBeInTheDocument();
  expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  expect(screen.getByText('28 APR 2025')).toBeInTheDocument();
  expect(api).toHaveBeenCalledWith({ from_date: expect.stringMatching(/^\d{2}-\d{2}-\d{4}$/), to_date: expect.stringMatching(/^\d{2}-\d{2}-\d{4}$/) });
});
it('clears stale rows and filters by IDs without dates', async () => {
  const api = vi.spyOn(nseApi, 'xsipReport').mockResolvedValueOnce({ response_status: 'S', report_data: [{ scheme_name: 'Old fund' }] }).mockResolvedValueOnce({ response_status: 'S', report_data: [], error_remark: 'No record(s) found.' });
  render(<NSEXsipReport />);
  await screen.findByText('Old fund');
  fireEvent.change(screen.getByLabelText('XSIP registration IDs'), { target: { value: '123,456' } });
  expect(screen.queryByText('Old fund')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: "Load Mutual funds XSIPs" }));
  expect(await screen.findByText("Mutual funds returned no XSIP registrations for these filters.")).toBeInTheDocument();
  expect(api).toHaveBeenLastCalledWith({ xsip_reg_id: '123,456' });
});
it('shows backend failure instead of an empty report', async () => {
  vi.spyOn(nseApi, 'xsipReport').mockResolvedValue({ response_status: 'F', report_data: [], error_remark: 'Invalid filter' });
  render(<NSEXsipReport />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Invalid filter');
  expect(screen.queryByText("Mutual funds returned no XSIP registrations for these filters.")).not.toBeInTheDocument();
});
