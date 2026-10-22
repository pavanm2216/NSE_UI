import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSEFatcaReport from './NSEFatcaReport';
import { NSE_TOKEN_KEY } from '@/services/nseApi';
afterEach(() => { cleanup(); vi.unstubAllGlobals(); sessionStorage.clear(); });
it('shows independent RTA statuses and masks identity details', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ response_status: 'S', report_data: [{ inv_name: 'Test investor', pan_rp: 'ABCDE1234F', aadhaar_rp: '123456789012', camsuploadstatus: 'NOT UPLOADED', camsresponsestatus: 'PENDING', kfinuploadstatus: 'UPLOADED', kfinresponsestatus: 'REJECTED', kfinremarks: 'Check declaration' }] }) }));
  render(<NSEFatcaReport onClose={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Load FATCA report' }));
  expect(await screen.findByRole('heading', { name: 'Test investor' })).toBeInTheDocument();
  expect(screen.getByText('Response: REJECTED')).toBeInTheDocument();
  fireEvent.click(screen.getByText('FATCA record details'));
  expect(screen.getByText('•••• 9012')).toBeInTheDocument();
  expect(screen.queryByText('ABCDE1234F')).not.toBeInTheDocument();
});
