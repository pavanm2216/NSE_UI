import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSECancelSwp from './NSECancelSwp';
import NSECancelDailyXsip from './NSECancelDailyXsip';
import NSEStepups from './NSEStepups';
import { NSE_TOKEN_KEY } from '../services/nseApi';
afterEach(() => { cleanup(); vi.unstubAllGlobals(); sessionStorage.clear(); });
const mockFetch = (body: unknown) => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify(body) });
  vi.stubGlobal('fetch', fetcher); return fetcher;
};
it('requires review and consent for SWP and keeps null results unconfirmed', async () => {
  const fetcher = mockFetch({ reg_data: null }), confirmed = vi.fn();
  render(<NSECancelSwp id="123" client="TEST" scheme="Test scheme" onCancelled={confirmed} />);
  fireEvent.click(screen.getByRole('button', { name: 'Cancel SWP' }));
  fireEvent.click(screen.getByRole('button', { name: 'Review cancellation' }));
  expect(fetcher).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Confirm SWP cancellation' })).toBeDisabled();
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Confirm SWP cancellation' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('no matching');
  expect(confirmed).not.toHaveBeenCalled();
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('button', { name: 'Confirm SWP cancellation' })).not.toBeInTheDocument();
});
it('sends a daily XSIP cancellation date only after consent', async () => {
  const fetcher = mockFetch({ can_data: [{ client_code: 'TEST', xsip_reg_no: '123', xsip_cancel_date: '02/01/2099', can_status: 'CAN_SUCCESS' }] });
  render(<NSECancelDailyXsip sipId="123" clientCode="TEST" scheme="Test scheme" investor="Test investor" onCancelled={vi.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: 'Schedule daily XSIP cancellation' }));
  fireEvent.change(screen.getByLabelText('Cancellation effective date'), { target: { value: '2099-01-02' } });
  fireEvent.change(screen.getByLabelText('Cancellation reason'), { target: { value: '01' } });
  fireEvent.click(screen.getByRole('button', { name: 'Review cancellation' }));
  expect(fetcher).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Confirm daily XSIP cancellation' }));
  expect(await screen.findByText(/Mutual funds accepted cancellation effective 02\/01\/2099/)).toBeInTheDocument();
  expect(JSON.parse(fetcher.mock.calls[0][1].body).can_data[0].xsip_cancel_date).toBe('02/01/2099');
});
it('shows documented step-up fields for a selected plan', async () => {
  const fetcher = mockFetch({ response_status: 'S', report_data: [{ sip_xsip_regn_number: '123', sip_xsip_type: 'XSIP', scheme_name: 'Test scheme', stepup_amount: '500', stepup_frequency: 'ANNUAL', stepup_start__effective_date: '07 MAR 2025', stepup_enddate: '07 FEB 2027', status: 'ACTIVE' }] });
  render(<NSEStepups plan={{ id: '123', name: 'Test plan' }} />);
  expect(await screen.findByText('Effective from: 07 MAR 2025')).toBeInTheDocument();
  expect(screen.getByText('07 FEB 2027')).toBeInTheDocument();
  expect(screen.getByText('XSIP')).toBeInTheDocument();
  expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({ sip_reg_id: '123' });
});
