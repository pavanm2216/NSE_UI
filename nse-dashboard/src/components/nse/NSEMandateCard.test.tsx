import React from 'react';
import { afterEach, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import NSEMandateCard from './NSEMandateCard';
afterEach(cleanup);
it('maps the documented camelCase report without exposing a bank account', () => {
  render(<NSEMandateCard row={{ mandateId: '123', clientCode: 'TEST001', clientName: 'Test investor', bankName: 'Test bank', amount: '200000', status: 'APPROVED', bankAccountNumber: '000011112222', mandateCollectionType: 'ENACH', mandateType: 'X', approvedDate: '27/01/2024', umrnNo: 'TESTUMRN123', startDate: '25/01/2024', endDate: '31/12/2050' }} />);
  expect(screen.getByText('Approved')).toBeInTheDocument();
  expect(screen.getByText('ENACH')).toBeInTheDocument();
  expect(screen.getByText('•••• 2222')).toBeInTheDocument();
  expect(screen.queryByText('000011112222')).not.toBeInTheDocument();
  expect(screen.getByText('27/01/2024')).toBeInTheDocument();
  expect(screen.getByText('TESTUMRN123')).toBeInTheDocument();
  expect(screen.queryByText('Approval not confirmed')).not.toBeInTheDocument();
});
