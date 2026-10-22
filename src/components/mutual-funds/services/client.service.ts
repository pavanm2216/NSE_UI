import iwAxios from '@/api/axios';

export interface Client {
  name:        string;
  mobile:      string;
  pan:         string;
  email:       string;
  username:    string;
  address:     string;
  city:        string;
  aum:         number;
  createdAt:   string;
  updatedAt:   string;
  familyHead?: string;
  source?:     string;
  iwellCode:   number;
  iwellCode2:  string;
  lastLogin?:  string | null;
  dob?:        string | null;
}

export interface ClientResponse {
  data:        Client[];
  totalNoRows: number;
  noOfPages:   number;
  currentPage: number;
  pageSize:    number;
}

export type ClientFilters =
  | { pan: string }
  | { mobile: string }
  | { email: string }
  | { username: string }
  | { name: string }
  | { dateType: string; fromDate: string; toDate: string; showFamilyHead?: boolean };

export async function fetchClients(
  filters: ClientFilters[],
  pageSize  = 20,
  currentPage = 1
): Promise<ClientResponse> {
  const filtersStr = JSON.stringify(filters);

  console.log(
    '==========================\nInvestwell Client API Request\n==========================',
    '\nURL:',         '/broker/getClients',
    '\nfilters:',     filtersStr,
    '\npageSize:',    pageSize,
    '\ncurrentPage:', currentPage,
  );

  try {
    const { data: json } = await iwAxios.get('/broker/getClients', {
      params: { filters: filtersStr, pageSize, currentPage },
    });

    console.log(
      '==========================\nInvestwell Client API Response\n==========================',
      '\nstatus:',  json.status,
      '\nmessage:', json.message,
      '\ntotal:',   json.result?.totalNoRows,
    );

    if (json.status !== 0) throw Object.assign(new Error(json.message || 'API error'), { kind: 'API_ERROR' });
    return json.result as ClientResponse;

  } catch (axiosErr: any) {
    const res  = axiosErr?.response;
    const body = res?.data;

    console.error(
      '==========================\nInvestwell Client API Error\n==========================',
      '\nURL:',         '/broker/getClients',
      '\nHTTP Status:', res?.status,
      '\nfilters:',     filtersStr,
      '\npageSize:',    pageSize,
      '\ncurrentPage:', currentPage,
      '\nToken Exists:', !!(axiosErr?.config?.headers?.token),
      '\nResponse:',    JSON.stringify(body),
    );

    if (axiosErr.kind) throw axiosErr;
    const msg = body?.message || axiosErr.message || 'Unknown error';
    const lower = (msg as string).toLowerCase();
    if (lower.includes('client not found') || lower.includes('not found'))
      throw Object.assign(new Error(msg), { kind: 'NOT_FOUND' });
    if (res?.status === 401 || res?.status === 403)
      throw Object.assign(new Error(msg), { kind: 'UNAUTHORIZED' });
    if (!res)
      throw Object.assign(new Error('Unable to connect to Investwell.'), { kind: 'NETWORK_ERROR' });
    throw Object.assign(new Error(msg), { kind: 'API_ERROR' });
  }
}

// UTC → IST
export function toIST(utc: string | null | undefined): string {
  if (!utc) return '—';
  try {
    const d = new Date(utc);
    if (isNaN(d.getTime())) return utc;
    return new Date(d.getTime() + 5.5 * 60 * 60 * 1000)
      .toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return utc; }
}
