import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield } from 'lucide-react';
import { formatINR } from '@/constants/membership.constants';

interface PaymentResultLayoutProps {
  children: React.ReactNode;
  amount?: number | null;
}

const PaymentResultLayout: React.FC<PaymentResultLayoutProps> = ({ children, amount }) => (
  <div className="flex items-center justify-center py-8">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg w-full text-center space-y-6 p-8 rounded-2xl border border-border bg-card shadow-sm"
    >
      {children}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
        <Lock className="w-3 h-3" />
        <Shield className="w-3 h-3" />
        Secured by Cashfree
        {amount != null && <span>· {formatINR(amount)}</span>}
      </div>
    </motion.div>
  </div>
);

export default PaymentResultLayout;
