import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSERedemptionStatements from './NSERedemptionStatements';
import { nseApi } from '@/services/nseApi';
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it('loads actual statement fields and makes no bank payout claim', async () => {
  const api = vi.spyOn(nseApi, 'redemptions').mockResolvedValue({ response_status: 'S', report_data: [{ orderno: '123', clientcode: 'TEST', schemecode: 'TEST-GR', scheme_name: 'Test fund', qty: '100', allottedqty: '5000', allottednav: '10', allottedamt: '50000', validflag: 'Y', load_amount: '0', tax_amount: '0' }] });
  render(<NSERedemptionStatements />);
  expect(api).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Refresh redemptions' }));
  expect(await screen.findByText('Test fund')).toBeInTheDocument();
  expect(screen.getByText('Valid statement')).toBeInTheDocument();
  expect(screen.getByText(/Statement validity does not confirm bank payout/)).toBeInTheDocument();
});
