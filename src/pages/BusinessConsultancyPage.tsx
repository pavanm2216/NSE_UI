import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, LineChart, Search, ArrowRight, CheckCircle2, Target, Users, Award, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';
import UnderDevelopmentPopup from '@/components/ui/UnderDevelopmentPopup';

const solutions = [
  {
    icon: Briefcase,
    title: 'Business Strategy',
    subtitle: 'Strategic Planning',
    description: 'Comprehensive strategic planning and business model optimization to help your business achieve sustainable competitive advantage and long-term growth.',
    features: ['Business model canvas & design', 'Competitive landscape analysis', 'Go-to-market strategy', 'OKR & KPI framework setup', 'Quarterly strategy reviews'],
    href: '/consultancy/business-strategy',
    color: 'from-primary to-blue-700',
  },
  {
    icon: LineChart,
    title: 'Financial Advisory',
    subtitle: 'Expert Financial Planning',
    description: 'Expert financial planning, restructuring, and advisory services to optimise your capital structure, improve cash flows, and maximise shareholder value.',
    features: ['Financial modelling & forecasting', 'Capital structure optimisation', 'Fundraising & investor relations', 'M&A advisory & due diligence', 'CFO-as-a-service'],
    href: '/consultancy/financial-advisory',
    color: 'from-secondary to-teal-700',
  },
  {
    icon: Search,
    title: 'Market Research',
    subtitle: 'Data-Driven Insights',
    description: 'Comprehensive market analysis, consumer research, and competitive intelligence to help you make informed business decisions backed by real data.',
    features: ['Primary & secondary research', 'Consumer behaviour analysis', 'Industry trend reports', 'Competitor benchmarking', 'TAM/SAM/SOM analysis'],
    href: '/consultancy/market-research',
    color: 'from-primary to-secondary',
  },
];

const stats = [
  { icon: Briefcase, label: 'Businesses Advised' },
  { icon: LineChart, label: 'Capital Raised' },
  { icon: Award, label: 'Client Satisfaction' },
  { icon: Globe, label: 'Industry Verticals' },
];

const whyUs = [
  { icon: Target, title: 'Outcome-Focused', desc: 'Every engagement is tied to measurable business outcomes and ROI.' },
  { icon: Users, title: 'Expert Team', desc: 'Senior consultants with 15+ years of cross-industry experience.' },
  { icon: Award, title: 'Proven Track Record', desc: '500+ successful engagements across startups and enterprises.' },
  { icon: Globe, title: 'Global Perspective', desc: 'International market insights with deep local expertise.' },
];

const BusinessConsultancyPage: React.FC = () => (
  <div className="min-h-screen bg-background">
    <TopHeader />
    <Header />
    <UnderDevelopmentPopup />

    <section className="pt-32 pb-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Business <span className="text-gradient">Consultancy</span><br />That Drives Results
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Strategic advisory, financial planning, and market intelligence — everything your business needs to scale, compete, and win.
          </p>
          <Button size="lg" className="gradient-primary text-primary-foreground" asChild>
            <Link to="/contact">Talk to an Expert <ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
        </motion.div>
      </div>
    </section>

    <section className="py-12 border-y border-border">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-md">
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm font-semibold text-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Consultancy Services</h2>
          <p className="text-muted-foreground text-lg">End-to-end advisory for every stage of your business</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((sol, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${sol.color} flex items-center justify-center mb-6`}>
                    <sol.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{sol.subtitle}</div>
                  <h3 className="text-xl font-bold mb-3">{sol.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed flex-grow">{sol.description}</p>
                  <ul className="space-y-2 mb-6">
                    {sol.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" asChild>
                    <Link to={sol.href}>Explore <ArrowRight className="ml-2 w-4 h-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Consultancy?</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyUs.map((w, i) => (
            <Card key={i} className="text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <w.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{w.title}</h3>
                <p className="text-sm text-muted-foreground">{w.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
        <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">Schedule a free consultation with our senior advisors today.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
            <Link to="/contact">Book Free Consultation <ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default BusinessConsultancyPage;
