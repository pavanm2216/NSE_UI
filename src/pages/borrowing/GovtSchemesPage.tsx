import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Building2, Users, Briefcase, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';
import { Link } from 'react-router-dom';

const GovtSchemesPage: React.FC = () => {
  const schemes = [
    {
      icon: Briefcase,
      title: 'MUDRA Loan',
      subtitle: 'Micro Units Development & Refinance Agency',
      amount: 'Up to ₹10 Lakhs',
      description: 'Financial support for micro and small enterprises',
      features: [
        'Shishu: Up to ₹50,000',
        'Kishore: ₹50,000 to ₹5 Lakhs',
        'Tarun: ₹5 Lakhs to ₹10 Lakhs',
        'No collateral required'
      ]
    },
    {
      icon: Home,
      title: 'PMAY',
      subtitle: 'Pradhan Mantri Awas Yojana',
      amount: 'Subsidy up to ₹2.67 Lakhs',
      description: 'Housing for all with interest subsidy',
      features: [
        'Credit Linked Subsidy Scheme',
        'Interest subsidy on home loans',
        'For EWS, LIG, and MIG categories',
        'Affordable housing solutions'
      ]
    },
    {
      icon: Users,
      title: 'Stand-Up India',
      subtitle: 'Entrepreneurship for SC/ST & Women',
      amount: '₹10 Lakhs to ₹1 Crore',
      description: 'Loans for greenfield enterprises',
      features: [
        'For SC/ST and women entrepreneurs',
        'Manufacturing, services, or trading',
        'Composite loan including term loan',
        'Margin money assistance available'
      ]
    },
    {
      icon: Building2,
      title: 'Startup India',
      subtitle: 'Support for Startups',
      amount: 'Varies by scheme',
      description: 'Government support for innovative startups',
      features: [
        'Tax exemptions for 3 years',
        'Self-certification compliance',
        'IPR fast-tracking',
        'Fund of Funds access'
      ]
    }
  ];

  const benefits = [
    'Lower interest rates compared to commercial loans',
    'Flexible repayment terms',
    'Government-backed security',
    'Minimal documentation',
    'Tax benefits and subsidies',
    'Support for underserved sectors'
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
                Government Schemes & Grants
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Access government-backed financial schemes designed to support entrepreneurs, 
                homebuyers, and businesses across India. Get subsidized loans, grants, and benefits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gradient-primary" asChild>
                  <Link to="/register">
                    Check Eligibility
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">
                    Talk to Expert
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Schemes */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Government Schemes</h2>
            <p className="text-muted-foreground">Explore schemes tailored for different needs</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {schemes.map((scheme, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <scheme.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">{scheme.title}</h3>
                        <p className="text-sm text-muted-foreground">{scheme.subtitle}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground">Loan Amount</div>
                      <div className="font-semibold text-lg text-primary">{scheme.amount}</div>
                    </div>
                    <p className="text-muted-foreground mb-4">{scheme.description}</p>
                    <div className="space-y-2 mb-6">
                      {scheme.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full" variant="outline" asChild>
                      <Link to="/register">Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Benefits of Government Schemes</h2>
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

      {/* How to Apply */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">How to Apply</h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Check Eligibility</h3>
                      <p className="text-muted-foreground">Verify if you meet the criteria for the scheme you're interested in</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Gather Documents</h3>
                      <p className="text-muted-foreground">Prepare required documents like ID proof, address proof, income proof, and business plan</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Submit Application</h3>
                      <p className="text-muted-foreground">Apply through our platform or directly at the bank/government portal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Get Approval</h3>
                      <p className="text-muted-foreground">Wait for verification and approval. Our team will assist you throughout the process</p>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Help with Government Schemes?</h2>
          <p className="text-lg mb-8 opacity-90">Our experts will guide you through the application process</p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
            <Link to="/contact">
              Contact Our Experts
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GovtSchemesPage;
