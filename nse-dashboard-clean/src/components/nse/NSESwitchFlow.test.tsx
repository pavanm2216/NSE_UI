import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSESwitchFlow from './NSESwitchFlow';
import { NSE_TOKEN_KEY } from '@/services/nseApi';

vi.mock('./NSEInvestorSelector', () => import('@/test/mockNSEInvestorSelector'));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); sessionStorage.clear(); });
const scheme = { name: 'Source fund', code: 'SOURCE', amc: 'AMC1' };
function show(record = vi.fn()) {
  render(<NSESwitchFlow scheme={scheme} targets={[scheme, { name: 'Target fund', code: 'TARGET', amc: 'AMC1' }, { name: 'Other AMC fund', code: 'OTHER', amc: 'AMC2' }]} onClose={vi.fn()} onRecord={record} onTrack={vi.fn()} />);
  fireEvent.change(screen.getByLabelText('Destination scheme'), { target: { value: 'TARGET' } });
  fireEvent.change(screen.getByLabelText('Source folio'), { target: { value: 'FOLIO123' } });
  fireEvent.change(screen.getByLabelText('EUIN declaration'), { target: { value: 'N' } });
}
it('fills physical mode, excludes source/other AMC targets and blocks inactive banks', () => {
  show();
  expect(screen.getByLabelText('Transaction mode')).toHaveValue('P');
  expect(screen.getByRole('option', { name: 'CDSL - units only' })).toBeDisabled();
  expect(screen.queryByRole('option', { name: /Other AMC fund/ })).not.toBeInTheDocument();
  expect(screen.queryByRole('option', { name: /Source fund/ })).not.toBeInTheDocument();
  expect(screen.getByLabelText('Source folio')).toHaveAttribute('maxlength', '15');
  expect(screen.getByLabelText('Remarks (optional)')).toHaveAttribute('maxlength', '200');
  fireEvent.change(screen.getByLabelText('Investor'), { target: { value: 'demo-kyc' } });
  expect(screen.getByRole('button', { name: 'Review switch' })).toBeDisabled();
  expect(screen.getByRole('status')).toHaveTextContent('active registered bank');
});
it('clears and disables amount/units for an all-units switch and requires consent before submission', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ transaction_details: [{ client_code: 'TESTCL001', from_scheme_code: 'SOURCE', to_scheme_code: 'TARGET', trxn_status: 'TRXN SUCCESS', trxn_so_order_id: '123', trxn_si_order_id: '456' }] }) }); vi.stubGlobal('fetch', fetcher);
  const record = vi.fn(); show(record);
  fireEvent.change(screen.getByLabelText(/Transfer amount/), { target: { value: '1000' } });
  fireEvent.click(screen.getByLabelText('Switch all units in the source folio'));
  expect(screen.getByLabelText(/Transfer amount/)).toBeDisabled();
  expect(screen.getByLabelText(/Transfer amount/)).toHaveValue('');
  expect(screen.getByLabelText('Transfer units')).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Review switch' }));
  expect(screen.getByText('All units')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Submit switch' })).toBeDisabled();
  expect(fetcher).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('checkbox', { name: 'I confirm this live switch order.' }));
  fireEvent.click(screen.getByRole('button', { name: 'Submit switch' }));
  expect(await screen.findByText(/Switch-out order: 123/)).toBeInTheDocument();
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(JSON.parse(fetcher.mock.calls[0][1].body).transaction_details[0]).toMatchObject({ demat_physical: 'P', all_units: 'Y', amount: '', units: '', folio_no: 'FOLIO123' });
  expect(record).toHaveBeenCalledWith(expect.objectContaining({ status: 'pending', exchangeOrderId: '123', switchInOrderId: '456', allUnits: true }));
});
it('rejects amount plus units and reviews the optional distributor details', () => {
  show();
  fireEvent.change(screen.getByLabelText(/Transfer amount/), { target: { value: '1000' } });
  fireEvent.change(screen.getByLabelText('Transfer units'), { target: { value: '10' } });
  fireEvent.click(screen.getByRole('button', { name: 'Review switch' }));
  expect(screen.getByRole('alert')).toHaveTextContent('either amount or units');
  fireEvent.change(screen.getByLabelText('Transfer units'), { target: { value: '' } });
  fireEvent.click(screen.getByText('Distributor details (optional)'));
  fireEvent.change(screen.getByLabelText('Sub-broker code (optional)'), { target: { value: '1234' } });
  fireEvent.click(screen.getByRole('button', { name: 'Review switch' }));
  expect(screen.getByRole('alert')).toHaveTextContent('start with ARN');
  fireEvent.change(screen.getByLabelText('Sub-broker code (optional)'), { target: { value: 'ARN-1234' } });
  fireEvent.change(screen.getByLabelText('Sub-broker ARN (optional)'), { target: { value: 'ARN-5678' } });
  fireEvent.click(screen.getByRole('button', { name: 'Review switch' }));
  expect(screen.getByRole('heading', { name: 'Review switch order' })).toBeInTheDocument();
  expect(screen.getByText('ARN-1234')).toBeInTheDocument();
  expect(screen.getByText('ARN-5678')).toBeInTheDocument();
});
