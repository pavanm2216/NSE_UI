export interface AdminDashboardStats {
  users: {
    total: number;
    new_this_month: number;
    change_percent: number;
    verified_phone: number;
  };
  subscriptions: {
    active: number;
    new_this_month: number;
    change_percent: number;
  };
  payments: {
    total_volume: number;
    revenue_this_month: number;
    revenue_change_percent: number;
    paid_count: number;
    pending_count: number;
    failed_count: number;
    cancelled_count: number;
  };
  kyc: {
    profiles: number;
    documents: number;
    addresses: number;
    completion_rate: number;
  };
  plans: Array<{
    plan_code: string;
    plan_name: string;
    paid_count: number;
    revenue: number;
  }>;
  system_health: Array<{
    component: string;
    status: string;
    uptime: string;
    color: 'success' | 'warning' | 'danger';
  }>;
  overview: {
    active_subscriptions: number;
    total_customers: number;
    kyc_completion_rate: number;
    payment_success_rate: number;
  };
}

export interface AdminActivityItem {
  type: string;
  message: string;
  timestamp: string;
  user_id?: string;
  order_id?: string;
  payment_status?: string;
}

export interface AdminPaymentItem {
  order_id: string;
  user_email: string | null;
  user_name: string | null;
  plan_code: string | null;
  plan_name: string | null;
  amount: number;
  currency: string;
  payment_status: string;
  payment_method: string | null;
  refund_status?: string;
  refunded_amount?: number;
  cashfree_order_id?: string | null;
  cashfree_payment_id?: string | null;
  created_at: string | null;
  payment_time: string | null;
}

export interface AdminPaymentDetail {
  transaction: {
    id: number;
    order_id: string;
    cashfree_order_id: string | null;
    cashfree_payment_id: string | null;
    payment_session_id: string | null;
    amount: number;
    currency: string;
    payment_status: string;
    payment_method: string | null;
    payment_time: string | null;
    refund_status: string;
    refunded_amount: number;
    refundable_amount: number;
    created_at: string | null;
  };
  customer: {
    id: string | null;
    name: string | null;
    email: string | null;
    phone: string | null;
    subscription_status: string | null;
    active_plan_code: string | null;
    subscription_start_date: string | null;
    subscription_end_date: string | null;
  };
  plan: {
    plan_code: string;
    plan_name: string;
    description: string | null;
    amount: number;
    duration_days: number;
  } | null;
  membership: {
    status: string;
    start_date: string;
    end_date: string;
    activated_at: string | null;
    is_current: boolean;
  } | null;
  cashfree_order: {
    cf_order_id: string | null;
    order_status: string | null;
    order_amount: number | null;
    order_currency: string | null;
    order_note: string | null;
    created_at: string | null;
  } | null;
  cashfree_payments: Array<{
    cf_payment_id: string | null;
    payment_status: string | null;
    payment_amount: number | null;
    payment_currency: string | null;
    payment_method: string | null;
    payment_group: string | null;
    bank_reference: string | null;
    auth_id: string | null;
    payment_message: string | null;
    payment_time: string | null;
    payment_method_details: unknown;
  }>;
  refunds: {
    database: Array<{
      id: number;
      refund_id: string;
      cf_refund_id: string | null;
      cf_payment_id: string | null;
      refund_amount: number;
      refund_status: string;
      refund_note: string | null;
      refund_speed: string | null;
      processed_at: string | null;
      created_at: string | null;
    }>;
    cashfree: Array<{
      refund_id: string | null;
      cf_refund_id: string | null;
      cf_payment_id: string | null;
      refund_amount: number | null;
      refund_status: string | null;
      refund_note: string | null;
      refund_speed: string | null;
      created_at: string | null;
      processed_at: string | null;
    }>;
  };
  can_refund: boolean;
}

export interface CreateRefundRequest {
  order_id: string;
  refund_amount: number;
  refund_note?: string;
  refund_speed?: 'STANDARD' | 'INSTANT';
}

export interface CreateRefundResponse {
  success: boolean;
  message: string;
  refund: AdminPaymentDetail['refunds']['database'][0];
  transaction: {
    order_id: string;
    payment_status: string;
    refund_status: string;
    refunded_amount: number;
    refundable_amount: number;
  };
}

export interface AdminPaymentsResponse {
  items: AdminPaymentItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export const parseAdminApiError = (
  response: { data?: unknown },
  fallback = 'Request failed.'
): string => {
  if (response?.data && typeof response.data === 'object') {
    const data = response.data as { message?: string; detail?: string };
    return data.message || data.detail || fallback;
  }
  return fallback;
};
