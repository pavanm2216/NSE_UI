import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import NSEStpFlow from './NSEStpFlow';
import NSESwpFlow from './NSESwpFlow';

vi.mock('./NSEInvestorSelector', () => import('@/test/mockNSEInvestorSelector'));
afterEach(cleanup);
const scheme = { name: 'Source fund', code: 'SOURCE', amc: 'AMC' };
it('offers document STP transaction modes, purchase types and frequencies', () => {
  render(<NSEStpFlow scheme={scheme} targets={[]} onClose={vi.fn()} onRecord={vi.fn()} onTrack={vi.fn()} />);
  const modes = within(screen.getByLabelText('Transaction mode')).getAllByRole('option');
  expect(modes.map(option => (option as HTMLOptionElement).value)).toEqual(['P', 'C', 'N']);
  fireEvent.change(screen.getByLabelText('Buy / sell type'), { target: { value: 'FRESH' } });
  expect(screen.getByLabelText('Buy / sell type')).toHaveValue('FRESH');
  expect(within(screen.getByLabelText('Frequency')).getByRole('option', { name: 'SEMI-ANNUALLY' })).toBeInTheDocument();
  expect(screen.queryByRole('option', { name: 'FORTNIGHTLY' })).not.toBeInTheDocument();
});
it('uses only SWP frequencies and opens a withdrawal review without a destination scheme', () => {
  render(<NSESwpFlow scheme={scheme} onClose={vi.fn()} onRecord={vi.fn()} onTrack={vi.fn()} />);
  expect(within(screen.getByLabelText('Frequency')).getAllByRole('option').map(option => (option as HTMLOptionElement).value)).toEqual(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY']);
  fireEvent.change(screen.getByLabelText('Source folio'), { target: { value: 'FOLIO123' } });
  fireEvent.change(screen.getByLabelText('Start date'), { target: { value: '2099-10-15' } });
  fireEvent.change(screen.getByLabelText(/Withdrawal amount/), { target: { value: '1000' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText('EUIN declaration'), { target: { value: 'N' } });
  fireEvent.click(screen.getByRole('button', { name: 'Review SWP' }));
  expect(screen.getByRole('heading', { name: 'Review SWP registration' })).toBeInTheDocument();
  expect(screen.getByText('Withdrawal')).toBeInTheDocument();
  expect(screen.queryByText('Destination')).not.toBeInTheDocument();
});
