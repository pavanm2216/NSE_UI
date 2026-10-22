import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSEClientDetail from './NSEClientDetail';
import { NSE_TOKEN_KEY } from '@/services/nseApi';
afterEach(() => { cleanup(); vi.unstubAllGlobals(); sessionStorage.clear(); });
it('shows UCC remediation and bank status without exposing account or PAN', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ response_status: 'S', report_data: [{ client_code: 'TEST001', primary_holder_name: 'Test investor', ucc_status: 'Inactive', ucc_remediation: 'FATCA Upload is pending', bank1_status: 'PENDING', bank1_account_no: '000011112222', primary_holder_pan: 'ABCDE1234F' }] }) });
  vi.stubGlobal('fetch', fetcher);
  render(<NSEClientDetail onClose={() => {}} />);
  expect(screen.getByLabelText('Profile date basis')).toHaveValue('MODIFIED_DATE');
  fireEvent.click(screen.getByRole('button', { name: 'Load investor profiles' }));
  expect(await screen.findByText(/Action required: FATCA Upload is pending/)).toBeInTheDocument();
  expect(fetcher).toHaveBeenCalledWith('/nse-api/reports/client-detail', expect.any(Object));
  fireEvent.click(screen.getByText('Full investor, document and bank details'));
  expect(screen.getByText('•••• 2222')).toBeInTheDocument();
  expect(screen.queryByText('ABCDE1234F')).not.toBeInTheDocument();
});
