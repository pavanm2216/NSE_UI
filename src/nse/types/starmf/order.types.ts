export type OrderType = 'p' | 'r' | 's'; // purchase | redeem | switch
export type PhysOrDemat = 'p' | 'd' | '';

export interface OrderHolder {
  holder_rank: string;
  email: string;
  mobnum: string;
}

export interface DepositoryAcct {
  depository: 'N' | 'C';
  dp_id: string;
  client_id: string;
}

export interface BankAcct {
  ifsc: string;
  no: string;
  type: 'SB' | 'CB';
  name: string;
}

export interface NomineeIdentifier {
  identifier_type: string;
  identifier_number: string;
}

export interface NomineeGuardian {
  first_name: string;
  middle_name?: string;
  last_name: string;
  dob: string;
  identifier?: NomineeIdentifier[];
}

export interface OrderNomination {
  person: { first_name: string; middle_name?: string; last_name: string; dob: string };
  nomination_percent: number;
  nomination_relation: string;
  is_pan_exempt: boolean;
  is_minor: boolean;
  identifier: NomineeIdentifier[];
  contact?: { contact_number: string; email_address: string; contact_type: string };
  comm_addr?: { address_line_1: string; city: string; postal_code: string; state: string; country: string };
  guardian?: NomineeGuardian;
}

export interface MemDetails {
  euin: string;
  euin_flag: boolean | null;
  sub_br_code: string;
  sub_br_arn: string;
  partner_id: string;
}

export interface NewOrder {
  type: OrderType;
  mem_ord_ref_id: string;
  investor: { ucc?: string; pan_holders?: string[]; holding_nature?: string };
  member: string;
  mem_details?: MemDetails;
  scheme: string;
  dest_scheme?: string;
  amount: number;
  cur: 'INR';
  is_units: boolean;
  all_units: boolean;
  min_redeem_flag: boolean;
  folio: string;
  dst_folio?: string;
  is_fresh: boolean;
  phys_or_demat: PhysOrDemat;
  src?: string;
  holder: OrderHolder[];
  email: string;
  mobnum: string;
  kyc_passed: boolean;
  dpc: boolean;
  payment_ref_id?: string;
  exch_mandate_id?: number | null;
  is_nomination_opted: boolean;
  nomination_auth_mode?: string;
  nominee_soa?: boolean;
  nomination?: OrderNomination[];
  depository_acct?: DepositoryAcct;
  bank_acct?: BankAcct;
}

export interface OrderListFilter {
  open_close?: 'o' | 'c';
  order_src_type?: string[];
  status?: string[];
  type?: string[];
  ucc?: string[];
  amc_code?: string;
  placed_at_after?: string;
  placed_at_before?: string;
}
