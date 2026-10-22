import { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { PENDING_ORDER_KEY } from '@/constants/membership.constants';
import {
  readStoredPaymentResult,
  type PaymentVerificationResult,
} from './paymentVerification';

export const usePaymentResult = (
  expectedOutcome: PaymentVerificationResult['outcome']
): PaymentVerificationResult | null => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const stateResult = location.state as PaymentVerificationResult | null;
  const storedResult = readStoredPaymentResult();
  const result =
    stateResult?.outcome === expectedOutcome
      ? stateResult
      : storedResult?.outcome === expectedOutcome
        ? storedResult
        : null;

  const orderId =
    searchParams.get('order_id') || localStorage.getItem(PENDING_ORDER_KEY) || '';

  useEffect(() => {
    if (result) return;

    if (orderId) {
      navigate(`/dashboard/payment/status?order_id=${encodeURIComponent(orderId)}`, { replace: true });
      return;
    }

    navigate('/dashboard/premium-plans', { replace: true });
  }, [result, orderId, navigate]);

  return result;
};
