import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import NSENftUpdates from './NSENftUpdates';
import { NSE_TOKEN_KEY } from '../services/nseApi';
afterEach(() => { cleanup(); vi.unstubAllGlobals(); sessionStorage.clear(); });
const mock = (body: unknown, status = 200) => { sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token'); const fetcher = vi.fn().mockResolvedValue({ ok: status === 200, status, text: async () => JSON.stringify(body) }); vi.stubGlobal('fetch', fetcher); return fetcher; };
const fill = (label: string, value: string) => fireEvent.change(screen.getAllByLabelText(label)[0], { target: { value } });
const common = () => { fill('AMC master code', 'TST'); fill('Folio number', '000123'); fill('First holder PAN', 'AAAAA1234A'); fill('Digital authorization channel', 'E'); fill('First holder email', 'investor@example.test'); };
it.each([
  ['Bank accounts', 'Update bank accounts', 'Review bank update'],
  ['Contact details', 'Update contact details', 'Review contact update'],
  ['Dividend option', 'Change dividend option', 'Review dividend update'],
  ['Broker / adviser', 'Change broker or adviser', 'Review broker update'],
  ['Consolidate folios', 'Consolidate folios', 'Review folio consolidation'],
  ['Primary bank', 'Change primary bank', 'Review primary bank change'],
])('switches embedded %s to its own update fields', (button, heading, review) => {
  render(<NSENftUpdates embedded onClose={vi.fn()} />);
  expect(screen.getByLabelText('Nomination choice')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: button }));
  expect(screen.getByRole('heading', { name: heading, exact: true })).toBeInTheDocument();
  expect(screen.queryByLabelText('Nomination choice')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: review })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Nominees' }));
  expect(screen.getByLabelText('Nomination choice')).toBeInTheDocument();
});
it('offers nominee relationship and country descriptions with their documented values', () => {
  render(<NSENftUpdates onClose={vi.fn()} />);
  const relationship = screen.getByLabelText('Relationship code (numeric)');
  expect(within(relationship).getByRole('option', { name: 'SPOUSE (20)' })).toHaveValue('20');
  fireEvent.change(relationship, { target: { value: '06' } });
  expect(relationship).toHaveValue('06');
  expect(within(screen.getByLabelText('Country name')).getByRole('option', { name: 'INDIA' })).toHaveValue('INDIA');
});
it('reviews opt-out with masked PAN and submits once after consent', async () => {
  const fetcher = mock({ Status: 'Success', Message: 'Nominee request received' });
  render(<NSENftUpdates onClose={vi.fn()} />); common(); fill('Nomination choice', 'Y');
  fireEvent.click(screen.getByRole('button', { name: 'Review nominee update' }));
  expect(fetcher).not.toHaveBeenCalled();
  expect(screen.getByText('Ending 234A')).toBeInTheDocument();
  expect(screen.queryByDisplayValue('AAAAA1234A')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Confirm nominee update' })).toBeDisabled();
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Confirm nominee update' }));
  expect(await screen.findByText(/Nominee request received/)).toBeInTheDocument();
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(JSON.parse(fetcher.mock.calls[0][1].body).nft_nominee_registration_modification_details[0].NOM_OPT).toBe('Y');
  expect(screen.queryByRole('button', { name: 'Confirm nominee update' })).not.toBeInTheDocument();
});
it('masks the bank review and replaces HTML 404 content with a clear unavailable result', async () => {
  const fetcher = mock({ detail: '<html>404 Error Page</html>' }, 404);
  render(<NSENftUpdates onClose={vi.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: 'Bank accounts' })); common();
  for (const [label, value] of [['Account number', '000123456789'], ['Account holder name', 'Test holder'], ['IFSC', 'TEST0000123'], ['Account type master code', 'SB'], ['Bank name', 'Test bank'], ['Branch name', 'Test branch']]) fill(label, value);
  fireEvent.click(screen.getByRole('button', { name: 'Review bank update' }));
  expect(screen.getByText('Ending 6789')).toBeInTheDocument();
  expect(fetcher).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Confirm bank update' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('unavailable');
  expect(screen.getByRole('alert')).not.toHaveTextContent('<html>');
});
it('blocks shared contacts without declarations then sends the documented COC fields', async () => {
  const fetcher = mock({ Status: 'Success', Message: 'Contact request received' });
  render(<NSENftUpdates onClose={vi.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: 'Contact details' })); common();
  fill('Second holder email', 'investor@example.test');
  fireEvent.click(screen.getByRole('button', { name: 'Review contact update' }));
  expect(screen.getByRole('alert')).toHaveTextContent('each holder');
  fill('First holder email declaration', 'SE'); fill('Second holder email declaration', 'SP');
  fireEvent.click(screen.getByRole('button', { name: 'Review contact update' }));
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Confirm contact update' }));
  expect(await screen.findByText(/Contact request received/)).toBeInTheDocument();
  expect(JSON.parse(fetcher.mock.calls[0][1].body).nft_change_of_contact_details[0].J1_EMA_DEC).toBe('SP');
});
