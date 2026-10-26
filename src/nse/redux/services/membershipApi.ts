import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getClientAccessToken } from '@/constants/membership.constants';
import { setMembership } from '@/redux/slices/membershipSlice';
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  MembershipPlan,
  MyMembership,
  PaymentDetailsResponse,
  VerifyPaymentResponse,
} from '@/types/membership.types';
import { parseClientApiError } from '@/types/membership.types';

const CLIENT_API_BASE_URL = import.meta.env.VITE_CLIENT_API_BASE_URL ?? '';

const clientBaseQuery = fetchBaseQuery({
  baseUrl: CLIENT_API_BASE_URL,
  prepareHeaders: (headers) => {
    headers.set('accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    const token = getClientAccessToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

export const membershipApi = createApi({
  reducerPath: 'membershipApi',
  baseQuery: clientBaseQuery,
  tagTypes: ['Plans', 'Membership'],
  endpoints: (builder) => ({
    getPlans: builder.query<MembershipPlan[], void>({
      query: () => '/api/membership/plans',
      providesTags: ['Plans'],
    }),
    getMyMembership: builder.query<MyMembership, void>({
      query: () => '/api/membership/my-membership',
      providesTags: ['Membership'],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setMembership(data));
        } catch {
          // unauthenticated or unavailable
        }
      },
    }),
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (body) => ({
        url: '/client/payment/create-order',
        method: 'POST',
        body,
      }),
      transformErrorResponse: (response) =>
        parseClientApiError(response, 'Failed to create payment order.'),
    }),
    verifyPayment: builder.mutation<VerifyPaymentResponse, string>({
      query: (orderId) => `/client/payment/verify-payment/${orderId}`,
      invalidatesTags: ['Membership'],
      transformErrorResponse: (response) =>
        parseClientApiError(response, 'Payment verification failed.'),
      async onQueryStarted(_orderId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.order_status === 'PAID') {
            dispatch(
              setMembership({
                active_plan: data.active_plan,
                plan_name: data.plan_name,
                subscription_status: data.subscription_status,
                subscription_start_date: null,
                subscription_end_date: data.subscription_end_date,
                days_remaining: null,
              })
            );
          }
        } catch {
          // handled by caller
        }
      },
    }),
    getPaymentDetails: builder.query<PaymentDetailsResponse, string>({
      query: (orderId) => `/client/payment/payment-details/${orderId}`,
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetMyMembershipQuery,
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useGetPaymentDetailsQuery,
  useLazyGetPaymentDetailsQuery,
} = membershipApi;
