import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, CreditCard, DollarSign, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

const analyticsCards = [
  { label: 'Total Users', value: '12,543', change: '+18%', color: 'bg-primary', textColor: 'text-primary', icon: Users },
  { label: 'Active Loans', value: '3,247', change: '+12%', color: 'bg-success', textColor: 'text-success', icon: CreditCard },
  { label: 'Total Volume', value: '₹45.2Cr', change: '+25%', color: 'bg-warning', textColor: 'text-warning', icon: DollarSign },
  { label: 'Platform Revenue', value: '₹2.8Cr', change: '+32%', color: 'bg-info', textColor: 'text-info', icon: TrendingUp },
];

const agentPerformance = [
  { name: 'David DSA', leads: 245, conversions: 78, commission: '₹4,85,000', rating: 4.8 },
  { name: 'Priya Agent', leads: 189, conversions: 65, commission: '₹3,92,000', rating: 4.6 },
  { name: 'Rajesh Kumar', leads: 156, conversions: 52, commission: '₹3,15,000', rating: 4.5 },
  { name: 'Amit Sharma', leads: 134, conversions: 41, commission: '₹2,87,000', rating: 4.3 },
];

const platformMetrics = [
  { metric: 'Loan Approval Rate', value: '78%', target: '80%', progress: 78 },
  { metric: 'Average Processing Time', value: '3.2 days', target: '3 days', progress: 85 },
  { metric: 'Customer Satisfaction', value: '4.6/5', target: '4.5/5', progress: 92 },
  { metric: 'Agent Retention Rate', value: '94%', target: '90%', progress: 94 },
];

const AdminAnalyticsPage: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('month');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Platform Analytics</h1>
          <p className="text-muted-foreground">Comprehensive platform performance overview</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gradient-primary text-primary-foreground">
            <Download className="mr-2 w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map((card, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
            <Card className="card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
                    <p className="text-xs text-success">{card.change} from last month</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg ${card.color}/10 flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent Name</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agentPerformance.map((agent, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell>{agent.leads}</TableCell>
                      <TableCell>{agent.conversions}</TableCell>
                      <TableCell className="font-semibold text-success">{agent.commission}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{agent.rating}</span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{metric.metric}</span>
                      <span className="text-muted-foreground">Target: {metric.target}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={metric.progress} className="flex-1" />
                      <span className="text-sm font-medium">{metric.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;