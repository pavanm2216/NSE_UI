import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Phone, Mail, Eye, User, Calendar, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const inquiryCards = [
  { label: 'Total Inquiries', count: '156', color: 'bg-primary', textColor: 'text-primary', icon: MessageCircle },
  { label: 'New Today', count: '12', color: 'bg-info', textColor: 'text-info', icon: Calendar },
  { label: 'Responded', count: '89', color: 'bg-success', textColor: 'text-success', icon: Phone },
  { label: 'Pending', count: '67', color: 'bg-warning', textColor: 'text-warning', icon: MessageCircle },
];

const inquiriesData = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh@email.com', phone: '+91 98765 43210', property: '3BHK Apartment in Bandra', inquiry: 'Interested in viewing', status: 'new', date: '2024-01-22', time: '10:30 AM' },
  { id: 2, name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 87654 32109', property: '2BHK Villa with Garden', inquiry: 'Price negotiation', status: 'responded', date: '2024-01-21', time: '2:15 PM' },
  { id: 3, name: 'Amit Patel', email: 'amit@email.com', phone: '+91 76543 21098', property: 'Commercial Office Space', inquiry: 'Loan assistance needed', status: 'pending', date: '2024-01-21', time: '11:45 AM' },
  { id: 4, name: 'Sneha Gupta', email: 'sneha@email.com', phone: '+91 65432 10987', property: 'Studio Apartment', inquiry: 'Ready to buy', status: 'responded', date: '2024-01-20', time: '4:20 PM' },
  { id: 5, name: 'Vikram Singh', email: 'vikram@email.com', phone: '+91 54321 09876', property: '3BHK Apartment in Bandra', inquiry: 'Site visit request', status: 'new', date: '2024-01-20', time: '9:15 AM' },
];

const statusColors: Record<string, string> = {
  new: 'bg-info/10 text-info',
  responded: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  closed: 'bg-muted/10 text-muted-foreground',
};

const statusLabels: Record<string, string> = {
  new: 'New',
  responded: 'Responded',
  pending: 'Pending',
  closed: 'Closed',
};

const BrokerInquiriesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [inquiries, setInquiries] = useState(inquiriesData);

  const updateInquiryStatus = (id: number, newStatus: string) => {
    setInquiries(inquiries.map(inquiry => 
      inquiry.id === id ? { ...inquiry, status: newStatus } : inquiry
    ));
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Property Inquiries</h1>
          <p className="text-muted-foreground">Manage customer inquiries and leads</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {inquiryCards.map((card, index) => (
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search inquiries..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="responded">Responded</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Inquiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell className="font-medium">{inquiry.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{inquiry.phone}</div>
                      <div className="text-xs text-muted-foreground">{inquiry.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{inquiry.property}</TableCell>
                  <TableCell>{inquiry.inquiry}</TableCell>
                  <TableCell>
                    <Select value={inquiry.status} onValueChange={(value) => updateInquiryStatus(inquiry.id, value)}>
                      <SelectTrigger className="w-32">
                        <Badge className={statusColors[inquiry.status]}>
                          {statusLabels[inquiry.status]}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="responded">Responded</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{inquiry.date}</div>
                      <div className="text-xs text-muted-foreground">{inquiry.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <Eye className="w-4 h-4" />
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

export default BrokerInquiriesPage;