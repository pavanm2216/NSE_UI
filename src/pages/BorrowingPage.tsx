import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Building2, ArrowRight, CheckCircle2, TrendingDown, Clock, Shield, Calculator } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';
import UnderDevelopmentPopup from '@/components/ui/UnderDevelopmentPopup';

const solutions = [
  {
    icon: CreditCard,
    title: 'Choose your Personal Loan',
    subtitle: 'Personal Loan Products',
    loans: [
      'Personal Loan', 'Consumer Durable Loan', 'Home Loan', 'Education Loan',
      'New Car Loan', 'Pre-owned Car Loan', 'Two Wheeler Loan',
      'Pre-owned Two Wheeler Loan', 'Gold Loan', 'Loan Against Property',
      'Loan Against Securities',
    ],
    calculators: [
      'Personal Loan EMI Calculator', 'Personal Loan Eligibility Calculator',
      'Home Loan EMI Calculator', 'Education Loan EMI Calculator',
      'Car Loan EMI Calculator', 'Used Car Loan EMI Calculator',
      'Bike Loan EMI Calculator', 'Gold Loan EMI Calculator',
      'Loan Against Property EMI Calculator', 'EMI Calculator',
    ],
    color: 'from-primary to-blue-700',
  },
  {
    icon: Building2,
    title: 'Business',
    subtitle: 'Business Loan Products',
    loans: [
      'Business Loan', 'Loan Rental Discounting', 'Professional Loan',
      'Loan Against Property', 'Business Loan for Women', 'Working Capital Loan',
      'Construction Equipment Loan', 'Machinery Loan', 'Healthcare Equipment Loan',
    ],
    calculators: [
      'Business Loan EMI Calculator',
    ],
    color: 'from-secondary to-teal-700',
  },
];

const stats = [
  { icon: CreditCard, label: 'Loans Disbursed' },
  { icon: Building2, label: 'Banking Partners' },
  { icon: Clock, label: 'Avg. Approval Time' },
  { icon: TrendingDown, label: 'Starting Interest Rate' },
];

const whyUs = [
  { icon: TrendingDown, title: 'Best Rates', desc: 'Compare rates from 50+ lenders and get the lowest available.' },
  { icon: Clock, title: 'Fast Approval', desc: 'Digital process with approvals in as fast as 24 hours.' },
  { icon: Shield, title: 'Secure & Transparent', desc: 'No hidden charges. Full transparency at every step.' },
  { icon: Calculator, title: 'EMI Calculator', desc: 'Plan your repayments with our easy-to-use EMI tool.' },
];

const BorrowingPage: React.FC = () => (
  <div className="min-h-screen bg-background">
    <TopHeader />
    <Header />
    <UnderDevelopmentPopup />

    <section className="pt-32 pb-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Smart <span className="text-gradient">Borrowing</span> Solutions
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            From personal loans to government schemes — find the right financing for every need with India's most trusted financial distributor.
          </p>
          <Button size="lg" className="gradient-primary text-primary-foreground" asChild>
            <Link to="/register">Apply Now <ArrowRight className="ml-2 w-5 h-5" /></Link>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Borrowing Solutions</h2>
          <p className="text-muted-foreground text-lg">Choose the right loan product for your needs</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {solutions.map((sol, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${sol.color} flex items-center justify-center`}>
                      <sol.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{sol.subtitle}</div>
                      <h3 className="text-xl font-bold">{sol.title}</h3>
                    </div>
                  </div>

                  {/* Loan Products */}
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Loan Products</p>
                  <ul className="space-y-1.5 mb-6">
                    {sol.loans.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />{item}
                      </li>
                    ))}
                  </ul>

                  {/* Calculators */}
                  <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Calculators</p>
                  <ul className="space-y-1.5 mb-6 flex-grow">
                    {sol.calculators.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-foreground">
                        <Calculator className="w-3.5 h-3.5 text-secondary flex-shrink-0" />{item}
                      </li>
                    ))}
                  </ul>

                  <Button className={`w-full bg-gradient-to-r ${sol.color} text-white border-0`} asChild>
                    <Link to="/register">Apply Now <ArrowRight className="ml-2 w-4 h-4" /></Link>
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
          <h2 className="text-3xl font-bold mb-4">Why Borrow with Lendrix?</h2>
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
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Get the Funds You Need Today</h2>
        <p className="text-lg mb-8 opacity-90">Apply in minutes. Get approved in hours.</p>
        <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
          <Link to="/register">Apply Now <ArrowRight className="ml-2 w-5 h-5" /></Link>
        </Button>
      </div>
    </section>

    <Footer />
  </div>
);

export default BorrowingPage;
