import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, CheckCircle2, TrendingDown, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';

const sections = [
  {
    icon: Briefcase,
    title: 'Merger & Acquisition',
    color: 'bg-primary/10',
    iconColor: 'text-primary',
    items: [
      'M&A Strategy & Planning',
      'Target Identification & Screening',
      'Due Diligence Support',
      'Deal Structuring & Negotiation',
      'Post-Merger Integration',
    ],
  },
  {
    icon: TrendingDown,
    title: 'Cost Optimization',
    color: 'bg-secondary/10',
    iconColor: 'text-secondary',
    items: [
      'Operational Cost Analysis',
      'Process Re-engineering',
      'Vendor & Procurement Optimization',
      'Technology Cost Reduction',
      'Workforce Efficiency Planning',
    ],
  },
  {
    icon: Building2,
    title: 'Offering in Distress Properties and Company',
    color: 'bg-orange-50',
    iconColor: 'text-orange-600',
    items: [
      'Distressed Asset Identification',
      'Valuation & Risk Assessment',
      'Turnaround Strategy',
      'Debt Restructuring Advisory',
      'Exit & Resolution Planning',
    ],
  },
];

const BusinessConsultancyDetailPage: React.FC = () => (
  <div className="min-h-screen bg-background">
    <TopHeader />
    <Header />

    <section className="pt-8 pb-12 bg-gradient-to-br from-secondary/5 to-primary/5">
      <div className="container max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Business Consultancy</p>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Business Consultancy</h1>
            </div>
          </div>
          <p className="text-muted-foreground text-base max-w-2xl mt-3">
            Strategic advisory services for mergers, acquisitions, cost optimization, and distressed asset opportunities.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="py-16">
      <div className="container max-w-5xl">
        <div className="grid md:grid-cols-3 gap-8">
          {sections.map((sec, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }} viewport={{ once: true }}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-7 h-full">
                <div className={`w-10 h-10 rounded-xl ${sec.color} flex items-center justify-center mb-4`}>
                  <sec.icon className={`w-5 h-5 ${sec.iconColor}`} />
                </div>
                <h3 className="font-bold text-base text-foreground mb-4">{sec.title}</h3>
                <ul className="space-y-2.5">
                  {sec.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2.5 group">
                      <CheckCircle2 className={`w-4 h-4 ${sec.iconColor} flex-shrink-0`} />
                      <span className="text-sm text-gray-700 font-medium group-hover:text-secondary transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }} className="mt-12 text-center">
          <Button size="lg" className="bg-gradient-to-r from-secondary to-primary text-white px-10" asChild>
            <Link to="/register">Talk to an Advisor <ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default BusinessConsultancyDetailPage;
