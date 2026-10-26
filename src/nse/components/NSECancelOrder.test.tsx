import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSECancelOrder from './NSECancelOrder';
import * as service from '@/services/nseOrderCancellationService';
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it('requires review and confirmation even when remarks are blank', async () => {
  const cancel = vi.spyOn(service, 'cancelNSEOrder').mockResolvedValue('Mutual funds confirmed the order cancellation');
  render(<NSECancelOrder id="123" client="TEST001" source="Source" onCancelled={vi.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: 'Cancel order' }));
  fireEvent.click(screen.getByRole('button', { name: 'Review cancellation' }));
  expect(cancel).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Confirm order cancellation' })).toBeDisabled();
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Confirm order cancellation' }));
  expect(await screen.findByText(/Mutual funds confirmed the order cancellation/)).toBeInTheDocument();
  expect(cancel).toHaveBeenCalledExactlyOnceWith('TEST001', '123', '');
});
