export const getMutationErrorMessage = (error: unknown, fallback: string): string => {
  if (!error || typeof error !== 'object') {
    return error instanceof Error ? error.message : fallback;
  }

  if ('data' in error) {
    const { data } = error as { data?: unknown };
    if (typeof data === 'object' && data !== null) {
      const body = data as { detail?: string; message?: string };
      if (body.detail) return String(body.detail);
      if (body.message) return String(body.message);
    }
    if (typeof data === 'string' && data.trim()) {
      return data;
    }
  }

  if ('status' in error) {
    const status = (error as { status?: number | string }).status;
    if (status === 401 || status === 'FETCH_ERROR') {
      return 'Unable to reach the payment server. Check that the client API is running and you are signed in.';
    }
  }

  if ('message' in error && typeof (error as { message: unknown }).message === 'string') {
    const message = (error as { message: string }).message;
    if (message && message !== 'Rejected') return message;
  }

  return fallback;
};
