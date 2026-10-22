const BSE_TOKEN_KEY = 'bse_access_token';
let _token: string | null = sessionStorage.getItem(BSE_TOKEN_KEY);

export interface BSEMessage {
  msgid?: number;
  errcode?: string;
  field?: string;
  vals?: string[];
}

export interface BSELoginResponse {
  status: string;
  data?: {
    access_token?: string;
    member_id?: string;
    expires_in?: number;
  };
  messages?: BSEMessage[] | string[] | null;
  error?: string;
  message?: string;
}

export async function loginToBSE(username: string, password: string): Promise<string> {
  if (!username || !username.trim()) throw new Error('Username is required');
  if (!password || !password.trim()) throw new Error('Password is required');

  try {
    const response = await fetch('/bse-api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        data: { username, password },
      }),
    });

    if (!response.ok) {
      let errorData: any = {};
      try { errorData = await response.json(); } catch { /* ignore */ }
      throw new Error(extractBSEError(errorData) || `HTTP ${response.status}`);
    }

    const result: BSELoginResponse = await response.json();

    // BSE returns data.access_token
    const token = result.data?.access_token;
    if (!token) {
      throw new Error(extractBSEError(result) || 'BSE authentication failed - no access token');
    }

    _token = token;
    sessionStorage.setItem(BSE_TOKEN_KEY, token);
    return _token;
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) throw new Error('Invalid BSE credentials');
      if (err.message.includes('Failed to fetch')) throw new Error('Unable to connect to BSE. Please try again.');
      throw err;
    }
    throw new Error('Something went wrong');
  }
}

/** Safely extract a human-readable error string from any BSE response shape */
function extractBSEError(data: any): string {
  if (!data) return '';
  // Plain string error
  if (typeof data.error === 'string' && data.error) return data.error;
  if (typeof data.message === 'string' && data.message) return data.message;
  // messages array — each item may be a string or a BSE error object
  if (Array.isArray(data.messages) && data.messages.length > 0) {
    const first = data.messages[0];
    if (typeof first === 'string') return first;
    if (typeof first === 'object' && first !== null) {
      // { msgid, errcode, field, vals }
      const parts: string[] = [];
      if (first.errcode) parts.push(first.errcode);
      if (first.field)   parts.push(`field: ${first.field}`);
      if (Array.isArray(first.vals) && first.vals.length) parts.push(`(${first.vals.join(', ')})`);
      return parts.join(' — ') || JSON.stringify(first);
    }
  }
  return '';
}

export function getBSEToken(): string | null {
  return _token;
}

export function isBSEConnected(): boolean {
  return _token !== null;
}

export function clearBSEToken(): void {
  _token = null;
  sessionStorage.removeItem(BSE_TOKEN_KEY);
}
