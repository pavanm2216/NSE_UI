import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import NSESipMandateSelector from './NSESipMandateSelector';
import { nseApi } from '@/services/nseApi';
import type { NSEInvestorSelection } from '@/services/nseInvestorService';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const investor: NSEInvestorSelection = { clientCode: 'PK2216', name: 'Investor', kycType: 'KYC', bank: { id: 'bank1', label: 'Bank •••• 1782', active: true, status: 'ACTIVE', isDefault: true } };
it('fetches only the selected client and excludes foreign, pending and insufficient mandates from selection', async () => {
  const report = vi.spyOn(nseApi, 'mandateStatus').mockResolvedValue({ response_status: 'S', report_data: [
    { clientCode: 'OTHER', mandateId: '111', status: 'APPROVED', amount: '5000' },
    { clientCode: 'PK2216', mandateId: '222', status: 'PENDING', amount: '5000' },
    { clientCode: 'PK2216', mandateId: '333', status: 'APPROVED', amount: '100' },
    { clientCode: 'PK2216', mandateId: '444', status: 'APPROVED', amount: '5000' },
  ] });
  const change = vi.fn();
  render(<NSESipMandateSelector investor={investor} amount={1000} onChange={change} />);
  expect(await screen.findByRole('option', { name: /444/ })).toBeEnabled();
  expect(report).toHaveBeenCalledWith({ client_code: 'PK2216' });
  expect(screen.queryByRole('option', { name: /111/ })).not.toBeInTheDocument();
  expect(screen.getByRole('option', { name: /222/ })).toBeDisabled();
  expect(screen.getByRole('option', { name: /333/ })).toBeDisabled();
  fireEvent.change(screen.getByLabelText('Approved SIP mandate'), { target: { value: '444' } });
  expect(change).toHaveBeenLastCalledWith('444');
});
it('offers registration prefilled with the SIP investor and bank when no mandates exist', async () => {
  vi.spyOn(nseApi, 'mandateStatus').mockResolvedValue({ response_status: 'S', report_data: [] });
  render(<NSESipMandateSelector investor={investor} amount={1000} onChange={vi.fn()} />);
  expect(await screen.findByText(/No mandates found/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Register mandate' }));
  expect(await screen.findByText('Investor · PK2216')).toBeInTheDocument();
  expect(screen.getByText('Bank •••• 1782')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: "Find Mutual funds investors" })).not.toBeInTheDocument();
});
it('ignores an outdated response after the client changes', async () => {
  let finish!: (value: { response_status: string; report_data: unknown[] }) => void;
  vi.spyOn(nseApi, 'mandateStatus').mockImplementationOnce(() => new Promise(resolve => { finish = resolve; })).mockResolvedValueOnce({ response_status: 'S', report_data: [] });
  const { rerender } = render(<NSESipMandateSelector investor={investor} amount={1000} onChange={vi.fn()} />);
  rerender(<NSESipMandateSelector investor={{ ...investor, clientCode: 'NEXT' }} amount={1000} onChange={vi.fn()} />);
  await screen.findByText(/No mandates found/);
  finish({ response_status: 'S', report_data: [{ clientCode: 'PK2216', mandateId: '444', status: 'APPROVED', amount: 5000 }] });
  await waitFor(() => expect(screen.queryByRole('option', { name: /444/ })).not.toBeInTheDocument());
});
