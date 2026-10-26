export interface SchemeFilter {
  scheme_amc_name?: string;
  scheme_category?: string;
  scheme_sub_category?: string;
  investment_mode?: string;
  scheme_option?: string;
  scheme_plan?: string;
  scheme_isin?: string;
  settlement_days?: string;
  transaction_allowed?: string;
}

export interface SchemeListRequest {
  fields: string[];
  count_only: boolean;
  start: number;
  length: number;
  filter_param: SchemeFilter;
  search: { value: string };
}

export interface Scheme {
  parent_scheme_code: string;
  parent_scheme_name: string;
  name: string;
  scheme_plan: string;
  scheme_option: string;
  scheme_isin: string;
  scheme_bse_code: string;
  scheme_amc_code: string;
  scheme_rta_code: string;
  is_active: boolean;
  min_purchase_amount?: number;
  min_addl_purchase_amount?: number;
  [key: string]: unknown;
}
