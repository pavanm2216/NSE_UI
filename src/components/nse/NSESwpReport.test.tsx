import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import NSESwpReport from './NSESwpReport';
import { nseApi } from '@/services/nseApi';
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it('maps documented withdrawal spellings and masks the payout account', async () => {
  vi.spyOn(nseApi, 'swpReport').mockResolvedValue({ response_status: 'S', report_data: [{ status: 'ACTIVE', swp_registration_no: '123', scheme_name: 'Test fund', amc: 'Test AMC', frequency_type: 'DAILY', withdrawl_amount: '0', withdrawal_units: '1', no_of_withdrawls: '1283', bank_account_no: '000011112222', transaction_mode: 'DEMAT' }] });
  render(<NSESwpReport />);
  expect(await screen.findByText('Test fund')).toBeInTheDocument();
  expect(screen.getByText('1 units')).toBeInTheDocument();
  expect(screen.getByText('1283')).toBeInTheDocument();
  expect(screen.getByText('•••• 2222')).toBeInTheDocument();
  expect(screen.queryByText('000011112222')).not.toBeInTheDocument();
});
it('keeps failed reports distinct from no records', async () => {
  vi.spyOn(nseApi, 'swpReport').mockResolvedValue({ response_status: 'F', report_data: [], error_remark: 'Invalid SWP ID' });
  render(<NSESwpReport />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Invalid SWP ID');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});
