import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';

const PrivyAlphaCirclePage: React.FC = () => (
  <div className="min-h-screen bg-background">
    <TopHeader />
    <Header />

    <section className="pt-20 pb-24">
      <div className="container max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* LEFT: Content */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>

            {/* Plan name */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Privy Alpha League
              </h1>
            </div>

            {/* Tagline — indented */}
            <p className="text-base font-semibold text-primary mb-6" style={{ marginLeft: '52px' }}>
              A Network Initiative Connecting People to Opportunities.
            </p>

            {/* Description — indented */}
            <p className="text-muted-foreground text-sm leading-relaxed mb-8" style={{ marginLeft: '52px' }}>
             “Our networking platform empowers you to unlock limitless opportunities across India and global markets, driving sustainable business growth. We offer comprehensive support in wealth management, industry-led business consultancy, and access to exclusive events. Members also benefit from curated health & wellness programs, personality development training, and special privileges, including discounts on car booking services both in India and internationally.”
            </p>

            <div style={{ marginLeft: '120px' }}>
              <Button className="bg-gradient-to-r from-primary to-secondary text-white border-0 px-8" asChild>
                <Link to="/register">
                  Get Invited <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* RIGHT: Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl overflow-hidden shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=700&h=500&fit=crop"
              alt="Privy Alpha League"
              className="w-full h-full object-cover"
            />
          </motion.div>

        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default PrivyAlphaCirclePage;
