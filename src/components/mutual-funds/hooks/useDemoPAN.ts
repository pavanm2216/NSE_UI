import { getSession, getOrFetchAggregatorToken, getClients } from '../services/investwellAuthService';

const CACHE_KEY = 'iw_client_pans';
const CACHE_TS  = 'iw_client_pans_ts';
const CACHE_TTL = 30 * 60 * 1000; // 30 min

export function resolvePAN(fallback = ''): string {
  const session = getSession();
  if (session?.pan?.trim()) return session.pan.trim();
  const envPAN = (import.meta.env.VITE_DEMO_PAN as string | undefined)?.trim();
  if (envPAN) return envPAN;
  // try cached PANs from previous fetch
  const cached = getCachedPANs();
  if (cached.length) return cached[0];
  return fallback;
}

export function getCachedPANs(): string[] {
  try {
    const ts = Number(sessionStorage.getItem(CACHE_TS) ?? 0);
    if (Date.now() - ts > CACHE_TTL) return [];
    const raw = sessionStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch { return []; }
}

export async function fetchAndCachePANs(): Promise<string[]> {
  const cached = getCachedPANs();
  if (cached.length) return cached;

  try {
    const token = await getOrFetchAggregatorToken();
    const clients = await getClients(token);
    const pans = clients
      .map((c: any) => (c.pan ?? c.PAN ?? '').trim().toUpperCase())
      .filter((p: string) => p.length === 10);

    if (pans.length) {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(pans));
      sessionStorage.setItem(CACHE_TS, String(Date.now()));
    }
    return pans;
  } catch {
    return [];
  }
}

// kept for backward compat — now populated from API
export const DEMO_PANS: string[] = [];
