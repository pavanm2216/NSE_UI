import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, PieChart, Shield, BarChart3, CheckCircle2, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';

const WealthPage: React.FC = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Portfolio Tracking',
      description: 'Real-time portfolio monitoring with detailed performance analytics and insights.'
    },
    {
      icon: Target,
      title: 'Investment Options',
      description: 'Diverse investment opportunities including mutual funds, stocks, and bonds.'
    },
    {
      icon: Shield,
      title: 'Insurance Comparison',
      description: 'Compare and choose the best insurance policies for comprehensive protection.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-secondary/5 to-accent/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Wealth <span className="text-gradient">Services</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Build and protect your wealth with our comprehensive investment and insurance solutions. Expert guidance for your financial future.
            </p>
            <Button size="lg" className="gradient-primary text-primary-foreground">
              Start Investing
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Mutual Funds Section */}
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
                Mutual <span className="text-gradient">Funds</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Diversify your portfolio with our curated selection of mutual funds. Professional fund management with transparent fees and performance tracking.
              </p>
              <div className="space-y-4">
                {[
                  'SIP and lump sum investment options',
                  'Direct and regular fund variants',
                  'Goal-based investment planning',
                  'Tax-saving ELSS funds'
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
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-secondary/20 to-accent/20 p-8 flex items-center justify-center">
                <PieChart className="w-32 h-32 text-secondary" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stock Trading Section */}
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
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8 flex items-center justify-center">
                <TrendingUp className="w-32 h-32 text-primary" />
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
                Stock <span className="text-gradient">Trading</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Trade stocks with confidence using our advanced trading platform. Real-time market data, research reports, and expert recommendations.
              </p>
              <div className="space-y-4">
                {[
                  'Real-time market data and charts',
                  'Research reports and recommendations',
                  'Advanced order types and tools',
                  'Mobile trading app'
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

      {/* Insurance Section */}
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
                Insurance <span className="text-gradient">Protection</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Protect your wealth and family with comprehensive insurance solutions. Compare policies and get the best coverage at competitive premiums.
              </p>
              <div className="space-y-4">
                {[
                  'Life and health insurance policies',
                  'Motor and home insurance',
                  'Policy comparison and recommendations',
                  'Claims assistance and support'
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
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-accent/20 to-gold/20 p-8 flex items-center justify-center">
                <Shield className="w-32 h-32 text-accent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground text-lg">
              Comprehensive wealth management tools for your financial success
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
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
                    <div className="w-16 h-16 rounded-full bg-secondary/10 mx-auto mb-4 flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-secondary" />
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

export default WealthPage;