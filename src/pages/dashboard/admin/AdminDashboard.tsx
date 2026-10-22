import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  CreditCard,
  Crown,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Shield,
  HelpCircle,
  Settings,
  FileCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { formatINR } from '@/constants/membership.constants';

const formatCompactINR = (amount: number) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return formatINR(amount);
};

const TrendIcon = ({ value }: { value: number }) =>
  value >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />;

const statusBadgeClass = (status: string) => {
  const s = status.toUpperCase();
  if (s === 'PAID') return 'bg-success/10 text-success';
  if (['FAILED', 'EXPIRED'].includes(s)) return 'bg-destructive/10 text-destructive';
  if (['CANCELLED', 'USER_DROPPED'].includes(s)) return 'bg-warning/10 text-warning';
  return 'bg-muted text-muted-foreground';
};

const healthBadgeClass = (color: string) => {
  if (color === 'success') return 'bg-success/10 text-success';
  if (color === 'warning') return 'bg-warning/10 text-warning';
  return 'bg-destructive/10 text-destructive';
};

// ── Static mock data ──────────────────────────────────────────────────────────
const mockStats = {
  users: { total: 52450, change_percent: 4.7, new_this_month: 2340 },
  subscriptions: { active: 1820, change_percent: 8.2, new_this_month: 138 },
  payments: {
    total_volume: 45000000,
    revenue_this_month: 4500000,
    revenue_change_percent: 18.5,
    paid_count: 1820,
    pending_count: 43,
    failed_count: 27,
    cancelled_count: 12,
  },
  plans: [
    { plan_code: 'ANGEL', plan_name: 'Angel Wealth League', paid_count: 820, revenue: 16400000 },
    { plan_code: 'PRIVY', plan_name: 'Privy Alpha Circle', paid_count: 640, revenue: 19200000 },
    { plan_code: 'PRIVATE', plan_name: 'Private Wealth League', paid_count: 360, revenue: 9400000 },
  ],
  system_health: [
    { component: 'Auth Service', status: 'Operational', uptime: '99.9%', color: 'success' },
    { component: 'Payment Gateway', status: 'Operational', uptime: '99.7%', color: 'success' },
    { component: 'KYC Service', status: 'Degraded', uptime: '97.2%', color: 'warning' },
    { component: 'Database', status: 'Operational', uptime: '100%', color: 'success' },
  ],
  overview: {
    active_subscriptions: 1820,
    total_customers: 52450,
    kyc_completion_rate: 74,
    payment_success_rate: 96,
  },
  kyc: { profiles: 38820, documents: 71340 },
};

const mockActivity = [
  { type: 'registration', message: 'New user registered: Rahul Kumar', timestamp: new Date(Date.now() - 2 * 60000).toISOString(), payment_status: undefined },
  { type: 'payment', message: 'Payment received: ₹20,000 — Angel Wealth League', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), payment_status: 'PAID' },
  { type: 'registration', message: 'KYC verified for 12 users', timestamp: new Date(Date.now() - 45 * 60000).toISOString(), payment_status: undefined },
  { type: 'payment', message: 'Payment failed: ₹45,000 — Privy Alpha Circle', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), payment_status: 'FAILED' },
  { type: 'registration', message: 'New user registered: Priya Sharma', timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), payment_status: undefined },
  { type: 'payment', message: 'Refund processed: ₹20,000', timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), payment_status: 'CANCELLED' },
];

const mockPayments = [
  { order_id: 'ORD-001', user_name: 'Rahul Kumar', user_email: 'rahul@example.com', payment_status: 'PAID', plan_name: 'Angel Wealth League', plan_code: 'ANGEL', amount: 20000, payment_method: 'UPI' },
  { order_id: 'ORD-002', user_name: 'Priya Sharma', user_email: 'priya@example.com', payment_status: 'PAID', plan_name: 'Privy Alpha Circle', plan_code: 'PRIVY', amount: 30000, payment_method: 'Net Banking' },
  { order_id: 'ORD-003', user_name: 'Amit Verma', user_email: 'amit@example.com', payment_status: 'FAILED', plan_name: 'Private Wealth League', plan_code: 'PRIVATE', amount: 45000, payment_method: 'Card' },
  { order_id: 'ORD-004', user_name: 'Sneha Patel', user_email: 'sneha@example.com', payment_status: 'PAID', plan_name: 'Angel Wealth League', plan_code: 'ANGEL', amount: 20000, payment_method: 'UPI' },
  { order_id: 'ORD-005', user_name: 'Kiran Rao', user_email: 'kiran@example.com', payment_status: 'CANCELLED', plan_name: 'Privy Alpha Circle', plan_code: 'PRIVY', amount: 30000, payment_method: 'Card' },
];

const timeAgo = (timestamp: string) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const activityIcon = (type: string) => {
  if (type === 'payment') return CreditCard;
  if (type === 'registration') return Users;
  return Shield;
};

const activityColor = (type: string, paymentStatus?: string) => {
  if (type === 'registration') return 'text-info';
  if (type === 'payment') {
    if (paymentStatus === 'PAID') return 'text-success';
    if (['FAILED', 'CANCELLED', 'USER_DROPPED'].includes(paymentStatus || '')) return 'text-warning';
  }
  return 'text-primary';
};

// ── Component ─────────────────────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
  const stats = mockStats;

  const platformStats = [
    { label: 'Total Clients', value: stats.users.total.toLocaleString('en-IN'), change: `+${stats.users.change_percent}% this month`, trend: 'up', icon: Users, href: '/dashboard/users' },
    { label: 'Active Subscriptions', value: stats.subscriptions.active.toLocaleString('en-IN'), change: `+${stats.subscriptions.change_percent}% this month`, trend: 'up', icon: Crown, href: '/dashboard/admin-payments?status=PAID' },
    { label: 'Payment Volume', value: formatCompactINR(stats.payments.total_volume), change: `+${stats.payments.revenue_change_percent}% this month`, trend: 'up', icon: TrendingUp, href: '/dashboard/admin-payments' },
    { label: 'Revenue (This Month)', value: formatCompactINR(stats.payments.revenue_this_month), change: `${stats.payments.paid_count} paid orders`, trend: 'up', icon: BarChart3, href: '/dashboard/admin-payments?status=PAID' },
  ];

  const quickActions = [
    { title: 'User Management', description: 'Manage platform users', icon: Users, color: 'bg-primary', href: '/dashboard/users' },
    { title: 'Payment Transactions', description: 'View Cashfree payments', icon: CreditCard, color: 'bg-success', href: '/dashboard/admin-payments' },
    { title: 'View Analytics', description: 'Platform performance metrics', icon: BarChart3, color: 'bg-info', href: '/dashboard/analytics' },
    { title: 'System Settings', description: 'Configure platform', icon: Settings, color: 'bg-warning', href: '/dashboard/admin-settings' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/dashboard/admin-help">
              <HelpCircle className="mr-2 w-4 h-4" />
              Support Center
            </Link>
          </Button>
          <Button className="gradient-primary text-primary-foreground" asChild>
            <Link to="/dashboard/admin-payments">
              <CreditCard className="mr-2 w-4 h-4" />
              View Payments
            </Link>
          </Button>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {platformStats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
            <Link to={stat.href}>
              <Card className="card-hover cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1 number-display">{stat.value}</p>
                      <div className="flex items-center gap-1 text-xs mt-1 text-success">
                        <TrendIcon value={1} />
                        {stat.change}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Payment summary strip */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Gateway Overview
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Cashfree transactions · {stats.payments.paid_count} paid · {stats.payments.pending_count} pending · {stats.payments.failed_count} failed · {stats.payments.cancelled_count} cancelled
              </p>
            </div>
            <Button asChild>
              <Link to="/dashboard/admin-payments">Check All Payments</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.href}>
                <div className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer h-full">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${action.color}/10 flex items-center justify-center shrink-0`}>
                      <action.icon className={`w-5 h-5 ${action.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div>
                      <h4 className="font-medium">{action.title}</h4>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Payments */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Payments</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/admin-payments">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPayments.map((payment) => (
                  <div key={payment.order_id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-medium truncate">{payment.user_name || payment.user_email}</p>
                        <Badge className={statusBadgeClass(payment.payment_status)}>{payment.payment_status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {payment.plan_name} · <span className="font-mono text-xs">{payment.order_id}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-success">{formatINR(payment.amount)}</p>
                      <p className="text-xs text-muted-foreground">{payment.payment_method}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Plan performance */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Membership Plan Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.plans.map((plan) => (
                  <div key={plan.plan_code} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{plan.plan_name}</p>
                      <p className="text-sm text-muted-foreground">{plan.plan_code} · {plan.paid_count} paid orders</p>
                    </div>
                    <p className="font-semibold text-success">{formatINR(plan.revenue)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Health & Activities */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.system_health.map((system) => (
                  <div key={system.component} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{system.component}</p>
                      <p className="text-sm text-muted-foreground">Uptime: {system.uptime}</p>
                    </div>
                    <Badge className={healthBadgeClass(system.color)}>{system.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivity.map((activity, index) => {
                  const Icon = activityIcon(activity.type);
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <Icon className={`w-4 h-4 ${activityColor(activity.type, activity.payment_status)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{timeAgo(activity.timestamp)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Platform Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stats.overview.active_subscriptions}</div>
              <div className="text-sm text-muted-foreground">Active Subscriptions</div>
              <div className="text-xs text-success mt-1">+{stats.subscriptions.new_this_month} this month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">{stats.overview.total_customers.toLocaleString('en-IN')}</div>
              <div className="text-sm text-muted-foreground">Registered Clients</div>
              <div className="text-xs text-success mt-1">+{stats.users.new_this_month} this month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning mb-2">{stats.overview.kyc_completion_rate}%</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <FileCheck className="w-3 h-3" /> KYC Profile Rate
              </div>
              <div className="text-xs text-muted-foreground mt-1">{stats.kyc.profiles.toLocaleString('en-IN')} profiles · {stats.kyc.documents.toLocaleString('en-IN')} docs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-info mb-2">{stats.overview.payment_success_rate}%</div>
              <div className="text-sm text-muted-foreground">Payment Success Rate</div>
              <div className="text-xs text-muted-foreground mt-1">{stats.payments.paid_count} successful payments</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
