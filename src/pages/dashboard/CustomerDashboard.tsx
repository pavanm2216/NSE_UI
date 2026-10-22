import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Clock, 
  CheckCircle2,
  ArrowRight,
  FileText,
  Calculator,
  Building,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Total Investments', value: '₹70,000', change: '+₹7,600', trend: 'up', icon: PieChart },
  { label: 'Total Borrowed', value: '₹15,00,000', change: '+₹5,00,000', trend: 'up', icon: TrendingUp },
  { label: 'Monthly EMI', value: '₹45,000', change: '-₹2,000', trend: 'down', icon: Clock },
  { label: 'Total Returns', value: '+₹7,600', change: '+10.86%', trend: 'up', icon: CheckCircle2 },
];

const investments = [
  { id: 1, name: 'Equity Growth Fund', type: 'Mutual Fund', invested: '₹25,000', current: '₹28,500', returns: '+₹3,500', returnPct: '+14%', positive: true },
  { id: 2, name: 'Corporate Bond Fund', type: 'Debt Fund', invested: '₹15,000', current: '₹15,900', returns: '+₹900', returnPct: '+6%', positive: true },
  { id: 3, name: 'Gold ETF', type: 'Commodity', invested: '₹10,000', current: '₹10,800', returns: '+₹800', returnPct: '+8%', positive: true },
  { id: 4, name: 'Nifty 50 Index Fund', type: 'Index Fund', invested: '₹20,000', current: '₹22,400', returns: '+₹2,400', returnPct: '+12%', positive: true },
];

const loans = [
  { id: 1, type: 'Home Loan', bank: 'HDFC Bank', amount: '₹50,00,000', emi: '₹42,000', status: 'active', remaining: '18 yrs' },
  { id: 2, type: 'Personal Loan', bank: 'ICICI Bank', amount: '₹3,00,000', emi: '₹3,000', status: 'active', remaining: '2 yrs' },
  { id: 3, type: 'Car Loan', bank: 'Axis Bank', amount: '₹8,00,000', emi: '₹14,500', status: 'in_review', remaining: '4 yrs' },
  { id: 4, type: 'Education Loan', bank: 'SBI', amount: '₹5,00,000', emi: '₹5,200', status: 'closed', remaining: 'Closed' },
];

const loanOffers = [
  { bank: 'SBI', type: 'Personal Loan', rate: '10.5%', amount: 'Up to ₹25L', featured: true },
  { bank: 'HDFC', type: 'Home Loan', rate: '8.5%', amount: 'Up to ₹5Cr', featured: false },
  { bank: 'Kotak', type: 'Business Loan', rate: '12%', amount: 'Up to ₹75L', featured: false },
];

const statusColors: Record<string, string> = {
  active: 'bg-success/10 text-success',
  in_review: 'bg-info/10 text-info',
  closed: 'bg-muted text-muted-foreground',
};

const statusLabels: Record<string, string> = {
  active: 'Active',
  in_review: 'In Review',
  closed: 'Closed',
};

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">Here's your financial overview</p>
        </div>
       <div className="flex gap-2">
  <Button
    asChild
    className="
      bg-[#1E3A6D]
      text-white
      border-0
      hover:bg-[#16305A]
      transition-colors
      duration-200
    "
  >
    <Link to="/mf-login">Mutual Funds</Link>
  </Button>
          <Button className="gradient-primary text-primary-foreground" asChild>
            <Link to="/dashboard/apply-loan">
              Apply for Loan
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="card-hover">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1 number-display">{stat.value}</p>
                    <p className={`text-xs mt-1 ${
                      stat.trend === 'up' ? 'text-success' : 
                      stat.trend === 'down' ? 'text-destructive' : 
                      'text-muted-foreground'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Investments + Loans stacked vertically */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Investments Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                <CardTitle>Investments</CardTitle>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/investment">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {investments.map((inv) => (
                  <motion.div
                    key={inv.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: inv.id * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{inv.name}</p>
                        <p className="text-xs text-muted-foreground">{inv.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-right">
                      <div className="hidden sm:block">
                        <p className="text-xs text-muted-foreground">Invested</p>
                        <p className="text-sm font-medium">{inv.invested}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Current</p>
                        <p className="text-sm font-semibold">{inv.current}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {inv.positive
                          ? <ArrowUpRight className="w-4 h-4 text-green-500" />
                          : <ArrowDownRight className="w-4 h-4 text-red-500" />}
                        <span className={`text-sm font-semibold ${inv.positive ? 'text-green-600' : 'text-red-500'}`}>
                          {inv.returnPct}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Loans Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <CardTitle>Loans</CardTitle>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/customer-loans">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loans.map((loan) => (
                  <motion.div
                    key={loan.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: loan.id * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{loan.type}</p>
                        <p className="text-xs text-muted-foreground">{loan.bank}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div className="hidden sm:block">
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="text-sm font-medium">{loan.amount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">EMI/mo</p>
                        <p className="text-sm font-semibold">{loan.emi}</p>
                      </div>
                      <Badge className={statusColors[loan.status]}>
                        {statusLabels[loan.status]}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Loan Offers */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Personalized Offers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loanOffers.map((offer, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border ${
                      offer.featured ? 'border-gold bg-gold/5' : 'border-border'
                    }`}
                  >
                    {offer.featured && (
                      <Badge className="bg-gold text-gold-foreground mb-2">Featured</Badge>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{offer.bank}</span>
                      <span className="text-success font-semibold">{offer.rate}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{offer.type}</p>
                    <p className="text-sm font-medium mt-1">{offer.amount}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: Calculator, title: 'EMI Calculator', desc: 'Calculate your monthly EMI', href: '/dashboard/calculator' },
          { icon: Building, title: 'Compare Lenders', desc: 'Find the best rates', href: '/dashboard/compare' },
          { icon: FileText, title: 'Documents', desc: 'Manage your documents', href: '/dashboard/documents' },
        ].map((action, index) => (
          <Link key={index} to={action.href}>
            <Card className="card-hover cursor-pointer">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <action.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{action.title}</p>
                  <p className="text-sm text-muted-foreground">{action.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CustomerDashboard;
