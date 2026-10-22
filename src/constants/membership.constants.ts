export const CLIENT_TOKEN_KEY = 'lendrix_client_access_token';
export const CLIENT_REFRESH_KEY = 'lendrix_client_refresh_token';
export const SELECTED_PLAN_KEY = 'lendrix_selected_plan';
export const PENDING_ORDER_KEY = 'lendrix_pending_order_id';

export const getClientAccessToken = (): string | null =>
  localStorage.getItem(CLIENT_TOKEN_KEY);

export const formatINR = (amount: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export const PLAN_VISUALS: Record<
  string,
  { iconName: 'crown' | 'trending' | 'shield'; iconBg: string }
> = {
  PAC: { iconName: 'crown', iconBg: 'from-[#2A938F] to-[#1a6b68]' },
  AWL: { iconName: 'trending', iconBg: 'from-[#1E3A6D] to-[#2d6be4]' },
  PWL: { iconName: 'shield', iconBg: 'from-[#2A938F] to-[#1E3A6D]' },
};

export const DEFAULT_PLAN_VISUAL = {
  iconName: 'crown' as const,
  iconBg: 'from-[#2A938F] to-[#1E3A6D]',
};
