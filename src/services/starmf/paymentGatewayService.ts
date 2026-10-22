import axios from 'axios';
import { getBSEToken } from '@/services/bseAuth';

const PAYMENT_GATEWAY_API = '/bse-api/get_exchpg_service';

export type PaymentMethod = 'upi' | 'netbanking' | 'mandate';
export type RequestMethod = 'exch_pg_page' | 'payment_info_data';

export interface MemDetails {
  euin?: string;
  euin_flag?: boolean;
  sub_br_code?: string;
  sub_br_arn?: string;
  partner_id?: string;
}

export interface Investor {
  ucc: string;
}

export interface ExchPgRequest {
  data: {
    mem_details: MemDetails;
    investor: Investor;
    order_ids: number[];
    requested_method: RequestMethod;
    payment_mode: PaymentMethod[];
    redirection_url: string;
  };
}

export interface ExchPgResponse {
  status: string;
  message?: string;
  payment_url?: string;
  payment_ref_id?: string;
  [key: string]: any;
}

/**
 * Get exchange payment gateway page/data
 * Initiates payment process with BSE StAR MF exchange
 */
export async function getExchangePaymentGateway(
  ucc: string,
  orderIds: number[],
  paymentMethods: PaymentMethod[] = ['upi', 'netbanking', 'mandate'],
  memDetails?: MemDetails,
  redirectionUrl: string = `${window.location.origin}/payment-callback`,
  requestMethod: RequestMethod = 'exch_pg_page'
): Promise<ExchPgResponse> {
  try {
    const payload: ExchPgRequest = {
      data: {
        mem_details: memDetails || {
          euin: '',
          euin_flag: false,
          sub_br_code: '',
          sub_br_arn: '',
          partner_id: '',
        },
        investor: {
          ucc,
        },
        order_ids: orderIds,
        requested_method: requestMethod,
        payment_mode: paymentMethods,
        redirection_url: redirectionUrl,
      },
    };

    const token = getBSEToken();
    if (!token) {
      throw new Error('BSE authentication required. Please login first.');
    }

    // Validate payload
    if (!payload.data.investor.ucc) {
      throw new Error('Invalid UCC - investor UCC is required');
    }
    if (!Array.isArray(payload.data.order_ids)) {
      throw new Error('Invalid order_ids - must be an array');
    }
    if (payload.data.order_ids.length === 0 && !payload.data.payment_mode.includes('mandate')) {
    }

    const response = await axios.post<ExchPgResponse>(
      PAYMENT_GATEWAY_API,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const raw = response.data as any;
    const normalized: ExchPgResponse = {
      ...raw,
      payment_url: raw.payment_url || raw.exch_pg_page_link || raw.data?.exch_pg_page_link || raw.data?.payment_url,
      payment_ref_id: raw.payment_ref_id || raw.data?.payment_ref_id,
    };
    return normalized;
  } catch (error: any) {
    const status = error?.response?.status;
    const errorData = error?.response?.data;
    const errorMessage = error instanceof Error ? error.message : 'Payment gateway request failed';
    
    throw new Error(errorMessage);
  }
}

/**
 * Get payment information data (alternative to payment page)
 */
export async function getPaymentInfoData(
  ucc: string,
  orderIds: number[],
  paymentMethods: PaymentMethod[] = ['upi', 'netbanking', 'mandate'],
  memDetails?: MemDetails,
  redirectionUrl: string = window.location.origin
): Promise<ExchPgResponse> {
  return getExchangePaymentGateway(
    ucc,
    orderIds,
    paymentMethods,
    memDetails,
    redirectionUrl,
    'payment_info_data'
  );
}

/**
 * Initiate payment with UPI only
 */
export async function initiateUPIPayment(
  ucc: string,
  orderIds: number[],
  memDetails?: MemDetails,
  redirectionUrl?: string
): Promise<ExchPgResponse> {
  return getExchangePaymentGateway(
    ucc,
    orderIds,
    ['upi'],
    memDetails,
    redirectionUrl
  );
}

/**
 * Initiate payment with Net Banking only
 */
export async function initiateNetBankingPayment(
  ucc: string,
  orderIds: number[],
  memDetails?: MemDetails,
  redirectionUrl?: string
): Promise<ExchPgResponse> {
  return getExchangePaymentGateway(
    ucc,
    orderIds,
    ['netbanking'],
    memDetails,
    redirectionUrl
  );
}

/**
 * Initiate payment with Mandate only
 */
export async function initiateMandatePayment(
  ucc: string,
  orderIds: number[],
  memDetails?: MemDetails,
  redirectionUrl?: string
): Promise<ExchPgResponse> {
  return getExchangePaymentGateway(
    ucc,
    orderIds,
    ['mandate'],
    memDetails,
    redirectionUrl
  );
}

export interface PaymentStatusRequest {
  data: {
    payment_ref_id: string;
    order_id?: number;
    include_audit?: boolean;
  };
}

export interface PaymentStatusResponse {
  status: string;
  data?: {
    payment_ref_id: string;
    order_id: number;
    payment_status: string;
    amount: number;
    currency: string;
    payment_mode: string;
    transaction_id?: string;
    [key: string]: any;
  };
  messages?: Array<{
    msgid: number;
    errcode: string;
    field: string;
    vals: string[];
  }>;
}

/**
 * Get payment status from BSE payment gateway
 */
export async function getBSEPaymentStatus(
  paymentRefId: string,
  orderId?: number,
  includeAudit: boolean = true
): Promise<PaymentStatusResponse> {
  try {
    const token = getBSEToken();
    if (!token) {
      throw new Error('BSE authentication required. Please login first.');
    }

    const payload: PaymentStatusRequest = {
      data: {
        payment_ref_id: paymentRefId,
        ...(orderId && { order_id: orderId }),
        include_audit: includeAudit,
      },
    };

    if (!payload.data.payment_ref_id) {
      throw new Error('Invalid payment_ref_id - is required');
    }

    const response = await axios.post<PaymentStatusResponse>(
      '/bse-api/get_bse_pg_payment_status',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    const errorData = error?.response?.data;
    const errorMessage = error instanceof Error ? error.message : 'Failed to get payment status';
    
    throw new Error(errorMessage);
  }
}
