import iwAxios from '@/api/axios';
import type {
  PortfolioFilters,
  PortfolioReturnRow,
  PortfolioReturnSummary,
  PortfolioDetailedInvestor,
  SharesBondsRow,
  SharesBondsSummary,
  FixedDepositRow,
  FixedDepositSummary,
  OtherAssetRow,
  OtherAssetSummary,
  JourneyDataPoint,
  PortfolioSummaryFilters,
  SummaryRow,
  SummaryResult,
} from '@/types/portfolio';

// ── UTC → IST ─────────────────────────────────────────────────────────────────
export function toIST(utcStr: string | null | undefined): string {
  if (!utcStr) return '';
  try {
    const d = new Date(utcStr);
    if (isNaN(d.getTime())) return utcStr;
    return new Date(d.getTime() + 5.5 * 60 * 60 * 1000).toISOString().split('T')[0];
  } catch { return utcStr; }
}

// ── Build filters — single object in array, only confirmed fields ───────────────
function buildFilters(f: PortfolioFilters): string {
  const obj: Record<string, unknown> = {
    endDate:     f.endDate,
    pan:         f.pan,
    dataSource:  f.dataSource !== undefined ? String(f.dataSource) : '0',
    panWiseData: f.panWiseData !== undefined ? f.panWiseData : 1,
  };
  if (f.investorExactName) obj.investorExactName = f.investorExactName;
  if (f.holdingPeriod)     obj.holdingPeriod     = f.holdingPeriod;
  if (f.equityCode1)       obj.equityCode1       = f.equityCode1;
  return JSON.stringify([obj]);
}

// ── Build summary filters ─────────────────────────────────────────────────────
function buildSummaryFilters(f: PortfolioSummaryFilters): string {
  const obj: Record<string, unknown> = {
    startDate:   f.startDate ?? '1993-01-01',
    endDate:     f.endDate,
    pan:         f.pan,
    panWiseData: f.panWiseData !== undefined ? f.panWiseData : 1,
  };
  if (f.investorExactName) obj.investorExactName = f.investorExactName;
  if (f.equityCode1)       obj.equityCode1       = f.equityCode1;
  return JSON.stringify([obj]);
}

const SUMMARY_PREFERENCES = JSON.stringify([{
  dataOptions: [{ name: 'activeAssetsOnly', isRequired: true }],
}]);

// ── Typed API error ───────────────────────────────────────────────────────────
export type PortfolioErrorKind =
  | 'CLIENT_NOT_FOUND'
  | 'NO_DATA'
  | 'UNAUTHORIZED'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'API_ERROR';

export class PortfolioError extends Error {
  constructor(message: string, public readonly kind: PortfolioErrorKind) {
    super(message);
    this.name = 'PortfolioError';
  }
}

// ── Response guard ────────────────────────────────────────────────────────────
function guard(json: { status: number; message?: string; result?: unknown }): void {
  if (json.status !== 0) {
    const msg = json.message || `API error (status ${json.status})`;
    const lower = msg.toLowerCase();
    if (lower.includes('client not found') || lower.includes('investor not found') || lower.includes('pan not found') || lower.includes('no data'))
      throw new PortfolioError(msg, 'CLIENT_NOT_FOUND');
    if (json.status === 401 || json.status === 403)
      throw new PortfolioError(msg, 'UNAUTHORIZED');
    if (json.status === 500)
      throw new PortfolioError(msg, 'SERVER_ERROR');
    throw new PortfolioError(msg, 'API_ERROR');
  }
  if (!json.result) throw new PortfolioError('No Portfolio Data Found', 'NO_DATA');
}

// ── Wrap axios/network errors into PortfolioError ─────────────────────────────
function wrapAxiosError(e: unknown): never {
  if (e instanceof PortfolioError) throw e;
  const err = e as { response?: { status?: number; data?: unknown }; request?: unknown; message?: string };
  if (err.response) {
    const s    = err.response.status ?? 0;
    const body = err.response.data as { status?: number; message?: string } | undefined;
    console.error('[IW API Error]', s, body);
    const msg  = body?.message || `HTTP ${s} error`;
    if (s === 401 || s === 403) throw new PortfolioError(msg, 'UNAUTHORIZED');
    if (s === 500)              throw new PortfolioError(msg, 'SERVER_ERROR');
    throw new PortfolioError(msg, 'API_ERROR');
  }
  if (err.request) throw new PortfolioError('Unable to connect to server. Check network / proxy.', 'NETWORK_ERROR');
  throw new PortfolioError(err.message || 'Unknown error', 'API_ERROR');
}

// ── Normalise UTC date fields in a row to IST ─────────────────────────────────
const DATE_FIELDS = [
  'purchaseDate', 'currentNavDate', 'txnDate', 'startDate',
  'allotmentDate', 'maturityDate', 'currentDate',
] as const;

function normRow<T extends Record<string, unknown>>(row: T): T {
  const out = { ...row };
  for (const f of DATE_FIELDS) {
    if (f in out) (out as Record<string, unknown>)[f] = toIST(out[f] as string);
  }
  return out;
}

// ── API 1 — Portfolio Returns (By Folio / Scheme / SubCat / Investor) ──────────
export async function fetchPortfolioReturns(
  filters: PortfolioFilters,
  group?: 'schid' | 'objectiveid' | 'appid'
): Promise<{ data: PortfolioReturnRow[]; summary: PortfolioReturnSummary }> {
  const params: Record<string, string> = { filters: buildFilters(filters) };
  if (group) params.group = group;
  const { data: json } = await iwAxios.get('/aggregator/reports/getPortfolioReturns', { params }).catch(wrapAxiosError);
  guard(json);
  return {
    data:    ((json.result?.data ?? []) as PortfolioReturnRow[]).map(normRow),
    summary: (json.result?.summary ?? {}) as PortfolioReturnSummary,
  };
}

// ── API 2 — Portfolio Returns Detailed (By Transaction) ────────────────────
export async function fetchPortfolioReturnsDetailed(
  filters: PortfolioFilters
): Promise<{ data: PortfolioDetailedInvestor[]; summary: PortfolioReturnSummary }> {
  const params = { filters: buildFilters(filters), groupBy: '1008' };
  const { data: json } = await iwAxios.get('/aggregator/reports/getPortfolioReturnsDetailed', { params }).catch(wrapAxiosError);
  guard(json);
  const investors: PortfolioDetailedInvestor[] = (json.result?.data ?? []).map(
    (inv: PortfolioDetailedInvestor) => ({
      ...inv,
      data: (inv.data ?? []).map(subCat => ({
        ...subCat,
        data: (subCat.data ?? []).map(folioGroup => ({
          ...folioGroup,
          data: (folioGroup.data ?? []).map(normRow),
        })),
      })),
    })
  );
  return {
    data:    investors,
    summary: (investors[0]?.summary ?? {}) as PortfolioReturnSummary,
  };
}

// ── API 3 — Shares & Bonds ────────────────────────────────────────────────────
export async function fetchSharesAndBonds(
  filters: PortfolioFilters,
  group: 'schid' | 'appid' = 'schid'
): Promise<{ data: SharesBondsRow[]; summary: SharesBondsSummary }> {
  const params = { filters: buildFilters(filters), group };
  const { data: json } = await iwAxios.get('/aggregator/reports/getPortFolioReturnsForSharesAndBonds', { params }).catch(wrapAxiosError);
  guard(json);
  return {
    data:    ((json.result?.data ?? []) as SharesBondsRow[]).map(normRow),
    summary: (json.result?.summary ?? {}) as SharesBondsSummary,
  };
}

// ── API 4 — Fixed Deposit ─────────────────────────────────────────────────────
export async function fetchFixedDeposit(
  filters: PortfolioFilters,
  groupBy = 'fixedAssetTxnid'
): Promise<{ data: FixedDepositRow[]; summary: FixedDepositSummary }> {
  const params = { filters: buildFilters(filters), groupBy };
  const { data: json } = await iwAxios.get('/aggregator/reports/getPortfolioReturnsForFixedAssets', { params }).catch(wrapAxiosError);
  guard(json);
  return {
    data:    ((json.result?.data ?? []) as FixedDepositRow[]).map(normRow),
    summary: (json.result?.summary ?? {}) as FixedDepositSummary,
  };
}

// ── API 5 — Other Assets ──────────────────────────────────────────────────────
export async function fetchOtherAssets(
  filters: PortfolioFilters
): Promise<{ data: OtherAssetRow[]; summary: OtherAssetSummary }> {
  const params = { filters: buildFilters(filters) };
  const { data: json } = await iwAxios.get('/aggregator/reports/getPortfolioForOtherAssets', { params }).catch(wrapAxiosError);
  guard(json);
  const rows: OtherAssetRow[] = (json.result?.data ?? []).map((row: OtherAssetRow) => ({
    ...(normRow(row as unknown as Record<string, unknown>) as unknown as OtherAssetRow),
    txns:       (row.txns      ?? []).map(normRow),
    XIRRData:   row.XIRRData   ?? [],
    bmXirrData: row.bmXirrData ?? [],
  }));
  return { data: rows, summary: (json.result?.summary ?? {}) as OtherAssetSummary };
}

// ── API 6 — Portfolio Summary (getPortfolioSummaryForMutualFunds) ─────────────
export async function fetchPortfolioSummary(
  groupBy: number,
  filters: PortfolioSummaryFilters
): Promise<SummaryResult> {
  const params = {
    groupBy,
    filters:     buildSummaryFilters(filters),
    preferences: SUMMARY_PREFERENCES,
  };
  const { data: json } = await iwAxios
    .get('/aggregator/reports/getPortfolioSummaryForMutualFunds', { params })
    .catch(wrapAxiosError);
  guard(json);
  const data: SummaryRow[] = (json.result?.data ?? []).map((row: SummaryRow) => ({
    ...normRow(row as unknown as Record<string, unknown>),
    XIRRData: (row.XIRRData ?? []).map((x: { amount: number; date: string }) => ({
      ...x,
      date: toIST(x.date),
    })),
  })) as SummaryRow[];
  return { data, summary: json.result?.summary ?? {} };
}

// ── Journey chart ─────────────────────────────────────────────────────────────
export async function fetchJourneyData(
  pan: string,
  graphPeriod: string,
  dataSource = 0
): Promise<JourneyDataPoint[]> {
  const params = {
    graphPeriod,
    filters: JSON.stringify([{ pan }]),
  };
  const { data: json } = await iwAxios.get('/aggregator/utils/getNavDateVSAUMNetInvGraph', { params }).catch(wrapAxiosError);
  guard(json);
  return (json.result?.data ?? []) as JourneyDataPoint[];
}
