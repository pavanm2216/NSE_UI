import { useState, useCallback } from 'react';
import {
  sendPaymentInfo,
  sendUPIPaymentInfo,
  sendNetBankingPaymentInfo,
  sendMandatePaymentInfo,
  type PaymentMode,
  type PaymentDetails,
  type SendPaymentInfoResponse,
} from '@/services/starmf/paymentInfoService';

interface UsePaymentInfoState {
  loading: boolean;
  error: string | null;
  data: SendPaymentInfoResponse | null;
}

export function usePaymentInfo() {
  const [state, setState] = useState<UsePaymentInfoState>({
    loading: false,
    error: null,
    data: null,
  });

  const submitPaymentInfo = useCallback(
    async (
      paymentMode: PaymentMode,
      orderIds: number[],
      ucc: string,
      member: string,
      amount: number,
      currency: string,
      redirectionUrl: string,
      paymentDetails: PaymentDetails
    ) => {
      setState({ loading: true, error: null, data: null });
      try {
        const response = await sendPaymentInfo(
          paymentMode,
          orderIds,
          ucc,
          member,
          amount,
          currency,
          redirectionUrl,
          paymentDetails
        );
        setState({ loading: false, error: null, data: response });
        return response;
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Payment info submission failed';
        setState({ loading: false, error, data: null });
        throw err;
      }
    },
    []
  );

  const submitUPIPaymentInfo = useCallback(
    async (
      orderIds: number[],
      ucc: string,
      member: string,
      amount: number,
      vpa: string,
      ifsc: string,
      redirectionUrl: string,
      bankId?: string,
      accountNumber?: string
    ) => {
      setState({ loading: true, error: null, data: null });
      try {
        const response = await sendUPIPaymentInfo(
          orderIds,
          ucc,
          member,
          amount,
          vpa,
          ifsc,
          redirectionUrl,
          bankId,
          accountNumber
        );
        setState({ loading: false, error: null, data: response });
        return response;
      } catch (err) {
        const error = err instanceof Error ? err.message : 'UPI payment info submission failed';
        setState({ loading: false, error, data: null });
        throw err;
      }
    },
    []
  );

  const submitNetBankingPaymentInfo = useCallback(
    async (
      orderIds: number[],
      ucc: string,
      member: string,
      amount: number,
      accountNumber: string,
      ifsc: string,
      redirectionUrl: string,
      bankId?: string
    ) => {
      setState({ loading: true, error: null, data: null });
      try {
        const response = await sendNetBankingPaymentInfo(
          orderIds,
          ucc,
          member,
          amount,
          accountNumber,
          ifsc,
          redirectionUrl,
          bankId
        );
        setState({ loading: false, error: null, data: response });
        return response;
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Net Banking payment info submission failed';
        setState({ loading: false, error, data: null });
        throw err;
      }
    },
    []
  );

  const submitMandatePaymentInfo = useCallback(
    async (
      orderIds: number[],
      ucc: string,
      member: string,
      amount: number,
      mandateId: number,
      ifsc: string,
      redirectionUrl: string,
      accountNumber?: string,
      bankId?: string
    ) => {
      setState({ loading: true, error: null, data: null });
      try {
        const response = await sendMandatePaymentInfo(
          orderIds,
          ucc,
          member,
          amount,
          mandateId,
          ifsc,
          redirectionUrl,
          accountNumber,
          bankId
        );
        setState({ loading: false, error: null, data: response });
        return response;
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Mandate payment info submission failed';
        setState({ loading: false, error, data: null });
        throw err;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: null });
  }, []);

  return {
    ...state,
    submitPaymentInfo,
    submitUPIPaymentInfo,
    submitNetBankingPaymentInfo,
    submitMandatePaymentInfo,
    reset,
  };
}
