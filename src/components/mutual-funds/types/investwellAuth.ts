// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface InvestwellAuthRequest {
  authName: string;
  password: string;
}

export interface InvestwellAuthResponse {
  status: number;
  message: string;
  result: {
    token: string;
  };
}

export interface SignInRequest {
  token: string;
  userName: string;
  password: string;
}

export interface SignInResponse {
  status: number;
  message: string;
  result?: Record<string, unknown>;
}

export interface StoredInvestwellToken {
  token: string;
  generated_at: string;
}

// ─── Create Client ────────────────────────────────────────────────────────────
export interface InvestwellClient {
  // mandatory
  name: string;
  pan: string;
  username: string;
  // optional
  mobile?: string;
  email?: string;
  dob?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  country?: string;
  pin?: string;
  appCode?: string;
  equityCode1?: string;
  levelName?: string;
  userBusinessCode?: string;
  fhUsername?: string;
}

export interface CreateClientsRequest {
  token: string;
  clients: InvestwellClient[];
}

export interface CreateClientsResponse {
  status: number;
  message: string;
}

// ─── Local user store (localStorage until Supabase) ──────────────────────────
export interface LocalUser {
  name: string;
  email: string;
  mobile: string;
  pan: string;
  username: string;
  password: string;       // stored locally until Supabase
  dob: string;
  city: string;
  state: string;
  registered_at: string;
}
