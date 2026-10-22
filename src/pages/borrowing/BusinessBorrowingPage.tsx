import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Calculator, ArrowRight, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';

const loans = [
  'Business Loan',
  'Loan Rental Discounting',
  'Professional Loan',
  'Loan Against Property',
  'Business Loan for Women',
  'Working Capital Loan',
  'Construction Equipment Loan',
  'Machinery Loan',
  'Healthcare Equipment Loan',
];

const calculators = [
  'Business Loan EMI Calculator',
];

const BusinessBorrowingPage: React.FC = () => (
  <div className="min-h-screen bg-background">
    <TopHeader />
    <Header />

    {/* Hero */}
    <section className="pt-8 pb-12 bg-gradient-to-br from-secondary/5 to-primary/5">
      <div className="container max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-teal-700 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Borrowing</p>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Discover your Business Loan Solutions</h1>
            </div>
          </div>
          <p className="text-muted-foreground text-base max-w-2xl mt-3">
            Empowering Businesses to Take Control and Drive Sustainable Financial Growth
          </p>
        </motion.div>
      </div>
    </section>

    {/* Content */}
    <section className="py-8">
      <div className="container max-w-5xl">
        <div className="grid md:grid-cols-2 gap-10">

          {/* Loan Products */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-secondary" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Loan Products</h2>
              </div>
              <ul className="space-y-3">
                {loans.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 group"
                  >
                    <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                    <span className="text-sm text-gray-700 group-hover:text-secondary transition-colors font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Calculator */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-foreground">EMI Calculator</h2>
              </div>
              <ul className="space-y-3">
                {calculators.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 group"
                  >
                    <Calculator className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-gray-700 group-hover:text-primary transition-colors font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Why choose us */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Why Choose Us</p>
                <ul className="space-y-2">
                  {['Fast approvals in 24–48 hours', 'Competitive interest rates', 'Minimal documentation', 'Dedicated relationship manager'].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-secondary flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }} className="mt-12 text-center">
          <Button size="lg" className="bg-gradient-to-r from-[#1E3A6D] to-[#2A938F] text-white px-10" asChild>
            <Link to="/register">Apply Now <ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default BusinessBorrowingPage;
