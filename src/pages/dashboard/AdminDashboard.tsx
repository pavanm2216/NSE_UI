import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  CreditCard, 
  Building2, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Shield,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Total Users', value: '52,450', change: '+2,340', trend: 'up', icon: Users },
  { label: 'Active Loans', value: '₹1,245 Cr', change: '+₹125 Cr', trend: 'up', icon: CreditCard },
  { label: 'Properties Listed', value: '5,230', change: '+320', trend: 'up', icon: Building2 },
  { label: 'Monthly Revenue', value: '₹4.5 Cr', change: '+18.5%', trend: 'up', icon: TrendingUp },
];

const systemHealth = [
  { name: 'API Response Time', value: 45, unit: 'ms', status: 'good' },
  { name: 'Database Load', value: 62, unit: '%', status: 'moderate' },
  { name: 'Active Sessions', value: 1250, unit: '', status: 'good' },
  { name: 'Error Rate', value: 0.02, unit: '%', status: 'good' },
];

const recentActivities = [
  { type: 'user', message: 'New user registered: Rahul Kumar', time: '2 min ago' },
  { type: 'loan', message: 'Loan application approved: ₹15L Home Loan', time: '15 min ago' },
  { type: 'property', message: 'New property listed in Mumbai', time: '32 min ago' },
  { type: 'alert', message: 'High traffic detected on /api/loans', time: '1 hour ago' },
  { type: 'user', message: 'KYC verified for 25 users', time: '2 hours ago' },
];

const pendingApprovals = [
  { type: 'Property Listing', count: 12, priority: 'high' },
  { type: 'Loan Applications', count: 45, priority: 'high' },
  { type: 'KYC Verification', count: 28, priority: 'medium' },
  { type: 'Consultant Applications', count: 8, priority: 'low' },
];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/dashboard/reports">
              <BarChart3 className="mr-2 w-4 h-4" />
              Reports
            </Link>
          </Button>
          <Button className="gradient-primary text-primary-foreground" asChild>
            <Link to="/dashboard/settings">
              <Settings className="mr-2 w-4 h-4" />
              Settings
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
                    <div className={`flex items-center gap-1 text-xs mt-1 text-success`}>
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                System Health
              </CardTitle>
              <Badge className="bg-success/10 text-success">All Systems Operational</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {systemHealth.map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                      <Badge className={
                        item.status === 'good' ? 'bg-success/10 text-success' :
                        item.status === 'moderate' ? 'bg-warning/10 text-warning' :
                        'bg-destructive/10 text-destructive'
                      }>
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold number-display">
                      {item.value}{item.unit}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'user' ? 'bg-info/10 text-info' :
                      activity.type === 'loan' ? 'bg-success/10 text-success' :
                      activity.type === 'property' ? 'bg-primary/10 text-primary' :
                      'bg-warning/10 text-warning'
                    }`}>
                      {activity.type === 'user' ? <Users className="w-4 h-4" /> :
                       activity.type === 'loan' ? <CreditCard className="w-4 h-4" /> :
                       activity.type === 'property' ? <Building2 className="w-4 h-4" /> :
                       <AlertTriangle className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        item.priority === 'high' ? 'bg-destructive' :
                        item.priority === 'medium' ? 'bg-warning' :
                        'bg-muted-foreground'
                      }`} />
                      <span className="text-sm">{item.type}</span>
                    </div>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline" asChild>
                <Link to="/dashboard/approvals">
                  View All Approvals
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/dashboard/users">
                  <Users className="mr-2 w-4 h-4" />
                  Manage Users
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/dashboard/loans">
                  <CreditCard className="mr-2 w-4 h-4" />
                  Loan Management
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/dashboard/listings">
                  <Building2 className="mr-2 w-4 h-4" />
                  Property Listings
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/dashboard/analytics">
                  <BarChart3 className="mr-2 w-4 h-4" />
                  Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
