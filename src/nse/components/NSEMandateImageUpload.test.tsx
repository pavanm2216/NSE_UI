import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NSEMandateImageUpload from './NSEMandateImageUpload';
import * as service from '../services/nseMandateImageService';
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it('uploads only after selection and click, then shows confirmation without approval', async () => {
  const upload = vi.spyOn(service, 'uploadNSEMandateImage').mockResolvedValue('Mandate Uploaded Successfully.');
  render(<NSEMandateImageUpload clientCode="TEST001" mandateId="123" />);
  expect(screen.getByRole('button')).toBeDisabled();
  const file = new File(['test'], 'scan.jpg', { type: 'image/jpeg' });
  fireEvent.change(screen.getByLabelText('Signed mandate image'), { target: { files: [file] } });
  expect(upload).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button'));
  expect(await screen.findByRole('status')).toHaveTextContent('Image upload does not confirm bank approval');
  expect(upload).toHaveBeenCalledWith('TEST001', '123', file);
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});
it('shows a failed upload without marking it successful', async () => {
  vi.spyOn(service, 'uploadNSEMandateImage').mockRejectedValue(new Error('Image already uploaded.'));
  render(<NSEMandateImageUpload clientCode="TEST001" mandateId="123" />);
  fireEvent.change(screen.getByLabelText('Signed mandate image'), { target: { files: [new File(['test'], 'scan.jpg')] } });
  fireEvent.click(screen.getByRole('button'));
  expect(await screen.findByRole('alert')).toHaveTextContent('Image already uploaded.');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});
