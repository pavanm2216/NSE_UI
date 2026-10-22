import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSESipTopups from './NSESipTopups';
import { nseApi } from '@/services/nseApi';
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it('maps documented top-up fields and parent registration', async () => {
  vi.spyOn(nseApi, 'sipTopups').mockResolvedValue({ response_status: 'S', report_data: [{ scheme_name: 'Test fund', reg_no: '61377', principle_sip_reg_no: '123', sip_xsip_amount: '10000', top_up_amount: '500', top_up_frequency: 'ANNUALLY', top_up_status: 'ACTIVE', date_of_activation: '03-Mar-2025', last_child_sip_reg_no: '456' }] });
  render(<NSESipTopups />);
  expect(await screen.findByText('Test fund')).toBeInTheDocument();
  expect(screen.getByText('61377')).toBeInTheDocument();
  expect(screen.getByText('123')).toBeInTheDocument();
  expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  expect(screen.getByText('ANNUALLY')).toBeInTheDocument();
});
it('filters by parent SIP and shows genuine empty results', async () => {
  const api = vi.spyOn(nseApi, 'sipTopups').mockResolvedValue({ response_status: 'S', report_data: [] });
  render(<NSESipTopups />);
  await screen.findByRole('status');
  fireEvent.change(screen.getByLabelText('SIP IDs for top-ups'), { target: { value: '123' } });
  fireEvent.click(screen.getByRole('button', { name: 'Load top-ups' }));
  expect(await screen.findByRole('status')).toHaveTextContent('Mutual funds returned no top-ups');
  expect(api).toHaveBeenLastCalledWith({ parent_sip_reg_id: '123' });
});
it('shows failures separately from empty results', async () => {
  vi.spyOn(nseApi, 'sipTopups').mockResolvedValue({ response_status: 'F', report_data: [], error_remark: 'Invalid parent ID' });
  render(<NSESipTopups />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Invalid parent ID');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});
