import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, MessageCircle, Phone, Mail, Search, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';

const supportCards = [
  { label: 'Open Tickets', count: '3', color: 'bg-warning', textColor: 'text-warning', icon: MessageCircle },
  { label: 'Resolved', count: '12', color: 'bg-success', textColor: 'text-success', icon: CheckCircle },
  { label: 'Avg Response', count: '2.4 hrs', color: 'bg-info', textColor: 'text-info', icon: Clock },
  { label: 'Satisfaction', count: '4.8/5', color: 'bg-primary', textColor: 'text-primary', icon: HelpCircle },
];

const supportTickets = [
  {
    id: 'TKT001',
    subject: 'Commission calculation issue',
    category: 'Billing',
    status: 'open',
    priority: 'high',
    created: '2024-01-22',
    lastUpdate: '2024-01-22',
    assignedTo: 'Support Team'
  },
  {
    id: 'TKT002',
    subject: 'Lead status not updating',
    category: 'Technical',
    status: 'in-progress',
    priority: 'medium',
    created: '2024-01-21',
    lastUpdate: '2024-01-22',
    assignedTo: 'Tech Support'
  },
  {
    id: 'TKT003',
    subject: 'Unable to download reports',
    category: 'Technical',
    status: 'resolved',
    priority: 'low',
    created: '2024-01-20',
    lastUpdate: '2024-01-21',
    assignedTo: 'Tech Support'
  },
];

const faqData = [
  {
    question: 'How is my commission calculated?',
    answer: 'Commission is calculated based on the loan amount and the commission rate for each loan type. Home loans typically have 1.0-1.5% commission, while personal loans have 2.0-3.0% commission rates.'
  },
  {
    question: 'When will I receive my commission payout?',
    answer: 'Commission payouts are processed monthly, typically within 7-10 business days after the loan disbursement. You will receive an email notification once the payout is processed.'
  },
  {
    question: 'How can I track my lead status?',
    answer: 'You can track all your leads in the Leads section of your dashboard. Each lead shows its current status, and you can update the status as it progresses through the loan process.'
  },
  {
    question: 'What documents are required for loan applications?',
    answer: 'Required documents vary by loan type but typically include PAN card, Aadhar card, salary slips (for salaried), ITR (for self-employed), bank statements, and property documents (for secured loans).'
  },
  {
    question: 'How can I add a new lead to the system?',
    answer: 'Click the "Add New Lead" button on your dashboard or in the Leads section. Fill in the customer details, loan requirements, and contact information. The lead will be automatically assigned to you.'
  },
];

const statusColors: Record<string, string> = {
  open: 'bg-warning/10 text-warning',
  'in-progress': 'bg-info/10 text-info',
  resolved: 'bg-success/10 text-success',
  closed: 'bg-muted/10 text-muted-foreground',
};

const priorityColors: Record<string, string> = {
  low: 'bg-success/10 text-success',
  medium: 'bg-warning/10 text-warning',
  high: 'bg-destructive/10 text-destructive',
};

const HelpSupportPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketDescription, setNewTicketDescription] = useState('');
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);

  const filteredFAQ = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const submitTicket = () => {
    if (newTicketSubject && newTicketDescription) {
      console.log('Submitting ticket:', { subject: newTicketSubject, description: newTicketDescription });
      setNewTicketSubject('');
      setNewTicketDescription('');
      setShowNewTicketForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground">Get help and support for your queries</p>
        </div>
        <Button 
          className="gradient-primary text-primary-foreground"
          onClick={() => setShowNewTicketForm(!showNewTicketForm)}
        >
          <Plus className="mr-2 w-4 h-4" />
          Create Ticket
        </Button>
      </div>

      {/* Support Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {supportCards.map((card, index) => (
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

      {/* New Ticket Form */}
      {showNewTicketForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Support Ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input
                placeholder="Brief description of your issue"
                value={newTicketSubject}
                onChange={(e) => setNewTicketSubject(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Detailed description of your issue"
                value={newTicketDescription}
                onChange={(e) => setNewTicketDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={submitTicket}>Submit Ticket</Button>
              <Button variant="outline" onClick={() => setShowNewTicketForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Support Tickets */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>My Support Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supportTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ticket.subject}</div>
                          <div className="text-sm text-muted-foreground">{ticket.category}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[ticket.status]}>
                          {ticket.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityColors[ticket.priority]}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.created}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="font-medium">Phone Support</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Available 24/7</p>
                <p className="font-semibold">+91 1800-123-4567</p>
              </div>
              
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="font-medium">Email Support</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Response within 24 hours</p>
                <p className="font-semibold">support@lendrix.com</p>
              </div>
              
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <span className="font-medium">Live Chat</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Available 9 AM - 6 PM</p>
                <Button size="sm" className="w-full">Start Chat</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Frequently Asked Questions</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {filteredFAQ.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpSupportPage;