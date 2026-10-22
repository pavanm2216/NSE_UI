import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Search, TrendingUp, Users, CheckCircle2, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';

const LenderPage: React.FC = () => {
  const features = [
    {
      icon: FileText,
      title: 'Loan Application',
      description: 'Streamlined digital loan application process with minimal documentation required.'
    },
    {
      icon: Search,
      title: 'Credit Check',
      description: 'Instant credit score verification and eligibility assessment for faster approvals.'
    },
    {
      icon: TrendingUp,
      title: 'Loan Tracking',
      description: 'Real-time tracking of loan application status and disbursement updates.'
    },
    {
      icon: Users,
      title: 'Agent Management',
      description: 'Comprehensive DSA platform for managing agents and commission tracking.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Lender <span className="text-gradient">Services</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Comprehensive loan solutions with digital lending platform and DSA management system for seamless loan sourcing and processing.
            </p>
            <Button size="lg" className="gradient-primary text-primary-foreground">
              Get Started Today
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Digital Loans Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Digital <span className="text-gradient">Loans</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Experience the future of lending with our fully digital loan platform. Quick approvals, minimal paperwork, and competitive rates.
              </p>
              <div className="space-y-4">
                {[
                  'Instant loan eligibility check',
                  'Digital document upload',
                  'AI-powered risk assessment',
                  'Same-day disbursement'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8 flex items-center justify-center">
                <CreditCard className="w-32 h-32 text-primary" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DSA Platform Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-secondary/20 to-accent/20 p-8 flex items-center justify-center">
                <Users className="w-32 h-32 text-secondary" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                DSA <span className="text-gradient">Platform</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Empower your Direct Selling Agents with our comprehensive platform for loan sourcing, application management, and commission tracking.
              </p>
              <div className="space-y-4">
                {[
                  'Agent onboarding and KYC',
                  'Lead management system',
                  'Commission calculation',
                  'Performance analytics'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need for efficient loan management and processing
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LenderPage;