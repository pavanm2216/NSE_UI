import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVerifyPaymentMutation, useLazyGetPaymentDetailsQuery } from '@/redux/services/membershipApi';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/redux/hooks';
import { PENDING_ORDER_KEY } from '@/constants/membership.constants';
import {
  storePaymentResult,
  verifyPaymentOrder,
  type PaymentVerificationResult,
} from './paymentVerification';
import PaymentResultLayout from './PaymentResultLayout';

const outcomePath = (outcome: PaymentVerificationResult['outcome']) => {
  if (outcome === 'cancelled') return '/dashboard/payment/cancel';
  if (outcome === 'success') return '/dashboard/payment/success';
  if (outcome === 'failed') return '/dashboard/payment/failed';
  return null;
};

const PaymentStatusPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { upgradeToPremium } = useAuth();
  const orderId =
    searchParams.get('order_id') || localStorage.getItem(PENDING_ORDER_KEY) || '';

  const [message, setMessage] = useState('Verifying your payment...');
  const [isPending, setIsPending] = useState(false);
  const [verifyPayment] = useVerifyPaymentMutation();
  const [fetchPaymentDetails] = useLazyGetPaymentDetailsQuery();

  const runVerification = useCallback(async () => {
    setIsPending(false);
    setMessage('Verifying your payment...');

    const result = await verifyPaymentOrder(
      orderId,
      verifyPayment,
      fetchPaymentDetails,
      upgradeToPremium,
      dispatch
    );

    const path = outcomePath(result.outcome);
    if (path) {
      storePaymentResult(result);
      const query = result.orderRef
        ? `?order_id=${encodeURIComponent(result.orderRef)}`
        : '';
      navigate(`${path}${query}`, { replace: true, state: result });
      return;
    }

    setIsPending(true);
    setMessage(result.message);
  }, [orderId, verifyPayment, fetchPaymentDetails, upgradeToPremium, dispatch, navigate]);

  useEffect(() => {
    runVerification();
  }, [runVerification]);

  return (
    <PaymentResultLayout>
      <Loader2
        className={`w-16 h-16 mx-auto animate-spin ${isPending ? 'text-amber-500' : 'text-[#2d6be4]'}`}
      />
      <div>
        <h2 className="text-xl font-bold">
          {isPending ? 'Payment Pending' : 'Verifying Payment'}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">{message}</p>
      </div>
      {isPending && (
        <Button onClick={runVerification}>Refresh Status</Button>
      )}
    </PaymentResultLayout>
  );
};

export default PaymentStatusPage;
