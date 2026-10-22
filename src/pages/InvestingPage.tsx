import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Rocket, ArrowRight, CheckCircle2, PieChart, TrendingUp, Shield, Target, Users, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';
import UnderDevelopmentPopup from '@/components/ui/UnderDevelopmentPopup';

const solutions = [
  {
    icon: User,
    title: 'Individual',
    subtitle: 'Personal Investment Plans',
    description: 'Tailored investment and loan solutions designed for individuals seeking financial growth and security.',
    features: [
      'Business Loan',
      'Loan Rental Discounting',
      'Professional Loan',
      'Loan Against Property',
      'Business Loan for Women',
      'Working Capital Loan',
      'Construction Equipment Loan',
      'Machinery Loan',
      'Healthcare Equipment Loan',
    ],
    href: '/investing/wealth-management',
    color: 'from-primary to-secondary',
  },
  {
    icon: BarChart3,
    title: 'Wealth Management',
    subtitle: 'Grow & Protect',
    description: 'Comprehensive investment and protection services including Mutual Funds, Stock Trading, Insurance, and Fixed Income products tailored to your risk profile.',
    features: ['Mutual funds & SIP investments', 'Direct equity & stock trading', 'Insurance comparison & advisory', 'Tax-saving ELSS & NPS', 'Real-time portfolio tracking'],
    href: '/investing/wealth-management',
    color: 'from-secondary to-teal-700',
  },
  {
    icon: Rocket,
    title: 'Startup Funding',
    subtitle: 'Venture Capital Access',
    description: 'Connect with a curated network of angel investors and venture capitalists. Get the funding and mentorship your startup needs to scale.',
    features: ['Access to 200+ investors & VCs', 'Pitch deck preparation support', 'Term sheet & deal structuring', 'Seed to Series B funding', 'Post-funding operational support'],
    href: '/investing/startup-funding',
    color: 'from-primary to-secondary',
  },
];

const stats = [
  { icon: BarChart3, label: 'Assets Under Management' },
  { icon: Users, label: 'Investor Network' },
  { icon: TrendingUp, label: 'Avg. Portfolio Returns' },
  { icon: Target, label: 'Active Investors' },
];

const features = [
  { icon: PieChart, title: 'Diversified Portfolio', desc: 'Spread risk across multiple asset classes for stable long-term growth.' },
  { icon: TrendingUp, title: 'AI-Driven Insights', desc: 'Data-backed recommendations to maximise your investment returns.' },
  { icon: Shield, title: 'Capital Protection', desc: 'Risk management strategies to protect your principal investment.' },
  { icon: Target, title: 'Goal-Based Planning', desc: 'Align investments with your life goals — retirement, education, home.' },
];

const InvestingPage: React.FC = () => (
  <div className="min-h-screen bg-background">
    <TopHeader />
    <Header />
    <UnderDevelopmentPopup />

    <section className="pt-32 pb-20 bg-gradient-to-br from-secondary/5 to-primary/5">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Invest <span className="text-gradient">Smarter,</span><br />Grow <span className="text-gradient">Faster</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            From mutual funds to startup funding — access India's most comprehensive investing platform with expert guidance at every step.
          </p>
          <Button size="lg" className="gradient-primary text-primary-foreground" asChild>
            <Link to="/register">Start Investing <ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
        </motion.div>
      </div>
    </section>

    <section className="py-12 border-y border-border">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-md">
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm font-semibold text-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Investment Solutions</h2>
          <p className="text-muted-foreground text-lg">Two powerful pathways to grow your wealth</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {solutions.map((sol, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${sol.color} flex items-center justify-center mb-6`}>
                    <sol.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{sol.subtitle}</div>
                  <h3 className="text-xl font-bold mb-3">{sol.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed flex-grow">{sol.description}</p>
                  <ul className="space-y-2 mb-6">
                    {sol.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" asChild>
                    <Link to={sol.href}>Explore <ArrowRight className="ml-2 w-4 h-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Invest with Lendrix?</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <Card key={i} className="text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-full bg-secondary/10 mx-auto mb-4 flex items-center justify-center">
                  <f.icon className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 bg-gradient-to-br from-secondary to-secondary/80 text-white">
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Wealth Journey Starts Here</h2>
        <p className="text-lg mb-8 opacity-90">Join 10,000+ investors growing their wealth with Lendrix.</p>
        <Button size="lg" className="bg-white text-secondary hover:bg-white/90" asChild>
          <Link to="/register">Open Free Account <ArrowRight className="ml-2 w-5 h-5" /></Link>
        </Button>
      </div>
    </section>

    <Footer />
  </div>
);

export default InvestingPage;
