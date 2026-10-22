import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  CLIENT_REFRESH_KEY,
  CLIENT_TOKEN_KEY,
} from '@/constants/membership.constants';
import { parseClientApiError } from '@/types/membership.types';

const CLIENT_API_BASE_URL =
  import.meta.env.VITE_CLIENT_API_BASE_URL ?? 'http://localhost:8000';

interface ClientLoginRequest {
  email: string;
  password: string;
}

interface ClientLoginResponse {
  message: string;
  email: string;
  otp_expires_at?: string | null;
  otp_expires_in_seconds?: number;
}

interface ClientVerifyOtpRequest {
  email: string;
  otp: string;
}

interface ClientVerifyOtpResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  email: string;
  full_name: string | null;
  role: string;
}

const persistClientTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(CLIENT_TOKEN_KEY, accessToken);
  localStorage.setItem(CLIENT_REFRESH_KEY, refreshToken);
};

export const clientAuthApi = createApi({
  reducerPath: 'clientAuthApi',
  baseQuery: fetchBaseQuery({
    baseUrl: CLIENT_API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    clientLogin: builder.mutation<ClientLoginResponse, ClientLoginRequest>({
      query: (body) => ({
        url: '/client/login',
        method: 'POST',
        body,
      }),
      transformErrorResponse: (response) =>
        parseClientApiError(response, 'Login failed. Check your email and password.'),
    }),
    clientVerifyOtp: builder.mutation<ClientVerifyOtpResponse, ClientVerifyOtpRequest>({
      query: (body) => ({
        url: '/client/verify-otp',
        method: 'POST',
        body,
      }),
      transformErrorResponse: (response) =>
        parseClientApiError(response, 'OTP verification failed.'),
      async onQueryStarted(_arg, { queryFulfilled }) {
        const { data } = await queryFulfilled;
        persistClientTokens(data.access_token, data.refresh_token);
      },
    }),
    clientResendOtp: builder.mutation<ClientLoginResponse, { email: string }>({
      query: (body) => ({
        url: '/client/resend-otp',
        method: 'POST',
        body,
      }),
      transformErrorResponse: (response) =>
        parseClientApiError(response, 'Failed to resend OTP.'),
    }),
  }),
});

export const {
  useClientLoginMutation,
  useClientVerifyOtpMutation,
  useClientResendOtpMutation,
} = clientAuthApi;

export const clearClientSession = () => {
  localStorage.removeItem(CLIENT_TOKEN_KEY);
  localStorage.removeItem(CLIENT_REFRESH_KEY);
};

export const hasClientAccessToken = (): boolean =>
  Boolean(localStorage.getItem(CLIENT_TOKEN_KEY));
