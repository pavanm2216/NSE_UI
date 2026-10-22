import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  AdminActivityItem,
  AdminDashboardStats,
  AdminPaymentDetail,
  AdminPaymentsResponse,
  CreateRefundRequest,
  CreateRefundResponse,
} from '@/types/admin.types';
import { parseAdminApiError } from '@/types/admin.types';

const CLIENT_API_BASE_URL = import.meta.env.VITE_CLIENT_API_BASE_URL ?? '';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: CLIENT_API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['AdminStats', 'AdminActivity', 'AdminPayments'],
  endpoints: (builder) => ({
    getDashboardStats: builder.query<AdminDashboardStats, void>({
      query: () => '/api/admin/dashboard/stats',
      providesTags: ['AdminStats'],
      transformErrorResponse: (response) =>
        parseAdminApiError(response, 'Failed to load dashboard stats.'),
    }),
    getRecentActivity: builder.query<{ items: AdminActivityItem[] }, { limit?: number }>({
      query: ({ limit = 10 } = {}) => `/api/admin/dashboard/activity?limit=${limit}`,
      providesTags: ['AdminActivity'],
      transformErrorResponse: (response) =>
        parseAdminApiError(response, 'Failed to load activity.'),
    }),
    getAdminPayments: builder.query<
      AdminPaymentsResponse,
      { page?: number; limit?: number; status?: string }
    >({
      query: ({ page = 1, limit = 10, status } = {}) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (status) params.set('status', status);
        return `/api/admin/payments?${params.toString()}`;
      },
      providesTags: ['AdminPayments'],
      transformErrorResponse: (response) =>
        parseAdminApiError(response, 'Failed to load payments.'),
    }),
    getPaymentDetail: builder.query<AdminPaymentDetail, string>({
      query: (orderId) => `/api/admin/payments/${orderId}`,
      providesTags: (_result, _error, orderId) => [{ type: 'AdminPayments', id: orderId }],
      transformErrorResponse: (response) =>
        parseAdminApiError(response, 'Failed to load payment details.'),
    }),
    createPaymentRefund: builder.mutation<CreateRefundResponse, CreateRefundRequest>({
      query: ({ order_id, ...body }) => ({
        url: `/api/admin/payments/${order_id}/refund`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AdminPayments', 'AdminStats', 'AdminActivity'],
      transformErrorResponse: (response) =>
        parseAdminApiError(response, 'Failed to initiate refund.'),
    }),
    syncPaymentRefunds: builder.mutation<
      {
        success: boolean;
        message: string;
        order_id: string;
        refund_status: string;
        payment_status: string;
        refunded_amount: number;
        refundable_amount: number;
      },
      string
    >({
      query: (orderId) => ({
        url: `/api/admin/payments/${orderId}/sync-refund`,
        method: 'POST',
      }),
      invalidatesTags: ['AdminPayments', 'AdminStats'],
      transformErrorResponse: (response) =>
        parseAdminApiError(response, 'Failed to sync refund status.'),
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRecentActivityQuery,
  useGetAdminPaymentsQuery,
  useGetPaymentDetailQuery,
  useCreatePaymentRefundMutation,
  useSyncPaymentRefundsMutation,
} = adminApi;
