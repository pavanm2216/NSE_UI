import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSEClientAuthorization from './NSEClientAuthorization';
import { NSE_TOKEN_KEY } from '../services/nseApi';
afterEach(() => { cleanup(); vi.unstubAllGlobals(); sessionStorage.clear(); });
it('treats a successful empty report with a remark as no records', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ response_status: 'S', report_data: [], error_remark: 'No record(s) found.' }) }));
  render(<NSEClientAuthorization onClose={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Check investor authorization' }));
  expect(await screen.findByRole('status')).toHaveTextContent('no authorization records');
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
