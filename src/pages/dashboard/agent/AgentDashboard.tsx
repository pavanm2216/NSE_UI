import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  CreditCard, 
  Wallet, 
  TrendingUp,
  ArrowUpRight,
  Plus,
  FileText,
  Phone,
  Mail,
  Target,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import SOPChatbot from '@/components/dashboard/SOPChatbot';

const stats = [
  { label: 'Total Customers', value: '1,240', icon: Users, href: '/dashboard/crm/customers' },
  { label: 'Total Leads', value: '245', change: '+28 this week', trend: 'up', icon: Users, href: '/dashboard/leads' },
  { label: 'Applications', value: '78', change: '+12 this month', trend: 'up', icon: FileText, href: '/dashboard/applications' },
  { label: 'Conversion Rate', value: '31.8%', change: '+3.2%', trend: 'up', icon: TrendingUp, href: '/dashboard/reports' },
];

const quickActions = [
  { title: 'Add New Lead', description: 'Create a new lead entry', icon: Plus, color: 'bg-primary', href: '/dashboard/leads' },
  { title: 'View Applications', description: 'Track application status', icon: FileText, color: 'bg-success', href: '/dashboard/applications' },

];

const pipelineData = [
  { stage: 'New Leads', count: 45, color: 'bg-info', percentage: 32 },
  { stage: 'Documents Pending', count: 32, color: 'bg-warning', percentage: 23 },
  { stage: 'Under Review', count: 28, color: 'bg-primary', percentage: 20 },
  { stage: 'Approved', count: 18, color: 'bg-success', percentage: 13 },
  { stage: 'Disbursed', count: 12, color: 'bg-gold', percentage: 12 },
];

const recentActivities = [
  { type: 'lead', message: 'New lead added: Rajesh Kumar', time: '2 hours ago', icon: Users, color: 'text-info' },
  { type: 'application', message: 'Application approved: Priya Sharma', time: '4 hours ago', icon: CheckCircle, color: 'text-success' },
  { type: 'payout', message: 'Commission payout processed: ₹45,000', time: '1 day ago', icon: Wallet, color: 'text-warning' },
  { type: 'lead', message: 'Lead status updated: Amit Patel', time: '2 days ago', icon: AlertCircle, color: 'text-primary' },
];

const upcomingTasks = [
  { task: 'Follow up with 5 pending leads', priority: 'high', dueDate: 'Today' },
  { task: 'Submit documents for 3 applications', priority: 'medium', dueDate: 'Tomorrow' },
  { task: 'Generate monthly performance report', priority: 'low', dueDate: 'This week' },
];

const priorityColors: Record<string, string> = {
  high: 'bg-destructive/10 text-destructive',
  medium: 'bg-warning/10 text-warning',
  low: 'bg-success/10 text-success',
};

const AgentDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-muted-foreground">Here's what's happening with your leads and commissions today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/dashboard/help">
              <Phone className="mr-2 w-4 h-4" />
              Support
            </Link>
          </Button>
          <Button className="gradient-primary text-primary-foreground" asChild>
            <Link to="/dashboard/leads">
              <Plus className="mr-2 w-4 h-4" />
              Add Lead
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
            <Link to={stat.href}>
              <Card className="card-hover cursor-pointer">
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
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <div className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg ${action.color}/10 flex items-center justify-center`}>
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
        {/* Lead Pipeline */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Lead Pipeline</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/leads">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pipelineData.map((stage, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                      <span className="font-medium">{stage.stage}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32">
                        <Progress value={stage.percentage} className="h-2" />
                      </div>
                      <span className="font-bold text-lg w-8">{stage.count}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Active Leads</span>
                  <span className="text-2xl font-bold">135</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities & Tasks */}
        <div className="space-y-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center`}>
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="p-3 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                    </div>
                    <p className="text-sm">{task.task}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>This Month's Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">₹65,000</div>
              <div className="text-sm text-muted-foreground">Commission Earned</div>
              <div className="text-xs text-success mt-1">+28% from last month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">28</div>
              <div className="text-sm text-muted-foreground">Leads Converted</div>
              <div className="text-xs text-success mt-1">+12 from last month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning mb-2">31.8%</div>
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
              <div className="text-xs text-success mt-1">+3.2% improvement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-info mb-2">4.8</div>
              <div className="text-sm text-muted-foreground">Customer Rating</div>
              <div className="text-xs text-success mt-1">+0.3 from last month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <SOPChatbot />
    </>
  );
};

export default AgentDashboard;