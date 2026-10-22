import type { User, UserRole } from '@/types/user.types';

export const STORAGE_KEY = 'lendrix_user';
export const TOKEN_KEY = 'lendrix_access_token';
export const REFRESH_KEY = 'lendrix_refresh_token';
export const SESSION_TIMEOUT_MS = 10 * 60 * 1000;

export const apiRoleMap: Record<string, UserRole> = {
  angel: 'admin',
  compliance: 'riskCompliance',
  compliance_team: 'riskCompliance',
  dsa: 'dsa',
  team_access: 'dsa',
  broker: 'broker',
  consultant: 'consultant',
  customer: 'customer',
  investor: 'investor',
  trader: 'trader',
};

export const labelToApiRole: Record<string, string> = {
  "Angel & VC's": 'angel',
  'Compliance Team': 'compliance_team',
  'Lendrix Team Access': 'team_access',
  'Authorized Person': 'broker',
  Consultant: 'consultant',
};

export const mockUsers: Record<UserRole, User> = {
  customer: {
    id: '1',
    name: 'John Customer',
    email: 'john@example.com',
    role: 'customer',
    isVerified: true,
    customerTier: 'normal',
  },
  investor: {
    id: '2',
    name: 'Sarah Investor',
    email: 'sarah@example.com',
    role: 'investor',
    isVerified: true,
  },
  broker: {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com',
    role: 'broker',
    isVerified: true,
  },
  consultant: {
    id: '4',
    name: 'Emma',
    email: 'emma@example.com',
    role: 'consultant',
    isVerified: true,
  },
  admin: {
    id: '5',
    name: 'Admin',
    email: 'admin@example.com',
    role: 'admin',
    isVerified: true,
  },
  dsa: {
    id: '6',
    name: 'Staff',
    email: 'staff@example.com',
    role: 'dsa',
    isVerified: true,
  },
  trader: {
    id: '7',
    name: 'Bhumpall Trader',
    email: 'trader@5paisa.com',
    role: 'trader',
    isVerified: true,
  },
  riskCompliance: {
    id: '8',
    name: 'Risk Compliance',
    email: 'risk@example.com',
    role: 'riskCompliance',
    isVerified: true,
  },
  riskCompliance2: {
    id: '9',
    name: 'Bob Compliance',
    email: 'risk2@lendrix.com',
    role: 'riskCompliance2',
    isVerified: true,
  },
};

export const roleLabels: Record<UserRole, string> = {
  customer: 'Customer',
  investor: 'Investor',
  broker: 'Broker',
  consultant: 'Consultant',
  admin: 'Admin',
  dsa: 'Lendrix Team',
  trader: 'Trader',
  riskCompliance: 'Risk and Compliance (Alice)',
  riskCompliance2: 'Risk and Compliance (Bob)',
};

export const roleColors: Record<UserRole, string> = {
  customer: 'bg-info/10 text-info',
  investor: 'bg-success/10 text-success',
  broker: 'bg-warning/10 text-warning',
  consultant: 'bg-accent/10 text-accent',
  admin: 'bg-primary/10 text-primary',
  dsa: 'bg-gold/10 text-gold',
  trader: 'bg-blue-500/10 text-blue-600',
  riskCompliance: 'bg-red-500/10 text-red-600',
  riskCompliance2: 'bg-red-500/10 text-red-600',
};
