import axios from 'axios';
import type {
  InvestwellAuthRequest,
  InvestwellAuthResponse,
  StoredInvestwellToken,
  CreateClientsRequest,
  CreateClientsResponse,
  LocalUser,
} from '@/types/investwellAuth';

const AUTH_URL = '/iw-api/aggregator/auth';
const API = '/iw-api/aggregator';

export const TOKEN_KEY      = 'investwell_token';
export const LOGIN_TIME_KEY = 'investwell_login_time';
export const USERS_KEY      = 'iw_users';
export const SESSION_KEY    = 'iw_session';

// ─── Authenticated fetch helper ───────────────────────────────────────────────
export async function investwellApi(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem(TOKEN_KEY);
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
}

// ─── Get Authorization Token ──────────────────────────────────────────────────
export async function fetchInvestwellToken(
  credentials: InvestwellAuthRequest
): Promise<InvestwellAuthResponse> {
  const res = await fetch(
    `${AUTH_URL}/getAuthorizationToken`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authName: credentials.authName, password: credentials.password }),
    }
  );
  const data = await res.json() as InvestwellAuthResponse;
  return data;
}

const AGG_TOKEN_KEY    = 'iw_agg_token';
const AGG_TOKEN_TS     = 'iw_agg_token_ts';
const BROKER_TOKEN_KEY = 'iw_broker_token';
const BROKER_TOKEN_TS  = 'iw_broker_token_ts';
const TOKEN_TTL_MS     = 14 * 60 * 1000; // 14 min

async function fetchToken(authName: string, password: string, cacheKey: string, tsKey: string): Promise<string> {
  const cached = sessionStorage.getItem(cacheKey);
  const ts = Number(sessionStorage.getItem(tsKey) ?? 0);
  if (cached && Date.now() - ts < TOKEN_TTL_MS) return cached;

  const res = await fetchInvestwellToken({ authName, password });
  if (res.status !== 0 || !res.result?.token) throw new Error(res.message || 'Failed to get token.');

  sessionStorage.setItem(cacheKey, res.result.token);
  sessionStorage.setItem(tsKey, String(Date.now()));
  return res.result.token;
}

const AGG_AUTH_NAME_KEY = 'iw_agg_authname';
const AGG_AUTH_PASS_KEY = 'iw_agg_password';

export function storeAggregatorCredentials(authName: string, password: string): void {
  sessionStorage.setItem(AGG_AUTH_NAME_KEY, authName);
  sessionStorage.setItem(AGG_AUTH_PASS_KEY, password);
  // clear cached token so next call re-fetches with new credentials
  sessionStorage.removeItem(AGG_TOKEN_KEY);
  sessionStorage.removeItem(AGG_TOKEN_TS);
}

// ─── Get aggregator token ────────────────────────────────────────────────────
export async function getOrFetchAggregatorToken(): Promise<string> {
  const authName =
    sessionStorage.getItem(AGG_AUTH_NAME_KEY)?.trim() ||
    (import.meta.env.VITE_IW_AGG_AUTHNAME as string | undefined)?.trim() ||
    'LendrixApi';
  const password =
    sessionStorage.getItem(AGG_AUTH_PASS_KEY)?.trim() ||
    (import.meta.env.VITE_IW_AGG_PASSWORD as string | undefined)?.trim() ||
    'Deepak6543';
  const token = await fetchToken(authName, password, AGG_TOKEN_KEY, AGG_TOKEN_TS);
  storeToken(token);
  return token;
}

// ─── Get broker token ────────────────────────────────────────────────────────
export async function getOrFetchBrokerToken(): Promise<string> {
  const authName = (import.meta.env.VITE_IW_BROKER_AUTHNAME as string | undefined)?.trim();
  const password = (import.meta.env.VITE_IW_BROKER_PASSWORD as string | undefined)?.trim();
  if (!authName || !password) throw new Error('Broker credentials not configured (VITE_IW_BROKER_AUTHNAME / VITE_IW_BROKER_PASSWORD).');
  return fetchToken(authName, password, BROKER_TOKEN_KEY, BROKER_TOKEN_TS);
}

// ─── Create Clients ───────────────────────────────────────────────────────────
export async function createInvestwellClient(
  payload: CreateClientsRequest
): Promise<CreateClientsResponse> {
  const { data } = await axios.post<CreateClientsResponse>(
    '/iw-api/aggregator/utils/createClients',
    payload,
    { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
  );
  return data;
}

// ─── Get Clients (discover real PANs for this token) ────────────────────────
export async function getClients(
  token: string,
  search?: string
): Promise<Record<string, unknown>[]> {
  const toDate = new Date().toISOString().split('T')[0];
  const filters = JSON.stringify([{ dateType: 'createdAt', fromDate: '2000-01-01', toDate, ...(search ? { pan: search } : {}) }]);
  const { data } = await axios.get(
    '/iw-api/aggregator/broker/getClients',
    { params: { filters, pageSize: 50, currentPage: 1 }, headers: { token }, timeout: 30000 }
  );
  if (data.status !== 0) return [];
  return data.result?.data ?? [];
}

// ─── Fetch Client by Username ─────────────────────────────────────────────────
export async function fetchClientByUsername(username: string, token: string): Promise<Record<string, unknown> | null> {
  const toDate = new Date().toISOString().split('T')[0];
  const filters = JSON.stringify([{ username, dateType: 'createdAt', fromDate: '2020-01-01', toDate }]);
  const { data } = await axios.get(
    '/iw-api/aggregator/broker/getClients',
    { params: { filters, pageSize: 1, currentPage: 1 }, headers: { token }, timeout: 30000 }
  );
  if (data.status !== 0) return null;
  return data.result?.data?.[0] ?? null;
}

export async function fetchClientByPan(pan: string, token: string): Promise<Record<string, unknown> | null> {
  const toDate = new Date().toISOString().split('T')[0];
  const filters = JSON.stringify([{ pan, dateType: 'createdAt', fromDate: '2020-01-01', toDate }]);
  const { data } = await axios.get(
    '/iw-api/aggregator/broker/getClients',
    { params: { filters, pageSize: 1, currentPage: 1 }, headers: { token }, timeout: 30000 }
  );
  if (data.status !== 0) return null;
  return data.result?.data?.[0] ?? null;
}

// ─── Portfolio Summary ───────────────────────────────────────────────────────────
export async function fetchPortfolioSummary(
  pan: string,
  token: string,
  groupBy: number = 1004
): Promise<{ data: Record<string, unknown>[]; summary: Record<string, unknown> }> {
  const endDate = new Date().toISOString().split('T')[0];
  const filters = JSON.stringify([{ endDate, pan, dataSource: '0' }]);
  const { data } = await axios.get(
    '/iw-api/aggregator/reports/getPortfolioSummaryForMutualFunds',
    { params: { groupBy, filters }, headers: { token }, timeout: 30000 }
  );
  if (data.status !== 0) throw new Error(data.message || 'Failed to fetch portfolio.');
  return { data: data.result?.data ?? [], summary: data.result?.summary ?? {} };
}

// ─── Portfolio Returns (Group by Category) ─────────────────────────────────────
export async function getPortfolioByCategory(
  token: string,
  pan: string,
  endDate: string
) {
  const filters = JSON.stringify([{ endDate, dataSource: '0', pan }]);
  const { data } = await axios.get(
    '/iw-api/aggregator/reports/getPortfolioReturns',
    {
      params: { filters, groupBy: 1011 },
      headers: { token },
      timeout: 30000,
    }
  );
  if (data.status !== 0) throw new Error(data.message || 'Failed to fetch category portfolio.');
  return data;
}

// ─── Portfolio Returns (Group by Folio) ─────────────────────────────────────
export async function getPortfolioByFolio(
  token: string,
  pan: string,
  endDate: string
) {
  const filters = JSON.stringify([{ endDate, dataSource: '0', pan }]);
  const { data } = await axios.get(
    '/iw-api/aggregator/reports/getPortfolioReturns',
    {
      params: { filters },
      headers: { token },
      timeout: 30000,
    }
  );
  if (data.status !== 0) throw new Error(data.message || 'Failed to fetch portfolio returns.');
  return data;
}

// ─── Portfolio Returns (Group by Transaction) ─────────────────────────────────────
export async function getPortfolioByTransaction(
  token: string,
  pan: string,
  endDate: string
) {
  const filters = JSON.stringify([{ endDate, dataSource: '0', pan }]);
  const { data } = await axios.get(
    '/iw-api/aggregator/reports/getPortfolioReturnsDetailed',
    {
      params: { filters, groupBy: 1008 },
      headers: { token },
      timeout: 30000,
    }
  );
  if (data.status !== 0) throw new Error(data.message || 'Failed to fetch transaction portfolio.');
  return data;
}

// ─── Shares & Bonds Portfolio ─────────────────────────────────────────
export async function getPortfolioSharesAndBonds(
  token: string,
  pan: string,
  endDate: string
) {
  const filters = JSON.stringify([{ endDate, dataSource: '0', pan }]);
  const { data } = await axios.get(
    '/iw-api/aggregator/reports/getPortFolioReturnsForSharesAndBonds',
    {
      params: { filters },
      headers: { token },
      timeout: 30000,
    }
  );
  if (data.status !== 0) throw new Error(data.message || 'Failed to fetch shares and bonds portfolio.');
  return data;
}

export function getPortfolioPdfUrl(pan: string, token: string): string {
  const endDate = new Date().toISOString().split('T')[0];
  const filters = JSON.stringify([{ endDate, pan, dataSource: '0' }]);
  return `/iw-api/aggregator/reports/downloadCompletePortfolioSummary?filters=${encodeURIComponent(filters)}&token=${token}`;
}

export async function updateInvestwellClient(
  payload: Record<string, unknown>,
  token: string
): Promise<{ status: number; message: string }> {
  const { data } = await axios.post(
    '/iw-api/aggregator/utils/updateClient',
    payload,
    { headers: { 'Content-Type': 'application/json', token }, timeout: 30000 }
  );
  return data;
}

// ─── Token storage ────────────────────────────────────────────────────────────
export function storeToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(LOGIN_TIME_KEY, Date.now().toString());
}

export function getStoredToken(): StoredInvestwellToken | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const generated_at = localStorage.getItem(LOGIN_TIME_KEY);
  if (!token) return null;
  return { token, generated_at: generated_at ?? new Date().toISOString() };
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LOGIN_TIME_KEY);
}

// ─── Local user store ─────────────────────────────────────────────────────────
export function getLocalUsers(): LocalUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as LocalUser[]) : [];
  } catch { return []; }
}

export function saveLocalUser(user: LocalUser): void {
  const users = getLocalUsers().filter(u => u.email !== user.email);
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findLocalUser(username: string, password: string): LocalUser | null {
  return getLocalUsers().find(
    u => (u.username === username || u.email === username) && u.password === password
  ) ?? null;
}

export function emailExists(email: string): boolean {
  return getLocalUsers().some(u => u.email === email);
}

export function usernameExists(username: string): boolean {
  return getLocalUsers().some(u => u.username === username);
}

// ─── Session ──────────────────────────────────────────────────────────────────
export function setSession(user: LocalUser): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSession(): LocalUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as LocalUser) : null;
  } catch { return null; }
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

// ─── Clear all tokens ──────────────────────────────────────────
export function clearAllTokens(): void {
  sessionStorage.removeItem(AGG_TOKEN_KEY);
  sessionStorage.removeItem(AGG_TOKEN_TS);
  sessionStorage.removeItem(AGG_AUTH_NAME_KEY);
  sessionStorage.removeItem(AGG_AUTH_PASS_KEY);
  sessionStorage.removeItem(BROKER_TOKEN_KEY);
  sessionStorage.removeItem(BROKER_TOKEN_TS);
  sessionStorage.removeItem('mf_user_pan');
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LOGIN_TIME_KEY);
}
