import type { AppDispatch } from '@/redux/store';
import { clearMembershipCheckout } from '@/redux/slices/membershipSlice';
import { PENDING_ORDER_KEY } from '@/constants/membership.constants';
import type {
  PaymentDetailsResponse,
  VerifyPaymentResponse,
} from '@/types/membership.types';

export const PAYMENT_RESULT_KEY = 'lendrix_payment_result';

export type PaymentOutcome = 'success' | 'failed' | 'cancelled' | 'pending';

export interface PaymentVerificationResult {
  outcome: PaymentOutcome;
  message: string;
  planName?: string;
  amount?: number | null;
  orderRef: string;
}

type VerifyPaymentFn = (orderId: string) => {
  unwrap: () => Promise<VerifyPaymentResponse>;
};

type FetchPaymentDetailsFn = (orderId: string) => {
  unwrap: () => Promise<PaymentDetailsResponse>;
};

const persistSuccess = (
  dispatch: AppDispatch,
  upgradeToPremium: () => void
) => {
  upgradeToPremium();
  localStorage.setItem('lendrix_premium_paid', 'true');
  localStorage.removeItem(PENDING_ORDER_KEY);
  dispatch(clearMembershipCheckout());
};

const isCancelledStatus = (status: string) =>
  ['CANCELLED', 'USER_DROPPED'].includes(status);

export const storePaymentResult = (result: PaymentVerificationResult) => {
  sessionStorage.setItem(PAYMENT_RESULT_KEY, JSON.stringify(result));
};

export const readStoredPaymentResult = (): PaymentVerificationResult | null => {
  try {
    const raw = sessionStorage.getItem(PAYMENT_RESULT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PaymentVerificationResult;
  } catch {
    return null;
  }
};

export const verifyPaymentOrder = async (
  orderId: string,
  verifyPayment: VerifyPaymentFn,
  fetchPaymentDetails: FetchPaymentDetailsFn,
  upgradeToPremium: () => void,
  dispatch: AppDispatch
): Promise<PaymentVerificationResult> => {
  if (!orderId) {
    return {
      outcome: 'failed',
      message: 'Payment order not found. Please try again from the plans page.',
      orderRef: '',
    };
  }

  try {
    const result = await verifyPayment(orderId).unwrap();
    if (result.order_status === 'PAID') {
      persistSuccess(dispatch, upgradeToPremium);
      return {
        outcome: 'success',
        message: result.message || 'Payment successful. Membership activated.',
        planName: result.plan_name || '',
        orderRef: orderId,
      };
    }

    return {
      outcome: 'failed',
      message: 'Payment was not completed successfully.',
      orderRef: orderId,
    };
  } catch (verifyError: unknown) {
    try {
      const details = await fetchPaymentDetails(orderId).unwrap();

      if (details.payment_status === 'SUCCESS') {
        const retry = await verifyPayment(orderId).unwrap();
        if (retry.order_status === 'PAID') {
          persistSuccess(dispatch, upgradeToPremium);
          return {
            outcome: 'success',
            message: retry.message || 'Payment successful. Membership activated.',
            planName: retry.plan_name || '',
            amount: details.amount,
            orderRef: details.order_id,
          };
        }
      }

      if (isCancelledStatus(details.payment_status)) {
        return {
          outcome: 'cancelled',
          message: 'Payment was cancelled. You can try again anytime.',
          amount: details.amount,
          orderRef: details.order_id,
        };
      }

      if (details.payment_status === 'FAILED') {
        return {
          outcome: 'failed',
          message: 'Payment failed. Please try again or use a different payment method.',
          amount: details.amount,
          orderRef: details.order_id,
        };
      }

      return {
        outcome: 'pending',
        message: details.message || 'Payment is still being processed. Please wait a moment.',
        amount: details.amount,
        orderRef: details.order_id,
      };
    } catch {
      const errMsg =
        verifyError && typeof verifyError === 'object' && 'data' in verifyError
          ? String((verifyError as { data?: { message?: string } }).data?.message || '')
          : '';

      return {
        outcome: 'failed',
        message:
          errMsg ||
          'Unable to verify payment. Please contact support if amount was debited.',
        orderRef: orderId,
      };
    }
  }
};
