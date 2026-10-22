import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Target, DollarSign, Search, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const leadsCards = [
  { label: 'Total Leads', count: '2,456', color: 'bg-primary', textColor: 'text-primary', icon: Users },
  { label: 'Converted', count: '789', color: 'bg-success', textColor: 'text-success', icon: Target },
  { label: 'Total Commission', count: '₹45.2L', color: 'bg-warning', textColor: 'text-warning', icon: DollarSign },
  { label: 'Conversion Rate', count: '32.1%', color: 'bg-info', textColor: 'text-info', icon: TrendingUp },
];

const agentLeadsData = [
  { agent: 'David DSA', totalLeads: 245, converted: 78, pending: 45, commission: '₹4,85,000', rate: '31.8%' },
  { agent: 'Priya Agent', totalLeads: 189, converted: 65, pending: 32, commission: '₹3,92,000', rate: '34.4%' },
  { agent: 'Rajesh Kumar', totalLeads: 156, converted: 52, pending: 28, commission: '₹3,15,000', rate: '33.3%' },
  { agent: 'Amit Sharma', totalLeads: 134, converted: 41, pending: 18, commission: '₹2,87,000', rate: '30.6%' },
];

const recentLeads = [
  { id: 'L001', customer: 'Rajesh Kumar', agent: 'David DSA', loanType: 'Home Loan', amount: '₹45,00,000', status: 'approved', date: '2024-01-22' },
  { id: 'L002', customer: 'Priya Sharma', agent: 'Priya Agent', loanType: 'Personal Loan', amount: '₹5,00,000', status: 'pending', date: '2024-01-21' },
  { id: 'L003', customer: 'Amit Patel', agent: 'Rajesh Kumar', loanType: 'Business Loan', amount: '₹25,00,000', status: 'review', date: '2024-01-20' },
];

const statusColors: Record<string, string> = {
  approved: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  review: 'bg-info/10 text-info',
  rejected: 'bg-destructive/10 text-destructive',
};

const AdminLeadsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [agentFilter, setAgentFilter] = useState('all');

  const filteredAgents = agentLeadsData.filter(agent =>
    agentFilter === 'all' || agent.agent.toLowerCase().includes(agentFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Leads Management</h1>
          <p className="text-muted-foreground">Track all agent leads and commission performance</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {leadsCards.map((card, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
            <Card className="card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <p className={`text-2xl font-bold ${card.textColor}`}>{card.count}</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Agent Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent Name</TableHead>
                <TableHead>Total Leads</TableHead>
                <TableHead>Converted</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Conversion Rate</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{agent.agent}</TableCell>
                  <TableCell>{agent.totalLeads}</TableCell>
                  <TableCell className="text-success font-medium">{agent.converted}</TableCell>
                  <TableCell className="text-warning font-medium">{agent.pending}</TableCell>
                  <TableCell className="font-semibold text-success">{agent.commission}</TableCell>
                  <TableCell>
                    <Badge className="bg-info/10 text-info">{agent.rate}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="icon" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Loan Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.id}</TableCell>
                  <TableCell>{lead.customer}</TableCell>
                  <TableCell>{lead.agent}</TableCell>
                  <TableCell>{lead.loanType}</TableCell>
                  <TableCell className="font-semibold">{lead.amount}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[lead.status]}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{lead.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLeadsPage;