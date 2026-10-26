export type UserRole =
  | 'customer'
  | 'investor'
  | 'broker'
  | 'consultant'
  | 'admin'
  | 'dsa'
  | 'trader'
  | 'riskCompliance'
  | 'riskCompliance2';

export type CustomerTier = 'normal' | 'premium';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  customerTier?: CustomerTier;
}
