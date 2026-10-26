export interface ChangePasswordRequest {
  role: string;
  email: string;
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordResponse {
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  email: string;
  full_name: string;
  role: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

export interface AuthApiError {
  message: string;
}

interface AuthErrorBody {
  detail?: string | Array<{ msg?: string }>;
  message?: string;
}

const isAuthErrorBody = (data: unknown): data is AuthErrorBody =>
  typeof data === 'object' && data !== null;

const parseAuthError = (
  response: { data?: unknown },
  fallback = 'Invalid credentials. Please try again.'
): { message: string } => {
  const { data } = response;

  if (isAuthErrorBody(data)) {
    const detail = data.detail;
    if (typeof detail === 'string') {
      return { message: detail };
    }
    if (Array.isArray(detail)) {
      return {
        message: detail.map((d) => d?.msg || JSON.stringify(d)).join(', '),
      };
    }
    if (data.message) {
      return { message: data.message };
    }
  }

  if (typeof data === 'string' && data.trim()) {
    return { message: data };
  }

  return { message: fallback };
};

export { parseAuthError };
