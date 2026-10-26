import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSECancelStp from './NSECancelStp';
import * as service from '../services/nseStpCancellationService';
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it('requires review and confirmation even when remarks are blank', async () => {
  const cancel = vi.spyOn(service, 'cancelNSEStp').mockResolvedValue('Mutual funds confirmed the STP cancellation');
  render(<NSECancelStp id="123" client="TEST001" source="Source" destination="Destination" onCancelled={vi.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: 'Cancel STP' }));
  fireEvent.click(screen.getByRole('button', { name: 'Review cancellation' }));
  expect(cancel).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Confirm STP cancellation' })).toBeDisabled();
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Confirm STP cancellation' }));
  expect(await screen.findByText(/Mutual funds confirmed the STP cancellation/)).toBeInTheDocument();
  expect(cancel).toHaveBeenCalledExactlyOnceWith('TEST001', '123', '');
});
