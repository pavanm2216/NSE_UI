import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSENftUpdates from './NSENftUpdates';
import { NSE_TOKEN_KEY } from '@/services/nseApi';
afterEach(() => { cleanup(); vi.unstubAllGlobals(); sessionStorage.clear(); });
const fill = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
const common = () => { fill('AMC master code', 'TST'); fill('Folio number', '000123'); fill('First holder PAN', 'AAAAA1234A'); fill('Digital authorization channel', 'E'); fill('First holder email', 'investor@example.test'); };
it('reviews source and target folios separately and submits consolidation once with consent', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ Status: 'Success', Message: 'Consolidation request received' }) }); vi.stubGlobal('fetch', fetcher);
  render(<NSENftUpdates onClose={vi.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: 'Consolidate folios' })); common(); fill('Source folios (comma-separated)', '000456,000789');
  fireEvent.click(screen.getByRole('button', { name: 'Review folio consolidation' }));
  expect(screen.getByText('Ending 0456, Ending 0789')).toBeInTheDocument();
  expect(screen.getByText('Ending 0123')).toBeInTheDocument();
  expect(fetcher).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Confirm folio consolidation' })).toBeDisabled();
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Confirm folio consolidation' }));
  expect(await screen.findByText(/Consolidation request received/)).toBeInTheDocument();
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(JSON.parse(fetcher.mock.calls[0][1].body).nft_consolidation_folio_details[0].SRC_FOLIO).toBe('000456,000789');
});
it('shows only fields relevant to the selected broker/adviser type', () => {
  render(<NSENftUpdates onClose={vi.fn()} />); fireEvent.click(screen.getByRole('button', { name: 'Broker / adviser' })); common();
  fill('Update broker or adviser', 'RIA'); expect(screen.getByLabelText('RIA code')).toBeInTheDocument(); expect(screen.queryByLabelText('Broker code')).not.toBeInTheDocument();
  fill('Update broker or adviser', 'ARN'); expect(screen.getByLabelText('Broker code')).toBeInTheDocument(); expect(screen.queryByLabelText('RIA code')).not.toBeInTheDocument();
});
it('shows a clear dividend 404 result without displaying backend HTML', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404, text: async () => JSON.stringify({ detail: '<html>404 Error Page</html>' }) }));
  render(<NSENftUpdates onClose={vi.fn()} />); fireEvent.click(screen.getByRole('button', { name: 'Dividend option' })); common(); fill('RTA scheme and plan code', 'TESTSCH'); fill('Reinvestment option code', 'Y');
  fireEvent.click(screen.getByRole('button', { name: 'Review dividend update' })); fireEvent.click(screen.getByRole('checkbox')); fireEvent.click(screen.getByRole('button', { name: 'Confirm dividend update' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('unavailable'); expect(screen.getByRole('alert')).not.toHaveTextContent('<html>');
});
