import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, MessageCircle, Phone, Mail, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const supportCards = [
  { label: 'My Tickets', count: '3', color: 'bg-primary', textColor: 'text-primary', icon: MessageCircle },
  { label: 'Resolved', count: '8', color: 'bg-success', textColor: 'text-success', icon: HelpCircle },
  { label: 'Avg Response', count: '2.4 hrs', color: 'bg-info', textColor: 'text-info', icon: Phone },
  { label: 'Satisfaction', count: '4.8/5', color: 'bg-warning', textColor: 'text-warning', icon: HelpCircle },
];

const faqData = [
  { question: 'How do I reset my password?', answer: 'Go to Settings > Security > Change Password to reset your password.' },
  { question: 'How can I update my profile information?', answer: 'Visit your Profile page and click Edit Profile to update your information.' },
  { question: 'Who can I contact for technical support?', answer: 'You can reach our support team at support@lendrix.com or call +91 1800-123-4567.' },
  { question: 'How do I enable notifications?', answer: 'Go to Settings > Notifications to configure your notification preferences.' },
];

const SharedHelpSupportPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [showTicketForm, setShowTicketForm] = useState(false);

  const filteredFAQ = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const submitTicket = () => {
    if (ticketSubject && ticketDescription) {
      setTicketSubject('');
      setTicketDescription('');
      setShowTicketForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground">Get help and support for your queries</p>
        </div>
        <Button onClick={() => setShowTicketForm(!showTicketForm)} className="gradient-primary text-primary-foreground">
          <Plus className="mr-2 w-4 h-4" />
          Create Ticket
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {supportCards.map((card, index) => (
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

      {showTicketForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Support Ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input placeholder="Subject" value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} />
            </div>
            <div>
              <Textarea placeholder="Describe your issue" value={ticketDescription} onChange={(e) => setTicketDescription(e.target.value)} rows={4} />
            </div>
            <div className="flex gap-2">
              <Button onClick={submitTicket}>Submit</Button>
              <Button variant="outline" onClick={() => setShowTicketForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Frequently Asked Questions</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search FAQ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {filteredFAQ.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="font-medium">Phone</span>
                </div>
                <p className="font-semibold">+91 1800-123-4567</p>
                <p className="text-sm text-muted-foreground">24/7 Support</p>
              </div>
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="font-medium">Email</span>
                </div>
                <p className="font-semibold">support@lendrix.com</p>
                <p className="text-sm text-muted-foreground">Response in 24hrs</p>
              </div>
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-3 mb-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <span className="font-medium">Live Chat</span>
                </div>
                <Button size="sm" className="w-full">Start Chat</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SharedHelpSupportPage;