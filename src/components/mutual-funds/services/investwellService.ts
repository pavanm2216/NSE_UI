import axios from 'axios';
import iwAxios from '@/api/axios';
import type {
  AuthTokenResponse,
  RealizedCapitalGainResponse,
  UnrealizedCapitalGainResponse,
  PortfolioOtherAssetsResponse,
  MFPortfolioSummaryResponse,
  SOAResponse,
} from '@/types/investwell';

export const INVESTWELL_BASE_URL = import.meta.env.VITE_INVESTWELL_API_BASE_URL as string;

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

// ─── Real API: POST /auth/getAuthorizationToken ───────────────────────────────
export async function getAuthorizationToken(
  username: string,
  password: string
): Promise<{ token: string }> {
  const { data: json } = await iwAxios.post('/aggregator/auth/getAuthorizationToken', { authName: username, password });
  if (json.status !== 0) throw new Error(json.message ?? 'Authentication failed');
  if (!json.result?.token) throw new Error('No token in auth response');
  return { token: json.result.token };
}

// ─── Legacy mock ──────────────────────────────────────────────────────────────
export async function getAuthToken(_username: string, _password: string): Promise<AuthTokenResponse> {
  await delay();
  return { token: 'mock-jwt-token-xyz', expiry: '2025-12-31T23:59:59Z', clientCode: 'LV-001' };
}

function isClientNotFound(text: string): boolean {
  return text.includes('Client Not Found') || text.includes('client not found');
}

function xhrGet(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => {
      if (xhr.status >= 400) { reject(new Error(`HTTP ${xhr.status}`)); return; }
      try { resolve(JSON.parse(xhr.responseText)); }
      catch { reject(new Error('Invalid JSON response')); }
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send();
  });
}

// GET /reports/getRealizedCapitalGainV2
export async function getRealizedCapitalGainV2API(
  _token: string,
  pan: string,
  year: number
): Promise<any> {
  const filters = JSON.stringify([{ pan, panWiseData: true }]);
  const { data } = await iwAxios.get('/aggregator/reports/getRealizedCapitalGainV2', { params: { filters, year } });
  if (data.status === -1) {
    if (data.message === 'Duplicate client found' || data.message === 'Client Not Found') return { data: [] };
  }
  if (data.status !== 0) throw new Error(data.message ?? 'getRealizedCapitalGainV2 failed');
  return data.result;
}

// GET /reports/getRealizedCapitalGain
export async function getRealizedCapitalGainAPI(
  _token: string,
  pan: string,
  year: number
): Promise<any> {
  const filters = JSON.stringify([{ pan, panWiseData: true }]);
  const { data } = await iwAxios.get('/aggregator/reports/getRealizedCapitalGain', { params: { filters, year } });
  if (data.status === -1) {
    const msg = data.message ?? '';
    if (msg === 'Client Not Found' || msg === 'Duplicate client found') {
      return {
        debt: { shortTerm: { fifo: [], summary: {} }, longTerm: { fifo: [], summary: {} } },
        equity: { shortTerm: { fifo: [], summary: {} }, longTermBeforeJan18: { fifo: [], summary: {} }, longTermAfterJan18: { fifo: [], summary: {} }, longTermSummary: {} },
        summary: { gain: { debt: { shortTerm: 0, longTerm: 0 }, equity: { shortTerm: 0, longTerm: 0 }, disallowedLoss: 0 } },
      };
    }
    throw new Error(msg || 'getRealizedCapitalGain failed');
  }
  if (data.status !== 0) throw new Error(data.message ?? 'getRealizedCapitalGain failed');
  return data.result;
}

// GET /aggregator/reports/downloadRealizedCapitalGainPDF
export async function downloadRealizedCapitalGainPDF(
  token: string,
  pan: string,
  year: number,
  pdfType: 'detailed' | 'summary' = 'detailed'
): Promise<void> {
  const filters = JSON.stringify([{ casArnOption: '0', pan }]);
  const preferences = JSON.stringify([{
    products: [{ name: 'MF', isRequired: true }, { name: 'EQ', isRequired: true }],
    gainTypes: [
      { name: 'debtShortTerm', isRequired: true }, { name: 'debtLongTerm', isRequired: true },
      { name: 'equityShortTerm', isRequired: true }, { name: 'equityLongTerm', isRequired: true },
    ],
  }]);
  window.open(`https://lendrixventech.investwell.app/api/aggregator/reports/downloadRealizedCapitalGainPDF?filters=${encodeURIComponent(filters)}&year=${year}&pdfType=${pdfType}&clubTxns=false&preferences=${encodeURIComponent(preferences)}&token=${token}`, '_blank');
}

// GET /reports/downloadRealizedCapitalGainPDFV2
export async function downloadRealizedCapitalGainPDFV2(
  token: string,
  pan: string,
  year: number,
  pdfType: 'detailed' | 'summary' = 'detailed'
): Promise<void> {
  const filters = JSON.stringify([{ casArnOption: '0', pan }]);
  const preferences = JSON.stringify([{
    products: [{ name: 'MF', isRequired: true }, { name: 'EQ', isRequired: true }],
    gainTypes: [
      { name: 'debtShortTerm', isRequired: true }, { name: 'debtLongTerm', isRequired: true },
      { name: 'equityShortTerm', isRequired: true }, { name: 'equityLongTerm', isRequired: true },
    ],
  }]);
  window.open(`https://lendrixventech.investwell.app/api/aggregator/reports/downloadRealizedCapitalGainPDFV2?filters=${encodeURIComponent(filters)}&year=${year}&pdfType=${pdfType}&clubTxns=false&preferences=${encodeURIComponent(preferences)}&token=${token}`, '_blank');
}

// GET /capitalGain/realized/mutualFunds
export async function getRealizedCapitalGain(
  _clientCode: string,
  _fy: string
): Promise<RealizedCapitalGainResponse> {
  await delay();
  return {
    data: [
      { folio: 'MF-001', schemeName: 'Axis Bluechip Fund - Growth', isin: 'INF846K01EW2', purchaseDate: '2024-01-10', redemptionDate: '2025-06-15', units: 152.34, purchaseNAV: 52.30, redemptionNAV: 61.85, purchaseValue: 7967.38, redemptionValue: 9425.24, gainLoss: 1457.86, gainLossPercent: 18.30, holdingDays: 521, gainType: 'LTCG', taxableGain: 1457.86, indexationBenefit: 0 },
      { folio: 'MF-002', schemeName: 'HDFC Mid-Cap Opportunities Fund', isin: 'INF179K01VQ8', purchaseDate: '2024-03-05', redemptionDate: '2025-06-01', units: 88.12, purchaseNAV: 90.80, redemptionNAV: 112.40, purchaseValue: 7999.30, redemptionValue: 9904.69, gainLoss: 1905.39, gainLossPercent: 23.82, holdingDays: 453, gainType: 'LTCG', taxableGain: 1905.39, indexationBenefit: 0 },
      { folio: 'MF-003', schemeName: 'Nippon India Pharma Fund', isin: 'INF204K01C54', purchaseDate: '2025-04-20', redemptionDate: '2025-05-28', units: 12.88, purchaseNAV: 388.50, redemptionNAV: 437.20, purchaseValue: 5003.88, redemptionValue: 5631.14, gainLoss: 627.26, gainLossPercent: 12.54, holdingDays: 38, gainType: 'STCG', taxableGain: 627.26, indexationBenefit: 0 },
      { folio: 'MF-004', schemeName: 'Kotak Gilt Fund - Growth', isin: 'INF174K01LS2', purchaseDate: '2025-02-12', redemptionDate: '2025-06-10', units: 113.51, purchaseNAV: 88.10, redemptionNAV: 83.00, purchaseValue: 10000.03, redemptionValue: 9421.33, gainLoss: -578.70, gainLossPercent: -5.79, holdingDays: 118, gainType: 'STCG', taxableGain: 0, indexationBenefit: 0 },
      { folio: 'MF-005', schemeName: 'Mirae Asset Emerging Bluechip', isin: 'INF769K01DM5', purchaseDate: '2023-06-15', redemptionDate: '2025-05-10', units: 45.22, purchaseNAV: 66.40, redemptionNAV: 98.75, purchaseValue: 3002.61, redemptionValue: 4465.49, gainLoss: 1462.88, gainLossPercent: 48.72, holdingDays: 694, gainType: 'LTCG', taxableGain: 1462.88, indexationBenefit: 124.50 },
    ],
    summary: { totalLTCG: 4826.13, totalSTCG: 627.26, totalGain: 4874.69, taxLiabilityLTCG: 482.61, taxLiabilitySTCG: 97.22, totalTaxLiability: 579.83 },
  };
}

export async function getAuthorizationTokenApp(
  username: string,
  password: string
): Promise<{ token: string }> {
  const res = await fetch(`/iw-api-app/api/aggregator/auth/getAuthorizationToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ authName: username, password }),
  });
  if (!res.ok) throw new Error(`Auth failed: ${res.status}`);
  const json = await res.json();
  if (json.status !== 0) throw new Error(json.message ?? 'Authentication failed');
  if (!json.result?.token) throw new Error('No token in auth response');
  return { token: json.result.token };
}

// GET /webapi/aggregator/reports/exportUnrealizedCapitalGainPDF
export function downloadUnrealizedCapitalGainPDF(token: string, pan: string): void {
  const filters = encodeURIComponent(JSON.stringify([{ casArnOption: '0', pan }]));
  const preferences = encodeURIComponent(JSON.stringify([{
    products: [{ name: 'MF', isRequired: true }, { name: 'FD', isRequired: true }, { name: 'EQ', isRequired: true }],
    reportType: 'summary',
  }]));
  window.open(`https://lendrixventech.investwell.app/api/aggregator/reports/exportUnrealizedCapitalGainPDF?token=${token}&filters=${filters}&preferences=${preferences}&clubTxns=TRUE`, '_blank');
}

// GET /reports/exportUnrealizedCapitalGainPDFV2
export function downloadUnrealizedCapitalGainPDFV2(token: string, pan: string): void {
  const filters = encodeURIComponent(JSON.stringify([{ casArnOption: '0', pan }]));
  const preferences = encodeURIComponent(JSON.stringify([{
    products: [{ name: 'MF', isRequired: true }, { name: 'FD', isRequired: true }, { name: 'EQ', isRequired: true }],
    reportType: 'summary',
  }]));
  window.open(`https://lendrixventech.investwell.app/api/aggregator/reports/exportUnrealizedCapitalGainPDFV2?token=${token}&filters=${filters}&preferences=${preferences}&clubTxns=TRUE`, '_blank');
}

const EMPTY_UNREALIZED_V1 = { equity: { shortTerm: { rows: [] }, longTermBeforeJan18: { rows: [] }, longTermAfterJan18: { rows: [] } }, debt: { shortTerm: { rows: [] }, longTerm: { rows: [] } } };
const EMPTY_UNREALIZED_V2 = { data: [] };

async function fetchUnrealizedSafe(path: string, emptyResult: any, params: object): Promise<any> {
  const { data } = await iwAxios.get(path, { params });
  if (data.status === -1) {
    const msg = data.message ?? '';
    if (msg === 'Client Not Found' || msg === 'Duplicate client found') return emptyResult;
    throw new Error(msg);
  }
  if (data.status !== 0) throw new Error(data.message ?? `${path} failed`);
  return data.result;
}

// GET /reports/getUnrealizedCapitalGain
export async function getUnrealizedCapitalGainAPI(_token: string, pan: string): Promise<any> {
  return fetchUnrealizedSafe('/aggregator/reports/getUnrealizedCapitalGain', EMPTY_UNREALIZED_V1, { filters: JSON.stringify([{ pan, panWiseData: true }]) });
}

// GET /reports/getUnrealizedCapitalGainV2
export async function getUnrealizedCapitalGainV2API(_token: string, pan: string): Promise<any> {
  return fetchUnrealizedSafe('/aggregator/reports/getUnrealizedCapitalGainV2', EMPTY_UNREALIZED_V2, { filters: JSON.stringify([{ pan, panWiseData: true }]) });
}

// GET /reports/getUnrealizedCapitalGainSbV2
export async function getUnrealizedCapitalGainSbV2API(_token: string, pan: string): Promise<any> {
  return fetchUnrealizedSafe('/aggregator/reports/getUnrealizedCapitalGainSbV2', EMPTY_UNREALIZED_V2, { filters: JSON.stringify([{ pan, panWiseData: true }]) });
}

// GET /capitalGain/unrealized/mutualFunds
export async function getUnrealizedCapitalGain(
  _clientCode: string
): Promise<UnrealizedCapitalGainResponse> {
  await delay();
  return {
    data: [
      { folio: 'MF-001', schemeName: 'Parag Parikh Flexi Cap Fund - Growth', isin: 'INF879O01019', purchaseDate: '2024-02-15', units: 312.45, purchaseNAV: 55.98, currentNAV: 74.12, purchaseValue: 17490.71, currentValue: 23165.24, unrealizedGain: 5674.53, unrealizedGainPercent: 32.44, holdingDays: 496, gainType: 'LTCG', estimatedTax: 567.45 },
      { folio: 'MF-002', schemeName: 'Mirae Asset Large Cap Fund - Growth', isin: 'INF769K01010', purchaseDate: '2024-04-10', units: 254.10, purchaseNAV: 78.32, currentNAV: 98.45, purchaseValue: 19901.41, currentValue: 25016.15, unrealizedGain: 5114.74, unrealizedGainPercent: 25.70, holdingDays: 436, gainType: 'LTCG', estimatedTax: 511.47 },
      { folio: 'MF-003', schemeName: 'SBI Small Cap Fund - Growth', isin: 'INF200K01RB2', purchaseDate: '2025-01-20', units: 137.60, purchaseNAV: 109.45, currentNAV: 145.60, purchaseValue: 15060.32, currentValue: 20034.56, unrealizedGain: 4974.24, unrealizedGainPercent: 33.03, holdingDays: 161, gainType: 'STCG', estimatedTax: 746.14 },
      { folio: 'MF-004', schemeName: 'ICICI Pru Balanced Advantage Fund', isin: 'INF109K01Z13', purchaseDate: '2023-12-01', units: 711.90, purchaseNAV: 60.42, currentNAV: 63.20, purchaseValue: 43013.00, currentValue: 44992.08, unrealizedGain: 1979.08, unrealizedGainPercent: 4.60, holdingDays: 561, gainType: 'LTCG', estimatedTax: 197.91 },
      { folio: 'MF-005', schemeName: 'HDFC Mid-Cap Opportunities Fund', isin: 'INF179K01VQ8', purchaseDate: '2025-03-05', units: 221.30, purchaseNAV: 108.90, currentNAV: 112.80, purchaseValue: 24099.57, currentValue: 24962.64, unrealizedGain: 863.07, unrealizedGainPercent: 3.58, holdingDays: 117, gainType: 'STCG', estimatedTax: 129.46 },
    ],
    summary: { totalUnrealizedGain: 18605.66, totalLTCGUnrealized: 12768.35, totalSTCGUnrealized: 5837.31, estimatedTotalTax: 2152.43 },
  };
}

// GET /reports/getPortfolioSummaryForMutualFunds
export async function getPortfolioSummaryForMutualFunds(
  _token: string,
  groupBy: number,
  pan: string,
  startDate: string,
  endDate: string
): Promise<MFPortfolioSummaryResponse> {
  const { data: json } = await iwAxios.get('/aggregator/reports/getPortfolioSummaryForMutualFunds', {
    params: { groupBy, filters: JSON.stringify([{ startDate, endDate, pan }]) },
  });
  if (json.status !== 0) throw new Error(json.message ?? 'getPortfolioSummaryForMutualFunds failed');
  return json;
}

// GET /reports/getPortfolioForOtherAssets
export async function getPortfolioForOtherAssets(
  _token: string,
  pan: string,
  endDate: string
): Promise<PortfolioOtherAssetsResponse> {
  const { data: json } = await iwAxios.get('/aggregator/reports/getPortfolioForOtherAssets', {
    params: { filters: JSON.stringify([{ endDate, pan, panWise: '1' }]) },
  });
  if (json.status !== 0) throw new Error(json.message ?? 'Failed to fetch other assets');
  return json;
}

// GET /reports/getClientTransactions
export async function getClientTransactions(
  _token: string,
  pan: string,
  isRunning: boolean = true,
  assetType: string = 'F'
): Promise<any[]> {
  const { data } = await iwAxios.get('/aggregator/reports/getClientTransactions', {
    params: { filters: JSON.stringify([{ assetType, pan, isRunning }]) },
  });
  if (data.status === -1) {
    const msg = data.message ?? '';
    if (msg === 'Client Not Found' || msg === 'Duplicate client found') return [];
    throw new Error(msg);
  }
  if (data.status !== 0) throw new Error(data.message ?? 'getClientTransactions failed');
  return data.result ?? [];
}

// GET /reports/getInvestmentSnapShot
export async function getInvestmentSnapshot(
  _token: string,
  pan: string,
  fromDate: string,
  toDate: string
): Promise<any[]> {
  const { data } = await iwAxios.get('/aggregator/reports/getInvestmentSnapShot', {
    params: {
      filters: JSON.stringify([{ toDate }, { fromDate }, { pan, panWiseData: true }]),
      preferences: JSON.stringify([
        { products: [{ name: 'MF', isRequired: true }, { name: 'EQ', isRequired: true }, { name: 'AC', isRequired: true }, { name: 'FD', isRequired: true }] },
        { includeBenchmark: false },
      ]),
    },
  });
  if (data.status !== 0) throw new Error(data.message ?? 'Failed to fetch investment snapshot');
  return data.result.data;
}

// GET /reports/getSOA
export async function getStatementOfAccount(
  _token: string,
  folioId: string,
  clubTxns: boolean = true
): Promise<SOAResponse> {
  const { data: json } = await iwAxios.get('/aggregator/reports/getSOA', { params: { folioId, clubTxns } });
  if (json.status !== 0) throw new Error(json.message ?? 'Failed to fetch statement of account');
  return json;
}
