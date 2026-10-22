import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Target, TrendingUp, Users, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';
import { Link } from 'react-router-dom';

const BusinessStrategyPage: React.FC = () => {
  const services = [
    {
      icon: Target,
      title: 'Strategic Planning',
      description: 'Develop comprehensive business strategies aligned with your goals',
      features: ['Vision & mission development', 'Goal setting & KPIs', 'Strategic roadmap creation']
    },
    {
      icon: TrendingUp,
      title: 'Growth Strategy',
      description: 'Scale your business with data-driven growth strategies',
      features: ['Market expansion plans', 'Revenue optimization', 'Competitive positioning']
    },
    {
      icon: Users,
      title: 'Organizational Design',
      description: 'Build efficient organizational structures and processes',
      features: ['Team structure optimization', 'Process improvement', 'Change management']
    },
    {
      icon: Lightbulb,
      title: 'Innovation Consulting',
      description: 'Drive innovation and digital transformation',
      features: ['Business model innovation', 'Digital transformation', 'Product development strategy']
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Business Strategy Consulting</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Transform your business with strategic insights and actionable plans. Our expert consultants help you navigate challenges and seize opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gradient-primary" asChild>
                  <Link to="/contact">Schedule Consultation<ArrowRight className="ml-2 w-5 h-5" /></Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Strategy Services</h2>
            <p className="text-muted-foreground">Comprehensive solutions for business growth</p>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-lg mb-8 opacity-90">Let our experts help you build a winning strategy</p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
            <Link to="/contact">Get Started<ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BusinessStrategyPage;
