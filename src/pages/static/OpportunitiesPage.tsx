import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Building2, Briefcase, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';
import { Link } from 'react-router-dom';
import UnderDevelopmentPopup from '@/components/ui/UnderDevelopmentPopup';

const OpportunitiesPage: React.FC = () => {
  const opportunities = [
    { title: 'High-Yield Investment Opportunities', description: 'Curated investment options with potential returns of 12-18% annually', category: 'Investment', minAmount: '₹1,00,000', returns: '12-18% p.a.', risk: 'Medium', icon: TrendingUp, color: 'bg-success' },
    { title: 'Premium Real Estate Projects', description: 'Exclusive pre-launch residential and commercial properties', category: 'Real Estate', minAmount: '₹25,00,000', returns: '15-25% ROI', risk: 'Medium-High', icon: Building2, color: 'bg-warning' },
    { title: 'Startup Investment Opportunities', description: 'Early-stage startup investments with high growth potential', category: 'Venture Capital', minAmount: '₹5,00,000', returns: '20-50% ROI', risk: 'High', icon: Briefcase, color: 'bg-primary' },
    { title: 'Peer-to-Peer Lending', description: 'Lend directly to verified borrowers and earn attractive returns', category: 'Lending', minAmount: '₹50,000', returns: '10-15% p.a.', risk: 'Low-Medium', icon: Users, color: 'bg-info' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      <Header />
      <UnderDevelopmentPopup />

      <section className="pt-32 pb-20">
        <div className="container">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Investment Opportunities</h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Discover curated investment opportunities across different asset classes.
              From high-yield investments to real estate and startup funding.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {opportunities.map((opportunity, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                <Card className="h-full card-hover">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg ${opportunity.color}/10 flex items-center justify-center`}>
                        <opportunity.icon className={`w-6 h-6 ${opportunity.color.replace('bg-', 'text-')}`} />
                      </div>
                      <div>
                        <Badge variant="outline">{opportunity.category}</Badge>
                        <CardTitle className="mt-2">{opportunity.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">{opportunity.description}</p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div><p className="text-sm text-muted-foreground">Min Investment</p><p className="font-semibold">{opportunity.minAmount}</p></div>
                      <div><p className="text-sm text-muted-foreground">Expected Returns</p><p className="font-semibold text-success">{opportunity.returns}</p></div>
                      <div><p className="text-sm text-muted-foreground">Risk Level</p><p className="font-semibold">{opportunity.risk}</p></div>
                      <div><p className="text-sm text-muted-foreground">Duration</p><p className="font-semibold">1-3 years</p></div>
                    </div>
                    <Button className="w-full gradient-primary text-primary-foreground">
                      Learn More <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8">Explore our comprehensive financial services and find the right opportunity for you.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-primary text-primary-foreground" asChild>
                <Link to="/register">Create Account <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/">View All Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OpportunitiesPage;
