import axios from 'axios';
import { getOrFetchAggregatorToken } from '@/components/mutual-funds/services/investwellAuthService';

// baseURL = /iw-api  →  Vite proxy rewrites to https://lendrixventech.investwell.app/api
// This avoids CORS — the browser only ever talks to localhost
const iwAxios = axios.create({
  baseURL: '/iw-api',
});

iwAxios.interceptors.request.use(async (config) => {
  const token = await getOrFetchAggregatorToken();
  config.headers.set('token', token);
  return config;
});

export default iwAxios;
