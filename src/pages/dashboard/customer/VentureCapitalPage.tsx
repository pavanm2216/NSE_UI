import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket, TrendingUp, Users, Target, CheckCircle, Crown,
  Briefcase, BarChart3, Globe, Lightbulb, ArrowUpRight, Star,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const advisoryServices = [
  { title: 'Startup Incubation', description: 'End-to-end support for early-stage startups', icon: Rocket, color: 'bg-primary' },
  { title: 'Funding Strategy', description: 'Strategic guidance for raising capital', icon: TrendingUp, color: 'bg-success' },
  { title: 'Investor Connect', description: 'Connect with angel investors and VCs', icon: Users, color: 'bg-info' },
  { title: 'Business Planning', description: 'Comprehensive business plan development', icon: Target, color: 'bg-warning' },
  { title: 'Market Expansion', description: 'Global market entry strategy & advisory', icon: Globe, color: 'bg-purple-500' },
  { title: 'Innovation Lab', description: 'R&D support and innovation consulting', icon: Lightbulb, color: 'bg-pink-500' },
];

const fundingStages = [
  { stage: 'Pre-Seed', range: '₹10L – ₹50L', description: 'Idea validation and MVP development', deals: 42 },
  { stage: 'Seed', range: '₹50L – ₹5Cr', description: 'Product development and market entry', deals: 65 },
  { stage: 'Series A', range: '₹5Cr – ₹25Cr', description: 'Scaling operations and team building', deals: 28 },
  { stage: 'Series B+', range: '₹25Cr+', description: 'Market expansion and growth acceleration', deals: 15 },
];

const activeDeals = [
  { name: 'FinEdge AI', sector: 'FinTech', stage: 'Series A', ask: '₹12Cr', valuation: '₹60Cr', status: 'Due Diligence' },
  { name: 'GreenHarvest', sector: 'AgriTech', stage: 'Seed', ask: '₹3Cr', valuation: '₹15Cr', status: 'Term Sheet' },
  { name: 'MediSync', sector: 'HealthTech', stage: 'Pre-Seed', ask: '₹80L', valuation: '₹4Cr', status: 'Screening' },
  { name: 'EduVerse', sector: 'EdTech', stage: 'Series B', ask: '₹40Cr', valuation: '₹200Cr', status: 'Closing' },
];

const statusColors: Record<string, string> = {
  'Due Diligence': 'bg-blue-100 text-blue-700',
  'Term Sheet': 'bg-yellow-100 text-yellow-700',
  'Screening': 'bg-gray-100 text-gray-700',
  'Closing': 'bg-green-100 text-green-700',
};

const VentureCapitalPage: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '', stage: '', industry: '', fundingNeeded: '', description: '',
  });

  const handleSubmit = () => {
    console.log('VC advisory request:', formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-5 h-5 text-yellow-500" />
            <Badge className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs">Premium</Badge>
          </div>
          <h1 className="text-3xl font-bold">Venture Capital Advisory</h1>
          <p className="text-muted-foreground">Empowering founders, startups & investors with end-to-end guidance</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Startups Funded', value: '150+', icon: Rocket, color: 'text-primary' },
          { label: 'Total Funding Raised', value: '₹500Cr+', icon: TrendingUp, color: 'text-green-600' },
          { label: 'Success Rate', value: '85%', icon: Star, color: 'text-yellow-500' },
          { label: 'Active Investors', value: '320+', icon: Users, color: 'text-blue-600' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="advisory">
        <TabsList>
          <TabsTrigger value="advisory"><Briefcase className="w-4 h-4 mr-2" />Advisory Services</TabsTrigger>
          <TabsTrigger value="deals"><BarChart3 className="w-4 h-4 mr-2" />Active Deals</TabsTrigger>
          <TabsTrigger value="consult"><Rocket className="w-4 h-4 mr-2" />Request Consultation</TabsTrigger>
        </TabsList>

        {/* Advisory Services Tab */}
        <TabsContent value="advisory" className="space-y-6 mt-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {advisoryServices.map((service, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg ${service.color}/10 flex items-center justify-center mb-4`}>
                      <service.icon className={`w-6 h-6 ${service.color.replace('bg-', 'text-')}`} />
                    </div>
                    <h3 className="font-semibold mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                    <Button variant="outline" size="sm" className="w-full">Learn More</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Funding Stages We Support</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {fundingStages.map((stage, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg border border-border">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{stage.stage}</h4>
                        <Badge variant="outline">{stage.range}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{stage.description}</p>
                      <p className="text-xs text-primary mt-1">{stage.deals} deals closed</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>What We Offer</CardTitle></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">For Startups</h4>
                    <div className="space-y-2">
                      {['Business plan development', 'Pitch deck creation', 'Financial modeling', 'Market research', 'Legal compliance'].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">For Investors</h4>
                    <div className="space-y-2">
                      {['Deal sourcing', 'Due diligence support', 'Portfolio management', 'Exit strategy planning', 'Risk assessment'].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Active Deals Tab */}
        <TabsContent value="deals" className="space-y-4 mt-4">
          <div className="grid gap-4">
            {activeDeals.map((deal, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Rocket className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{deal.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{deal.sector}</Badge>
                          <Badge variant="outline" className="text-xs">{deal.stage}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 text-right flex-wrap">
                      <div>
                        <p className="text-xs text-muted-foreground">Ask</p>
                        <p className="font-bold">{deal.ask}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Valuation</p>
                        <p className="font-bold text-green-600 flex items-center gap-1">
                          <ArrowUpRight className="w-4 h-4" />{deal.valuation}
                        </p>
                      </div>
                      <Badge className={statusColors[deal.status] || 'bg-gray-100 text-gray-700'}>
                        {deal.status}
                      </Badge>
                      <Button className="gradient-primary" size="sm">View Deal</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Consultation Tab */}
        <TabsContent value="consult" className="mt-4">
          <Card className="max-w-2xl">
            <CardHeader><CardTitle>Request VC Advisory Consultation</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Company Name</Label>
                <Input placeholder="Enter your company name" value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Funding Stage</Label>
                  <Select value={formData.stage} onValueChange={(v) => setFormData({ ...formData, stage: v })}>
                    <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                      <SelectItem value="seed">Seed</SelectItem>
                      <SelectItem value="series-a">Series A</SelectItem>
                      <SelectItem value="series-b">Series B+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Industry</Label>
                  <Select value={formData.industry} onValueChange={(v) => setFormData({ ...formData, industry: v })}>
                    <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fintech">FinTech</SelectItem>
                      <SelectItem value="healthtech">HealthTech</SelectItem>
                      <SelectItem value="edtech">EdTech</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="saas">SaaS</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Funding Required</Label>
                <Input placeholder="e.g., ₹2 Crores" value={formData.fundingNeeded}
                  onChange={(e) => setFormData({ ...formData, fundingNeeded: e.target.value })} />
              </div>
              <div>
                <Label>Business Description</Label>
                <Textarea placeholder="Brief description of your business and funding requirements"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} />
              </div>
              <Button onClick={handleSubmit} className="w-full gradient-primary text-primary-foreground">
                <Rocket className="mr-2 w-4 h-4" />
                Request Advisory Consultation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VentureCapitalPage;
