export type SxpType = 'sip' | 'xsip' | 'stp' | 'swp';

export interface MemDetails {
  euin: string;
  euin_flag: boolean | null;
  sub_br_code: string;
  sub_br_arn: string;
  partner_id: string;
}

export interface SpecialProduct {
  special_prod_type: string;
  special_prod_name: string;
  target_scheme: string;
  target_amt: number;
  goal_type: string;
  goal_amt: number;
  sip_tenure: number;
}

export interface DepositoryAcct {
  depository: 'N' | 'C';
  dp_id: string;
  client_id: string;
}

export interface SxpRegister {
  sxp_type: SxpType;
  mem_sxp_ref_id: string;
  investor: { ucc: string };
  member: string;
  src_scheme: string;
  dest_scheme?: string;
  amc_code?: string;
  exch_mandate_id?: number;
  amount: number;
  cur: string;
  is_fresh: boolean;
  src_folio?: string;
  dest_folio?: string;
  phys_or_demat: 'P' | 'D' | 'p' | 'd';
  isunits: boolean;
  min_redeem_flag: boolean;
  dpc: boolean;
  start_date: string;
  end_date?: string | null;
  freq: 'm' | 'q' | 'y' | string;
  txn_date: number;
  payment_ref_id?: string;
  mem_details?: MemDetails;
  holder: { holder_rank: string; email: string; mobnum: string }[];
  depository_acct?: DepositoryAcct;
  remark?: string;
  email?: string;
  mobnum?: string;
  kyc_passed: boolean;
  first_order_today?: boolean;
  brokerage?: number;
  ninstallments?: number;
  special_product?: SpecialProduct;
}

export interface SxpListFilter {
  ucc?: string;
  type?: SxpType[];
  status?: string[];
  start_date_after?: string;
  start_date_before?: string;
}
