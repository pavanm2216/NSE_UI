import { useState, useCallback } from 'react';
import {
  getExchangePaymentGateway,
  getPaymentInfoData,
  initiateUPIPayment,
  initiateNetBankingPayment,
  initiateMandatePayment,
  type PaymentMethod,
  type RequestMethod,
  type MemDetails,
  type ExchPgResponse,
} from '@/services/starmf/paymentGatewayService';

interface UsePaymentGatewayState {
  loading: boolean;
  error: string | null;
  data: ExchPgResponse | null;
}

export function usePaymentGateway() {
  const [state, setState] = useState<UsePaymentGatewayState>({
    loading: false,
    error: null,
    data: null,
  });

  const initiatePayment = useCallback(
    async (
      ucc: string,
      orderIds: number[],
      paymentMethods?: PaymentMethod[],
      memDetails?: MemDetails,
      redirectionUrl?: string,
      requestMethod?: RequestMethod
    ) => {
      setState({ loading: true, error: null, data: null });
      try {
        const response = await getExchangePaymentGateway(
          ucc,
          orderIds,
          paymentMethods,
          memDetails,
          redirectionUrl,
          requestMethod
        );
        setState({ loading: false, error: null, data: response });
        return response;
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Payment failed';
        setState({ loading: false, error, data: null });
        throw err;
      }
    },
    []
  );

  const getPaymentInfo = useCallback(
    async (
      ucc: string,
      orderIds: number[],
      paymentMethods?: PaymentMethod[],
      memDetails?: MemDetails,
      redirectionUrl?: string
    ) => {
      setState({ loading: true, error: null, data: null });
      try {
        const response = await getPaymentInfoData(
          ucc,
          orderIds,
          paymentMethods,
          memDetails,
          redirectionUrl
        );
        setState({ loading: false, error: null, data: response });
        return response;
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to get payment info';
        setState({ loading: false, error, data: null });
        throw err;
      }
    },
    []
  );

  const initiateUPI = useCallback(
    async (
      ucc: string,
      orderIds: number[],
      memDetails?: MemDetails,
      redirectionUrl?: string
    ) => {
      setState({ loading: true, error: null, data: null });
      try {
        const response = await initiateUPIPayment(
          ucc,
          orderIds,
          memDetails,
          redirectionUrl
        );
        setState({ loading: false, error: null, data: response });
        return response;
      } catch (err) {
        const error = err instanceof Error ? err.message : 'UPI payment failed';
        setState({ loading: false, error, data: null });
        throw err;
      }
    },
    []
  );

  const initiateNetBanking = useCallback(
    async (
      ucc: string,
      orderIds: number[],
      memDetails?: MemDetails,
      redirectionUrl?: string
    ) => {
      setState({ loading: true, error: null, data: null });
      try {
        const response = await initiateNetBankingPayment(
          ucc,
          orderIds,
          memDetails,
          redirectionUrl
        );
        setState({ loading: false, error: null, data: response });
        return response;
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Net Banking payment failed';
        setState({ loading: false, error, data: null });
        throw err;
      }
    },
    []
  );

  const initiateMandate = useCallback(
    async (
      ucc: string,
      orderIds: number[],
      memDetails?: MemDetails,
      redirectionUrl?: string
    ) => {
      setState({ loading: true, error: null, data: null });
      try {
        const response = await initiateMandatePayment(
          ucc,
          orderIds,
          memDetails,
          redirectionUrl
        );
        setState({ loading: false, error: null, data: response });
        return response;
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Mandate payment failed';
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
    initiatePayment,
    getPaymentInfo,
    initiateUPI,
    initiateNetBanking,
    initiateMandate,
    reset,
  };
}
