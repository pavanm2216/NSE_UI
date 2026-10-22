import React from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Crown, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';
import UnderDevelopmentPopup from '@/components/ui/UnderDevelopmentPopup';

const solutions = [
  {
    icon: Crown,
    title: 'Privy Alpha League',
    tagline: 'A Network Initiative Connecting People to Opportunities.',
    description: 'Our Networking platform help you in Unlocking infinite possibilities in India and beyond the international boundaries to support your business growth. Support on Wealth management and Industry expertise to guide on business consultancy, also with a host of exclusive Health, Wellness program and Personality Training Programme. Discount on Car booking services within India and Overseas.',
    color: 'from-primary to-secondary',
    bg: 'from-primary/5 to-secondary/5',
    border: 'border-primary/20',
  },
  {
    icon: TrendingUp,
    title: 'Angel Wealth League',
    tagline: 'New Edge Portfolio: Smart Diversification for Business and Self Employed Professionals.',
    description: 'Support on Wealth management and Support on business growth, a host of exclusive Health, Wellness program and Personality Training Programme. Discount on Hotels booking, resorts, Spa.',
    color: 'from-primary to-blue-700',
    bg: 'from-blue-50 to-primary/5',
    border: 'border-blue-200',
  },
  {
    icon: Shield,
    title: 'Private Wealth League',
    tagline: 'Crafting Intelligent Solutions to Preserve Wealth and Create Enduring Legacies.',
    description: 'Support on Wealth management and Industry expertise to guide on business consultancy, also with a host of exclusive Health, Wellness program and Personality Training Programme.',
    color: 'from-secondary to-primary',
    bg: 'from-secondary/5 to-primary/5',
    border: 'border-secondary/20',
  },
];

const ClientSolutionsPage: React.FC = () => (
  <div className="min-h-screen bg-background">
    <TopHeader />
    <Header />
    <UnderDevelopmentPopup />

    {/* Hero */}
    <section className="pt-32 pb-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Crown className="w-4 h-4" /> Premium Client Solutions
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Tailored <span className="text-gradient">Wealth Solutions</span><br />for Every Ambition
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            From exclusive investment circles to legacy wealth management — our client solutions are designed for those who demand the best.
          </p>
          <Button size="lg" className="gradient-primary text-primary-foreground" asChild>
            <Link to="/register">Get Started <ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
        </motion.div>
      </div>
    </section>

    {/* Solutions — full-width stacked rows */}
    <section className="pb-24">
      <div className="container max-w-3xl space-y-0">
        {solutions.map((sol, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            viewport={{ once: true }}
            className={`relative border-b ${sol.border} py-14`}
          >
            {/* Plan name */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sol.color} flex items-center justify-center flex-shrink-0`}>
                <sol.icon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">{sol.title}</h2>
            </div>

            {/* Tagline — indented */}
            <p className="text-base font-semibold text-primary ml-13 mb-5 pl-1" style={{ marginLeft: '52px' }}>
              {sol.tagline}
            </p>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-xl" style={{ marginLeft: '52px' }}>
              {sol.description}
            </p>

            {/* CTA */}
            <div style={{ marginLeft: '52px' }}>
              <Button className={`bg-gradient-to-r ${sol.color} text-white border-0 px-6`} asChild>
                <Link to="/register">
                  Get Invited <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    <Footer />
  </div>
);

export default ClientSolutionsPage;
