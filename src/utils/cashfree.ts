type CashfreeMode = 'sandbox' | 'production';
type CashfreeRedirectTarget = '_self' | '_blank' | '_modal';

export interface CashfreeCheckoutResult {
  error?: { message?: string };
  redirect?: boolean;
  paymentDetails?: { paymentMessage?: string };
}

interface CashfreeCheckoutInstance {
  checkout: (options: {
    paymentSessionId: string;
    redirectTarget?: CashfreeRedirectTarget;
  }) => Promise<CashfreeCheckoutResult>;
}

declare global {
  interface Window {
    Cashfree?: (config: { mode: CashfreeMode }) => CashfreeCheckoutInstance;
  }
}

const SDK_URL = 'https://sdk.cashfree.com/js/v3/cashfree.js';

let sdkPromise: Promise<void> | null = null;

export const loadCashfreeSdk = (): Promise<void> => {
  if (window.Cashfree) return Promise.resolve();
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SDK_URL}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Cashfree SDK')));
      return;
    }

    const script = document.createElement('script');
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
    document.body.appendChild(script);
  });

  return sdkPromise;
};

export const getCashfreeMode = (): CashfreeMode => {
  const mode = (import.meta.env.VITE_CASHFREE_MODE || 'sandbox').toLowerCase();
  return mode === 'production' ? 'production' : 'sandbox';
};

const getCheckoutRedirectTarget = (): CashfreeRedirectTarget => {
  const target = (import.meta.env.VITE_CASHFREE_CHECKOUT_TARGET || '_modal').toLowerCase();
  if (target === '_self' || target === '_blank' || target === '_modal') {
    return target;
  }
  return '_modal';
};

export const openCashfreeCheckout = async (
  paymentSessionId: string
): Promise<CashfreeCheckoutResult> => {
  await loadCashfreeSdk();
  if (!window.Cashfree) {
    throw new Error('Cashfree SDK is not available');
  }

  const cashfree = window.Cashfree({ mode: getCashfreeMode() });
  const result = await cashfree.checkout({
    paymentSessionId,
    redirectTarget: getCheckoutRedirectTarget(),
  });

  return result ?? {};
};
