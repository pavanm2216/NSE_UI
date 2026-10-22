import iwAxios from '@/api/axios';
import type {
  ClientTransaction,
  FDTransaction,
  OtherAssetTransaction,
  SBTransaction,
  IWApiResponse,
} from '@/types/clientTransactions';

const CACHE_TTL = 2 * 60 * 1000;
const MF_TXN_TYPES = ['NRP', 'SIP', 'STI', 'SWI', 'DIR', 'BON', 'NRS', 'STO', 'SWO', 'SWP', 'DVP'];
const todayStr = () => new Date().toISOString().split('T')[0];

// ── Generic cache entry ────────────────────────────────────────────────────────
interface CacheEntry<T> { data: T[]; ts: number; key: string }
const cache = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown[]>>();

function getCached<T>(key: string): T[] | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
  return null;
}

function setCached<T>(key: string, data: T[]): void {
  cache.set(key, { data, ts: Date.now(), key } as CacheEntry<unknown>);
}

async function dedupFetch<T>(key: string, fetcher: () => Promise<T[]>): Promise<T[]> {
  const cached = getCached<T>(key);
  if (cached) return cached;

  if (inflight.has(key)) return inflight.get(key) as Promise<T[]>;

  const promise = fetcher().then(data => {
    setCached(key, data);
    inflight.delete(key);
    return data;
  }).catch(err => {
    inflight.delete(key);
    throw err;
  });

  inflight.set(key, promise as Promise<unknown[]>);
  return promise;
}

function extractResult<T>(data: IWApiResponse<T>): T[] {
  if (data.status === -1) {
    const msg = data.message ?? '';
    if (msg === 'Client Not Found' || msg === 'Duplicate client found') return [];
    throw new Error(msg || 'API error');
  }
  if (data.status !== 0) throw new Error(data.message ?? 'API error');
  if (Array.isArray(data.result)) return data.result;
  return (data.result as { data: T[] })?.data ?? [];
}

// ── Public API ─────────────────────────────────────────────────────────────────

export async function getClientTransactions(
  pan: string,
  assetType: string,
  fromDate: string,
  toDate: string
): Promise<ClientTransaction[]> {
  const cappedTo = toDate > todayStr() ? todayStr() : toDate;
  const key = `mf:${pan}:${assetType}:${fromDate}:${cappedTo}`;

  return dedupFetch<ClientTransaction>(key, async () => {
    try {
      const { data } = await iwAxios.get<IWApiResponse<ClientTransaction>>(
        '/aggregator/reports/getClientTransactions',
        {
          params: {
            filters: JSON.stringify([{
              assetType,
              pan,
              txnTypeIn: MF_TXN_TYPES,
              selectedDateFrom: fromDate,
              selectedDateTo: cappedTo,
            }]),
          },
        }
      );
      return extractResult(data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      console.error('Investwell getClientTransactions error:', e.response?.data);
      throw new Error(e.response?.data?.message ?? e.message ?? 'API Failed');
    }
  });
}

export async function getFDTransactions(pan: string): Promise<FDTransaction[]> {
  const key = `fd:${pan}`;
  return dedupFetch<FDTransaction>(key, async () => {
    try {
      const { data } = await iwAxios.get<IWApiResponse<FDTransaction>>(
        '/aggregator/reports/getClientTransactions',
        { params: { filters: JSON.stringify([{ assetType: 'F', pan, isRunning: true }]) } }
      );
      return extractResult(data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      console.error('Investwell getFDTransactions error:', e.response?.data);
      throw new Error(e.response?.data?.message ?? e.message ?? 'API Failed');
    }
  });
}

export async function getOtherAssetTransactions(pan: string): Promise<OtherAssetTransaction[]> {
  const key = `oa:${pan}`;
  return dedupFetch<OtherAssetTransaction>(key, async () => {
    try {
      const { data } = await iwAxios.get<IWApiResponse<OtherAssetTransaction>>(
        '/aggregator/reports/getClientTransactions',
        { params: { filters: JSON.stringify([{ assetType: 'A', pan }]) } }
      );
      return extractResult(data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      console.error('Investwell getOtherAssetTransactions error:', e.response?.data);
      throw new Error(e.response?.data?.message ?? e.message ?? 'API Failed');
    }
  });
}

export async function getSBTransactions(pan: string): Promise<SBTransaction[]> {
  const key = `sb:${pan}`;
  return dedupFetch<SBTransaction>(key, async () => {
    try {
      const endDate = todayStr();
      const { data } = await iwAxios.get<IWApiResponse<SBTransaction>>(
        '/aggregator/reports/getPortFolioReturnsForSharesAndBonds',
        { params: { filters: JSON.stringify([{ pan, startDate: '2015-01-01', endDate }]) } }
      );
      return extractResult(data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      console.error('Investwell getSBTransactions error:', e.response?.data);
      throw new Error(e.response?.data?.message ?? e.message ?? 'API Failed');
    }
  });
}

export function invalidateCache(pan?: string): void {
  if (!pan) { cache.clear(); return; }
  for (const key of cache.keys()) {
    if (key.includes(pan)) cache.delete(key);
  }
}
