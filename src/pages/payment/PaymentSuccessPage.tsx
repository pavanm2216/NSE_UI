import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PaymentResultLayout from './PaymentResultLayout';
import { usePaymentResult } from './usePaymentResult';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const result = usePaymentResult('success');

  if (!result) return null;

  return (
    <PaymentResultLayout amount={result.amount}>
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>
      <div>
        <h2 className="text-2xl font-bold">Payment Successful</h2>
        <p className="text-muted-foreground text-sm mt-1">{result.message}</p>
      </div>
      {result.planName && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-2 justify-center">
            <Crown className="w-5 h-5 text-yellow-500" />
            <span className="font-bold text-yellow-700">{result.planName}</span>
          </div>
        </div>
      )}
      {result.orderRef && (
        <p className="text-xs text-muted-foreground font-mono">Order: {result.orderRef}</p>
      )}
      <Button
        className="w-full bg-gradient-to-r from-[#1E3A6D] to-[#2A938F] text-white"
        onClick={() => navigate('/dashboard')}
      >
        Go to Dashboard
      </Button>
    </PaymentResultLayout>
  );
};

export default PaymentSuccessPage;
