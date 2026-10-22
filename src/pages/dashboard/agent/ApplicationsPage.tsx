import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Eye, Download, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const statusCards = [
  { label: 'Submitted', count: 28, color: 'bg-info', textColor: 'text-info', icon: FileText },
  { label: 'In Progress', count: 15, color: 'bg-warning', textColor: 'text-warning', icon: Clock },
  { label: 'Approved', count: 12, color: 'bg-success', textColor: 'text-success', icon: CheckCircle },
  { label: 'Rejected', count: 5, color: 'bg-destructive', textColor: 'text-destructive', icon: XCircle },
];

const applicationsData = [
  { 
    id: 'APP001', 
    customerName: 'Rajesh Kumar', 
    loanType: 'Home Loan', 
    amount: '₹45,00,000', 
    status: 'submitted', 
    progress: 25,
    submittedDate: '2024-01-20',
    lastUpdate: '2024-01-21',
    documents: ['PAN', 'Aadhar', 'Salary Slips']
  },
  { 
    id: 'APP002', 
    customerName: 'Priya Sharma', 
    loanType: 'Personal Loan', 
    amount: '₹5,00,000', 
    status: 'in-progress', 
    progress: 60,
    submittedDate: '2024-01-18',
    lastUpdate: '2024-01-22',
    documents: ['PAN', 'Aadhar', 'Bank Statements']
  },
  { 
    id: 'APP003', 
    customerName: 'Amit Patel', 
    loanType: 'Business Loan', 
    amount: '₹25,00,000', 
    status: 'approved', 
    progress: 100,
    submittedDate: '2024-01-15',
    lastUpdate: '2024-01-22',
    documents: ['PAN', 'Aadhar', 'GST Certificate', 'ITR']
  },
  { 
    id: 'APP004', 
    customerName: 'Sneha Gupta', 
    loanType: 'Car Loan', 
    amount: '₹8,00,000', 
    status: 'rejected', 
    progress: 0,
    submittedDate: '2024-01-16',
    lastUpdate: '2024-01-20',
    documents: ['PAN', 'Aadhar', 'Salary Slips']
  },
];

const statusColors: Record<string, string> = {
  submitted: 'bg-info/10 text-info',
  'in-progress': 'bg-warning/10 text-warning',
  approved: 'bg-success/10 text-success',
  rejected: 'bg-destructive/10 text-destructive',
};

const statusLabels: Record<string, string> = {
  submitted: 'Submitted',
  'in-progress': 'In Progress',
  approved: 'Approved',
  rejected: 'Rejected',
};

const ApplicationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [applications, setApplications] = useState(applicationsData);

  const updateApplicationStatus = (id: string, newStatus: string) => {
    setApplications(applications.map(app => 
      app.id === id ? { 
        ...app, 
        status: newStatus,
        progress: newStatus === 'approved' ? 100 : newStatus === 'rejected' ? 0 : app.progress
      } : app
    ));
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.loanType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Applications</h1>
          <p className="text-muted-foreground">Track loan application progress</p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statusCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
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

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Loan Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.id}</TableCell>
                  <TableCell>{app.customerName}</TableCell>
                  <TableCell>{app.loanType}</TableCell>
                  <TableCell className="font-semibold">{app.amount}</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Progress value={app.progress} className="w-20" />
                      <span className="text-xs text-muted-foreground">{app.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={app.status}
                      onValueChange={(value) => updateApplicationStatus(app.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <Badge className={statusColors[app.status]}>
                          {statusLabels[app.status]}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{app.lastUpdate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationsPage;