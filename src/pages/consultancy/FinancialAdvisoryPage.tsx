import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, DollarSign, PieChart, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';
import { Link } from 'react-router-dom';

const FinancialAdvisoryPage: React.FC = () => {
  const services = [
    {
      icon: DollarSign,
      title: 'Financial Planning',
      description: 'Comprehensive financial planning for individuals and businesses',
      features: ['Cash flow management', 'Budget optimization', 'Financial goal setting']
    },
    {
      icon: PieChart,
      title: 'Investment Advisory',
      description: 'Expert guidance on investment strategies and portfolio management',
      features: ['Asset allocation', 'Risk assessment', 'Portfolio diversification']
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Identify and mitigate financial risks',
      features: ['Risk assessment', 'Insurance planning', 'Contingency planning']
    },
    {
      icon: TrendingUp,
      title: 'Tax Planning',
      description: 'Optimize tax efficiency and compliance',
      features: ['Tax optimization strategies', 'Compliance management', 'Tax-saving investments']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      <Header />
      
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Financial Advisory Services</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Expert financial guidance to help you make informed decisions and achieve your financial goals with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gradient-primary" asChild>
                  <Link to="/contact">Consult Our Advisors<ArrowRight className="ml-2 w-5 h-5" /></Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Advisory Services</h2>
            <p className="text-muted-foreground">Comprehensive financial solutions tailored to your needs</p>
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

      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Secure Your Financial Future</h2>
          <p className="text-lg mb-8 opacity-90">Get personalized financial advice from our experts</p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
            <Link to="/contact">Book Consultation<ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FinancialAdvisoryPage;
