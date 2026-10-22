export const API_CONFIG = {
  baseURL: (import.meta.env.VITE_INVESTWELL_BASE_URL as string) || '/iw-api',
  token:   (import.meta.env.VITE_INVESTWELL_TOKEN   as string) || '',
};
