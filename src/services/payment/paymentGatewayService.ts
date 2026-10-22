import axios from 'axios';

export interface PaymentInitRequest {
  orderId: number;
  amount: number;
  email: string;
  mobile: string;
  investorName: string;
}

export interface PaymentInitResponse {
  payment_ref_id: string;
  payment_url: string;
  gateway: 'UPI' | 'NETBANKING';
}

export interface PaymentVerifyResponse {
  status: 'success' | 'failed';
  message: string;
  payment_ref_id?: string;
}

/**
 * Initialize payment with the payment gateway
 * Supports UPI and Net Banking payment methods
 */
export async function initializePayment(
  request: PaymentInitRequest,
  gateway: 'UPI' | 'NETBANKING'
): Promise<PaymentInitResponse> {
  try {
    const { data } = await axios.post('/api/payment/initialize', {
      ...request,
      gateway,
      timestamp: new Date().toISOString(),
    });

    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to initialize payment'
    );
  }
}

/**
 * Verify payment status after gateway callback
 */
export async function verifyPayment(
  paymentRefId: string,
  orderId: number
): Promise<PaymentVerifyResponse> {
  try {
    const { data } = await axios.post('/api/payment/verify', {
      payment_ref_id: paymentRefId,
      order_id: orderId,
    });

    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to verify payment'
    );
  }
}

/**
 * Get payment status for an order
 */
export async function getPaymentStatus(
  orderId: number
): Promise<{ status: string; payment_ref_id?: string }> {
  try {
    const { data } = await axios.get(`/api/payment/status/${orderId}`);
    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to get payment status'
    );
  }
}

/**
 * Cancel a pending payment
 */
export async function cancelPayment(
  paymentRefId: string
): Promise<{ status: string; message: string }> {
  try {
    const { data } = await axios.post('/api/payment/cancel', {
      payment_ref_id: paymentRefId,
    });

    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to cancel payment'
    );
  }
}
