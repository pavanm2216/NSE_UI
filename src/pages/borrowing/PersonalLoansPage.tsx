import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Calculator, Clock, Shield, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';
import { Link } from 'react-router-dom';

const PersonalLoansPage: React.FC = () => {
  const features = [
    { icon: TrendingDown, title: 'Competitive Rates', description: 'Interest rates starting from 10.49% p.a.' },
    { icon: Clock, title: 'Quick Approval', description: 'Get approval in as fast as 24 hours' },
    { icon: Calculator, title: 'Flexible Tenure', description: 'Repayment period from 12 to 60 months' },
    { icon: Shield, title: 'Secure Process', description: 'Safe and transparent loan processing' },
  ];

  const loanTypes = [
    {
      title: 'Personal Loan',
      amount: 'Up to ₹25 Lakhs',
      rate: '10.49% p.a. onwards',
      tenure: '12-60 months',
      features: ['No collateral required', 'Minimal documentation', 'Quick disbursal']
    },
    {
      title: 'Salary Advance Loan',
      amount: 'Up to ₹5 Lakhs',
      rate: '11.99% p.a. onwards',
      tenure: '6-36 months',
      features: ['For salaried individuals', 'Instant approval', 'Flexible repayment']
    },
    {
      title: 'Business Loan',
      amount: 'Up to ₹50 Lakhs',
      rate: '12.49% p.a. onwards',
      tenure: '12-84 months',
      features: ['For business expansion', 'Working capital support', 'Customized solutions']
    }
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
                Personal Loans for Every Need
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Get instant personal loans with competitive interest rates, flexible tenure, and minimal documentation. 
                Whether it's for a wedding, education, medical emergency, or home renovation - we've got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gradient-primary" asChild>
                  <Link to="/register">
                    Apply Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline">
                  Calculate EMI
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-6">Loan Highlights</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span>Loan amount up to ₹25 Lakhs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span>Interest rates from 10.49% p.a.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span>Tenure up to 60 months</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span>No hidden charges</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span>Minimal documentation</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Personal Loans?</h2>
            <p className="text-muted-foreground">Experience hassle-free borrowing with our customer-centric approach</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Types */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Loan Type</h2>
            <p className="text-muted-foreground">Tailored solutions for different financial needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {loanTypes.map((loan, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">{loan.title}</h3>
                  <div className="space-y-3 mb-6">
                    <div>
                      <div className="text-sm text-muted-foreground">Loan Amount</div>
                      <div className="font-semibold text-lg">{loan.amount}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Interest Rate</div>
                      <div className="font-semibold text-lg text-primary">{loan.rate}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Tenure</div>
                      <div className="font-semibold">{loan.tenure}</div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    {loan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full" asChild>
                    <Link to="/register">Apply Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Eligibility Criteria</h2>
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Age</h3>
                    <p className="text-muted-foreground">21 to 60 years</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Income</h3>
                    <p className="text-muted-foreground">Minimum monthly income of ₹25,000</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Employment</h3>
                    <p className="text-muted-foreground">Salaried or self-employed with stable income</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Credit Score</h3>
                    <p className="text-muted-foreground">CIBIL score of 650 or above</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Documents Required</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Identity proof (Aadhaar, PAN, Passport)</li>
                      <li>Address proof</li>
                      <li>Income proof (Salary slips, ITR, Bank statements)</li>
                      <li>Recent photographs</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90">Apply now and get instant approval</p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
            <Link to="/register">
              Apply for Personal Loan
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PersonalLoansPage;
