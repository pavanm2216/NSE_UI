import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Rocket, Users, Target, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';
import { Link } from 'react-router-dom';

const StartupFundingPage: React.FC = () => {
  const fundingStages = [
    {
      icon: Lightbulb,
      title: 'Seed Funding',
      amount: '₹10 Lakhs - ₹1 Crore',
      description: 'Early-stage funding for idea validation and MVP development',
      features: ['Product development support', 'Market research assistance', 'Mentorship programs', 'Networking opportunities']
    },
    {
      icon: Rocket,
      title: 'Series A',
      amount: '₹1 Crore - ₹10 Crores',
      description: 'Growth capital for scaling operations and market expansion',
      features: ['Business model optimization', 'Team building support', 'Market expansion strategy', 'Operational guidance']
    },
    {
      icon: Target,
      title: 'Series B & Beyond',
      amount: '₹10 Crores+',
      description: 'Large-scale funding for market leadership and expansion',
      features: ['Strategic partnerships', 'International expansion', 'M&A opportunities', 'IPO preparation']
    }
  ];

  const requirements = [
    'Innovative business idea or working product',
    'Strong founding team with relevant experience',
    'Clear market opportunity and scalability',
    'Detailed business plan and financial projections',
    'Traction or proof of concept',
    'Competitive advantage or unique value proposition'
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Startup Funding & Venture Capital
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Connect with investors and secure funding for your startup. From seed to Series B and beyond, 
                we help entrepreneurs access capital and strategic guidance to scale their ventures.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gradient-primary" asChild>
                  <Link to="/register">
                    Apply for Funding
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">
                    Schedule Consultation
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Funding Stages */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Funding Stages We Support</h2>
            <p className="text-muted-foreground">From idea to IPO, we're with you at every stage</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {fundingStages.map((stage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                      <stage.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-center">{stage.title}</h3>
                    <div className="text-center mb-4">
                      <div className="font-semibold text-lg text-primary">{stage.amount}</div>
                    </div>
                    <p className="text-muted-foreground mb-4 text-center">{stage.description}</p>
                    <div className="space-y-2">
                      {stage.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <Users className="w-12 h-12 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Investor Network</h3>
                  <p className="text-muted-foreground">Access to 200+ angel investors, VCs, and institutional investors</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Target className="w-12 h-12 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Strategic Guidance</h3>
                  <p className="text-muted-foreground">Expert mentorship on business strategy, operations, and growth</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Rocket className="w-12 h-12 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Pitch Preparation</h3>
                  <p className="text-muted-foreground">Help with pitch deck, financial modeling, and investor presentations</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Lightbulb className="w-12 h-12 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Due Diligence Support</h3>
                  <p className="text-muted-foreground">Assistance with legal, financial, and technical due diligence</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">What We Look For</h2>
            <Card>
              <CardContent className="p-8">
                <div className="space-y-4">
                  {requirements.map((req, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                      <span className="font-medium">{req}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Application Process</h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                      <h3 className="font-semibold mb-2">Submit Application</h3>
                      <p className="text-muted-foreground">Fill out our application form with your business details and pitch deck</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                      <h3 className="font-semibold mb-2">Initial Screening</h3>
                      <p className="text-muted-foreground">Our team reviews your application and assesses fit with investor criteria</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                      <h3 className="font-semibold mb-2">Investor Matching</h3>
                      <p className="text-muted-foreground">We connect you with relevant investors from our network</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">4</div>
                    <div>
                      <h3 className="font-semibold mb-2">Funding & Closure</h3>
                      <p className="text-muted-foreground">Negotiate terms, complete due diligence, and close the funding round</p>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Scale Your Startup?</h2>
          <p className="text-lg mb-8 opacity-90">Connect with investors and secure funding for your venture</p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
            <Link to="/register">
              Apply Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StartupFundingPage;
