// ─── Shared Types & Constants ─────────────────────────────────────────────────

export interface UCCRecord {
  ucc: string;
  name: string;
  pan: string;
  email: string;
  mobile: string;
  status: string;
  bank: string;
  bankIfsc: string;
}

export interface MandateRecord {
  id: number | string;
  ucc: string;
  bank: string;
  amount: number;
  status: string;
  startDate: string;
  validTill: string;
}

export interface SIPRecord {
  id: number | string;
  ucc: string;
  scheme: string;
  amount: number;
  freq: string;
  startDate: string;
  status: string;
  installments: number;
}

export interface OrderRecord {
  id: number | string;
  ucc: string;
  scheme: string;
  type: string;
  amount: number;
  status: string;
  date: string;
  folio: string;
}

export interface ModuleData {
  loaded: boolean;
  error: string;
  data: unknown[];
}

export interface Scheme {
  parent_scheme_code: string;
  parent_scheme_name: string;
  scheme_code?: string;
  scheme_bse_code?: string;
  scheme_id?: string | number;
  name: string;
  scheme_plan: string;
  scheme_option: string;
  scheme_isin: string;
  scheme_amc_code: string;
  scheme_amc_name: string;
  scheme_category: string;
  scheme_sub_category: string;
  is_active: boolean;
  transaction_allowed?: string;
  sip_allowed?: string;
  purchase_allowed?: string;
  min_sip_amount?: number;
  min_purchase_amount?: number;
}

export type SipAction = 'cancel' | 'pause' | 'resume' | 'topup';
export type OrderStatus = 'idle' | 'loading' | 'success' | 'error' | 'redirecting';

export const SIP_DATES = [1, 5, 10, 15, 20, 25];
export const SIP_FREQS = [
  { label: 'Monthly',   value: 'm' },
  { label: 'Quarterly', value: 'q' },
];
export const CANCELLABLE_STATUSES = ['pending', 'open', 'created', 'submitted'];

export const STATUS_COLOR: Record<string, string> = {
  active:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  approved:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  pending:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  rejected:  'bg-rose-50 text-rose-700 border-rose-200',
  failed:    'bg-rose-50 text-rose-700 border-rose-200',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
};
export const statusColor = (s: string) =>
  STATUS_COLOR[s?.toLowerCase()] ?? 'bg-gray-100 text-gray-600 border-gray-200';
