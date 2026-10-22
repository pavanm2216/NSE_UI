import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Rocket, CheckCircle2, Users, TrendingUp, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';

const sections = [
  {
    icon: Lightbulb,
    title: 'Start-up Evaluation & Advisory',
    color: 'bg-primary/10',
    iconColor: 'text-primary',
    items: ['Early Stage', 'Growth Stage', 'Connecting to Investor'],
  },
  {
    icon: Rocket,
    title: 'Incubation Services',
    color: 'bg-secondary/10',
    iconColor: 'text-secondary',
    items: ['Mentorship & Guidance', 'Infrastructure Support', 'Go-to-Market Strategy', 'Product Development Advisory'],
  },
  {
    icon: Users,
    title: 'Connecting to VC Firms & Angels',
    color: 'bg-blue-50',
    iconColor: 'text-blue-600',
    items: ['VC Firm Introductions', 'Angel Investor Network', 'Fund Raising Support', 'Pitch Deck Preparation', 'Term Sheet Guidance'],
  },
];

const StartupAdvisoryPage: React.FC = () => (
  <div className="min-h-screen bg-background">
    <TopHeader />
    <Header />

    <section className="pt-8 pb-12 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Business Consultancy</p>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Start-up Consultancy Advisory</h1>
            </div>
          </div>
          <p className="text-muted-foreground text-base max-w-2xl mt-3">
            From early-stage evaluation to connecting with top investors — we guide startups at every step of their growth journey.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="py-16">
      <div className="container max-w-5xl">
        <div className="grid md:grid-cols-3 gap-8">
          {sections.map((sec, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }} viewport={{ once: true }}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-7 h-full">
                <div className={`w-10 h-10 rounded-xl ${sec.color} flex items-center justify-center mb-4`}>
                  <sec.icon className={`w-5 h-5 ${sec.iconColor}`} />
                </div>
                <h3 className="font-bold text-base text-foreground mb-4">{sec.title}</h3>
                <ul className="space-y-2.5">
                  {sec.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2.5 group">
                      <CheckCircle2 className={`w-4 h-4 ${sec.iconColor} flex-shrink-0`} />
                      <span className="text-sm text-gray-700 font-medium group-hover:text-primary transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }} className="mt-12 text-center">
          <Button size="lg" className="gradient-primary text-white px-10" asChild>
            <Link to="/register">Get Advisory Support <ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default StartupAdvisoryPage;
