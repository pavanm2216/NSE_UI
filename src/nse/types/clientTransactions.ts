export interface ClientTransaction {
  investorName: string;
  clientName?: string;
  schemeName?: string;
  folioNo?: string;
  txnType: string;
  units?: number;
  nav?: number;
  amount?: number;
  totalAmount?: number;
  stampDuty?: number;
  STT?: number;
  navDate: string;
  isinNo?: string;
  arnNo?: string;
}

export interface FDTransaction {
  investorName?: string;
  fixedAssetName?: string;
  scheme?: string;
  fdType?: string;
  startDate?: string;
  endDate?: string;
  month?: number;
  day?: number;
  amount?: number;
  rateOfInterest?: number;
  arnNo?: string;
  refNo?: string;
  paymentDetails?: { bank?: string };
}

export interface OtherAssetTransaction {
  investor?: string;
  assetName?: string;
  assetType?: string;
  date?: string;
  amount?: number;
  amt?: number;
  accountNumber?: string;
  txnReferenceId?: string;
}

export interface SBTransaction {
  applicantName?: string;
  clientName?: string;
  schemeName?: string;
  fixedAssetName?: string;
  isinNo?: string;
  pdType?: string;
  txnType?: string;
  purchaseValue?: number;
  currentValue?: number;
  gain?: number;
  CAGR?: number;
  absoluteReturn?: number;
  avgHoldingDays?: number;
}

export interface IWApiResponse<T> {
  status: number;
  message: string;
  result: T[] | { data: T[] } | null;
}
