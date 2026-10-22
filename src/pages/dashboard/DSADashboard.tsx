import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  CreditCard, 
  Wallet, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  FileText,
  Phone,
  Mail,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import SOPChatbot from '@/components/dashboard/SOPChatbot';

const stats = [
  { label: 'Total Leads', value: '245', change: '+28 this week', trend: 'up', icon: Users },
  { label: 'Converted', value: '78', change: '+12 this month', trend: 'up', icon: Target },
  { label: 'Total Commission', value: '₹4,85,000', change: '+₹65,000', trend: 'up', icon: Wallet },
  { label: 'Conversion Rate', value: '31.8%', change: '+3.2%', trend: 'up', icon: TrendingUp },
];

const pipelineData = [
  { stage: 'New Leads', count: 45, color: 'bg-info' },
  { stage: 'Documents Pending', count: 32, color: 'bg-warning' },
  { stage: 'Under Review', count: 28, color: 'bg-primary' },
  { stage: 'Approved', count: 18, color: 'bg-success' },
  { stage: 'Disbursed', count: 12, color: 'bg-gold' },
];

const recentLeads = [
  { 
    name: 'Rajesh Kumar',
    loanType: 'Home Loan',
    amount: '₹45,00,000',
    status: 'new',
    phone: '+91 98765 43210',
    date: '2 hours ago'
  },
  { 
    name: 'Priya Sharma',
    loanType: 'Personal Loan',
    amount: '₹5,00,000',
    status: 'documents',
    phone: '+91 87654 32109',
    date: '5 hours ago'
  },
  { 
    name: 'Amit Patel',
    loanType: 'Business Loan',
    amount: '₹25,00,000',
    status: 'review',
    phone: '+91 76543 21098',
    date: '1 day ago'
  },
  { 
    name: 'Sneha Gupta',
    loanType: 'Car Loan',
    amount: '₹8,00,000',
    status: 'approved',
    phone: '+91 65432 10987',
    date: '2 days ago'
  },
];

const recentPayouts = [
  { loanType: 'Home Loan', borrower: 'Vikram Singh', amount: '₹45,000', date: 'Jan 20, 2024' },
  { loanType: 'Business Loan', borrower: 'Pooja Mehta', amount: '₹25,000', date: 'Jan 18, 2024' },
  { loanType: 'Personal Loan', borrower: 'Arun Sharma', amount: '₹5,000', date: 'Jan 15, 2024' },
];

const statusColors: Record<string, string> = {
  new: 'bg-info/10 text-info',
  documents: 'bg-warning/10 text-warning',
  review: 'bg-primary/10 text-primary',
  approved: 'bg-success/10 text-success',
  rejected: 'bg-destructive/10 text-destructive',
};

const statusLabels: Record<string, string> = {
  new: 'New Lead',
  documents: 'Docs Pending',
  review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
};

const DSADashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">agent Dashboard</h1>
          <p className="text-muted-foreground">Track leads and commissions</p>
        </div>
        <Button className="gradient-primary text-primary-foreground" asChild>
          <Link to="/dashboard/add-lead">
            <Plus className="mr-2 w-4 h-4" />
            Add New Lead
          </Link>
        </Button>
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
                    <div className="flex items-center gap-1 text-xs mt-1 text-success">
                      <ArrowUpRight className="w-3 h-3" />
                      {stat.change}
                    </div>
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

      {/* Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            {pipelineData.map((stage, index) => (
              <div key={index} className="flex-1">
                <div className={`h-2 rounded-full ${stage.color}`} />
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            {pipelineData.map((stage, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl font-bold">{stage.count}</p>
                <p className="text-xs text-muted-foreground">{stage.stage}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Leads</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/leads">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLeads.map((lead, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{lead.name}</p>
                        <Badge className={statusColors[lead.status]}>
                          {statusLabels[lead.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{lead.loanType} • {lead.amount}</p>
                      <p className="text-xs text-muted-foreground mt-1">{lead.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Payouts */}
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Payouts</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/payouts">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayouts.map((payout, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-sm">{payout.loanType}</p>
                      <p className="text-xs text-muted-foreground">{payout.borrower}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-success">{payout.amount}</p>
                      <p className="text-xs text-muted-foreground">{payout.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Commission Summary */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Commission Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="font-bold text-success">₹65,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-bold text-warning">₹28,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Earned</span>
                  <span className="font-bold">₹4,85,000</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline" asChild>
                <Link to="/dashboard/commission">
                  View Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    <SOPChatbot />
    </>
  );
};

export default DSADashboard;
