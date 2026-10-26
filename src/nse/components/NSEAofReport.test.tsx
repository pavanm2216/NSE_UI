import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSEAofReport from './NSEAofReport';
import { NSE_TOKEN_KEY } from '../services/nseApi';
afterEach(() => { cleanup(); vi.unstubAllGlobals(); sessionStorage.clear(); });
it('uses client-only filters and displays separate holder/RTA results with masked PAN', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ response_status: 'S', report_data: [{ client_code: 'TEST001', applicant_name: 'First holder', pan: 'ABCDE1234F', pan_type: 'F', cams_status: 'Uploaded - Ready to invest', kfin_status: 'PENDING', kfin_reason: 'Awaiting processing' }] }) });
  vi.stubGlobal('fetch', fetcher);
  render(<NSEAofReport onClose={() => {}} />);
  fireEvent.change(screen.getByLabelText('Client codes for AOF'), { target: { value: 'TEST001' } });
  fireEvent.click(screen.getByRole('button', { name: 'Load AOF report' }));
  expect(await screen.findByRole('heading', { name: 'First holder' })).toBeInTheDocument();
  expect(screen.getByText('Status: Uploaded - Ready to invest')).toBeInTheDocument();
  expect(screen.getByText('Reason: Awaiting processing')).toBeInTheDocument();
  expect(fetcher).toHaveBeenCalledWith('/nse-api/reports/aof-image-upload', expect.objectContaining({ body: JSON.stringify({ client_code: 'TEST001' }) }));
  expect(screen.queryByText('ABCDE1234F')).not.toBeInTheDocument();
});
