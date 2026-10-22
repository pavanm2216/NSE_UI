import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';

// Updated items to include navigation paths
const items = [
  { name: 'Mutual Funds', href: '/mutual-funds' },
  { name: 'Sovereign Gold Bonds', href: null },
  { name: 'Demat Account', href: null },
  { name: 'Bonds', href: null },
  { name: 'Portfolio Management Service, Key man Concept', href: null },
  { name: 'Insurance Category (Life Insurance, General Insurance, Motor Insurance)', href: null },
];

const NonIndividualInvestingPage: React.FC = () => (
  <div className="min-h-screen bg-background">
    <TopHeader />
    <Header />

    <section className="pt-8 pb-12 bg-gradient-to-br from-secondary/5 to-primary/5">
      <div className="container max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Investing</p>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Save As You Earn 💰 Grow Into Your Business 🏢📈
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground text-base mt-3 md:whitespace-nowrap">
            Comprehensive investment and financing solutions for businesses, institutions, and corporate entities seeking strategic growth.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="py-16">
      <div className="container max-w-5xl">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-8 max-w-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-secondary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Available Products for Business</h2>
          </div>
          
          <ul className="space-y-3">
            {items.map((item, i) => (
              <motion.li 
                key={i} 
                initial={{ opacity: 0, x: -10 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.05 }} 
                viewport={{ once: true }}
              >
                <Link 
                  to={item.href || "#"} 
                  className={`flex items-center gap-3 py-1 transition-all ${
                    item.name !== 'Mutual Funds' ? 'cursor-text' : 'cursor-pointer'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span 
                    className={`text-sm text-gray-700 transition-colors font-medium ${
                      item.name === 'Mutual Funds' ? 'hover:text-[#2A938F]' : ''
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }} 
          viewport={{ once: true }} 
          className="mt-10"
        >
          <Button size="lg" className="bg-gradient-to-r from-secondary to-primary text-white px-10" asChild>
            <Link to="/register">
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default NonIndividualInvestingPage;