export interface MembershipPlan {
  plan_code: string;
  plan_name: string;
  description: string | null;
  amount: number;
  duration_days: number;
}

export interface MyMembership {
  active_plan: string | null;
  plan_name: string | null;
  subscription_status: string | null;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  days_remaining: number | null;
}

export interface CreateOrderRequest {
  plan_code: string;
}

export interface CreateOrderResponse {
  success: boolean;
  order_id: string;
  cf_order_id: string;
  payment_session_id: string;
  amount: number;
  currency: string;
  note?: string;
}

export interface VerifyPaymentResponse {
  order_id: string;
  order_status: string;
  active_plan: string | null;
  plan_name: string | null;
  subscription_status: string | null;
  subscription_end_date: string | null;
  message: string;
}

export interface PaymentDetailsResponse {
  order_id: string;
  payment_status: string;
  cf_payment_id: string | null;
  cf_order_id: string | null;
  amount: number;
  currency: string;
  payment_method: string | null;
  payment_time: string | null;
  message: string;
}

export interface SelectedPlan {
  plan_code: string;
  plan_name: string;
  amount: number;
  duration_days: number;
  description?: string | null;
}

interface ApiErrorBody {
  detail?: string;
  message?: string;
}

const isApiErrorBody = (data: unknown): data is ApiErrorBody =>
  typeof data === 'object' && data !== null;

export const parseClientApiError = (
  response: { data?: unknown },
  fallback: string
): { message: string } => {
  const { data } = response;
  if (isApiErrorBody(data)) {
    return { message: data.detail || data.message || fallback };
  }
  if (typeof data === 'string' && data.trim()) {
    return { message: data };
  }
  return { message: fallback };
};
