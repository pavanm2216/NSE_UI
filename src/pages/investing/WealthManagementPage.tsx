import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, TrendingUp, PieChart, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';
import { Link } from 'react-router-dom';

const WealthManagementPage: React.FC = () => {
  const services = [
    {
      icon: TrendingUp,
      title: 'Mutual Funds',
      description: 'Diversified portfolio of equity, debt, and hybrid funds',
      features: ['Direct plans with zero commission', 'SIP starting from ₹500', 'Expert fund recommendations']
    },
    {
      icon: PieChart,
      title: 'Portfolio Management',
      description: 'Customized investment strategies for your financial goals',
      features: ['Personalized asset allocation', 'Regular rebalancing', 'Risk-adjusted returns']
    },
    {
      icon: Shield,
      title: 'Insurance & Protection',
      description: 'Comprehensive insurance solutions for you and your family',
      features: ['Life & health insurance', 'Term plans', 'Investment-linked policies']
    },
    {
      icon: Award,
      title: 'Fixed Income',
      description: 'Stable returns through bonds, FDs, and NCDs',
      features: ['Government & corporate bonds', 'Fixed deposits', 'Guaranteed returns']
    }
  ];

  const benefits = [
    'Personalized wealth management strategies',
    'Access to exclusive investment opportunities',
    'Tax-efficient investment planning',
    'Regular portfolio reviews and rebalancing',
    'Dedicated relationship manager',
    'Transparent fee structure'
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Wealth Management Services
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Build and grow your wealth with our comprehensive investment solutions. 
                From mutual funds to portfolio management, we help you achieve your financial goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gradient-primary" asChild>
                  <Link to="/register">
                    Start Investing
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">
                    Talk to Advisor
                  </Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-6">Investment Highlights</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span>Zero commission on direct mutual funds</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span>SIP starting from ₹500/month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span>Expert portfolio management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span>Tax-saving investment options</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span>Real-time portfolio tracking</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Wealth Management Services</h2>
            <p className="text-muted-foreground">Comprehensive solutions for all your investment needs</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-center">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 text-center">{service.description}</p>
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Our Wealth Management?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                      <span className="font-medium">{benefit}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Investment Process */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                      <h3 className="font-semibold mb-2">Financial Assessment</h3>
                      <p className="text-muted-foreground">We analyze your financial goals, risk appetite, and investment horizon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                      <h3 className="font-semibold mb-2">Portfolio Creation</h3>
                      <p className="text-muted-foreground">Our experts design a customized investment portfolio tailored to your needs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                      <h3 className="font-semibold mb-2">Investment Execution</h3>
                      <p className="text-muted-foreground">Start investing with SIP or lumpsum across selected instruments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">4</div>
                    <div>
                      <h3 className="font-semibold mb-2">Ongoing Management</h3>
                      <p className="text-muted-foreground">Regular monitoring, rebalancing, and performance reviews</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Wealth Journey Today</h2>
          <p className="text-lg mb-8 opacity-90">Let our experts help you build a secure financial future</p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
            <Link to="/register">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WealthManagementPage;
