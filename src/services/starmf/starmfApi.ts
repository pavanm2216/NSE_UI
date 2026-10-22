import axios, { AxiosRequestConfig } from 'axios';
import { getBSEToken } from '@/services/bseAuth';

export const starmfApi = axios.create({ baseURL: '/bse-api' });

// Attach Bearer token on every request
starmfApi.interceptors.request.use(
  (config) => {
    const token = getBSEToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalise errors (retry handled separately below)
starmfApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (!error.response) {
      error.message = 'Unable to reach BSE StAR MF. Check your network connection.';
    }
    return Promise.reject(error);
  }
);

// ─── Retry-with-backoff for transient gateway errors ─────────────────────────
const RETRYABLE = new Set([502, 503, 504]);
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000; // 1s → 2s → 4s

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err: any) {
      const status = err?.response?.status;
      attempt++;
      if (RETRYABLE.has(status) && attempt < MAX_RETRIES) {
        const wait = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        await delay(wait);
        continue;
      }
      // Final failure — attach a clean message
      if (RETRYABLE.has(status)) {
        err.message = `BSE StAR MF is temporarily unavailable (${status}). Please try again in a few minutes.`;
      }
      throw err;
    }
  }
}

// ─── Wrapped helpers used by all service files ────────────────────────────────
export function bsePost<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  return withRetry(() => starmfApi.post<T>(url, data, config));
}

export function bseGet<T = any>(url: string, config?: AxiosRequestConfig) {
  return withRetry(() => starmfApi.get<T>(url, config));
}
