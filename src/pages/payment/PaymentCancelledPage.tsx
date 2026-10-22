import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PaymentResultLayout from './PaymentResultLayout';
import { usePaymentResult } from './usePaymentResult';

const PaymentCancelledPage: React.FC = () => {
  const navigate = useNavigate();
  const result = usePaymentResult('cancelled');

  if (!result) return null;

  return (
    <PaymentResultLayout amount={result.amount}>
      <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
        <Ban className="w-10 h-10 text-amber-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold">Payment Cancelled</h2>
        <p className="text-muted-foreground text-sm mt-1">{result.message}</p>
      </div>
      {result.orderRef && (
        <p className="text-xs text-muted-foreground font-mono">Order: {result.orderRef}</p>
      )}
      <div className="flex flex-col gap-2">
        <Button onClick={() => navigate('/dashboard/premium-checkout')}>Try Again</Button>
        <Button variant="outline" onClick={() => navigate('/dashboard/premium-plans')}>
          View Plans
        </Button>
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    </PaymentResultLayout>
  );
};

export default PaymentCancelledPage;
