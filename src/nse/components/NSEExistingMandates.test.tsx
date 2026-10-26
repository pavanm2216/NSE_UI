import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSEExistingMandates from './NSEExistingMandates';
import { nseApi } from '../services/nseApi';
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
describe("Existing Mutual funds mandates", () => {
  it('waits for a client search and masks account numbers', async () => {
    const api = vi.spyOn(nseApi, 'mandateStatus').mockResolvedValue({ response_status: 'S', report_data: [{ mandate_id: '2026101510018', client_code: 'TEST001', account_no: '000011112222', mandate_status: 'PENDING' }] });
    render(<NSEExistingMandates />);
    fireEvent.change(screen.getByLabelText('Client codes'), { target: { value: 'TEST001' } });
    fireEvent.click(screen.getByRole('button', { name: "Load Mutual funds mandates" }));
    expect(await screen.findByRole('heading', { name: 'Mandate 2026101510018' })).toBeInTheDocument();
    expect(api).toHaveBeenCalledWith({ client_code: 'TEST001' });
    expect(screen.getByText('•••• 2222')).toBeInTheDocument();
    expect(screen.queryByText('000011112222')).not.toBeInTheDocument();
  });
  it('filters by client code and clears stale records before refetching', async () => {
    const api = vi.spyOn(nseApi, 'mandateStatus').mockResolvedValueOnce({ response_status: 'S', report_data: [{ mandate_id: '123' }] }).mockResolvedValueOnce({ response_status: 'S', report_data: [] });
    render(<NSEExistingMandates />);
    fireEvent.change(screen.getByLabelText('Client codes'), { target: { value: 'TEST001' } });
    fireEvent.click(screen.getByRole('button', { name: "Load Mutual funds mandates" }));
    await screen.findByRole('heading', { name: 'Mandate 123' });
    fireEvent.change(screen.getByLabelText('Client codes'), { target: { value: 'TEST002' } });
    expect(screen.queryByRole('heading', { name: 'Mandate 123' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: "Load Mutual funds mandates" }));
    expect(await screen.findByText('Mutual funds returned no mandates for these filters.')).toBeInTheDocument();
    expect(api).toHaveBeenLastCalledWith({ client_code: 'TEST002' });
  });
  it('refreshes a processing mandate and displays only the new approval result', async () => {
    const row = { mandate_id: '123', client_code: 'TEST001' };
    const api = vi.spyOn(nseApi, 'mandateStatus')
      .mockResolvedValueOnce({ response_status: 'S', report_data: [{ ...row, mandate_status: 'UNDER PROCESSING' }] })
      .mockResolvedValueOnce({ response_status: 'S', report_data: [{ ...row, mandate_status: 'APPROVED' }] });
    render(<NSEExistingMandates />);
    fireEvent.change(screen.getByLabelText('Client codes'), { target: { value: 'TEST001' } });
    fireEvent.click(screen.getByRole('button', { name: "Load Mutual funds mandates" }));
    await screen.findByText('Waiting for bank approval');
    expect(screen.getByText(/Last checked with Mutual funds:/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Refresh mandate status' }));
    expect(await screen.findByText('Approved')).toBeInTheDocument();
    expect(screen.queryByText('Waiting for bank approval')).not.toBeInTheDocument();
    expect(api).toHaveBeenCalledTimes(2);
  });
  it('shows report failures instead of claiming no mandates exist', async () => {
    vi.spyOn(nseApi, 'mandateStatus').mockResolvedValue({ response_status: 'F', report_data: [], error_remark: 'Client code required' });
    render(<NSEExistingMandates />);
    fireEvent.change(screen.getByLabelText('Client codes'), { target: { value: 'TEST001' } });
    fireEvent.click(screen.getByRole('button', { name: "Load Mutual funds mandates" }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Client code required');
    expect(screen.queryByText('Mutual funds returned no mandates for these filters.')).not.toBeInTheDocument();
  });
});
