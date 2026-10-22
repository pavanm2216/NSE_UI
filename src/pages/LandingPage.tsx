import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Shield, 
  Building2, 
  Users, 
  ArrowRight, 
  CheckCircle2,
  BarChart3,
  Wallet,
  Home,
  Briefcase,
  Star,
  ChevronRight,
  Clock,
  Award,
  Target,
  Globe,
  Handshake,
  Smile,
  IndianRupee,
  UsersRound
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/landing/Header';
import FintechIcon3D from '@/components/landing/FintechIcon3D';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';
import CardTestimonials from '@/components/CardTestimonials';
import PartnerWithLendrex from '@/components/landing/PartnerWithLendrex';
import { useLanguage } from '@/hooks/useLanguage';
import UnderDevelopmentPopup from '@/components/ui/UnderDevelopmentPopup';

const GroupIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 90 70" fill="none" stroke="#1e3a8a" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Center person - head */}
    <circle cx="45" cy="18" r="10" />
    {/* Center person - body (rounded rect) */}
    <rect x="30" y="34" width="30" height="22" rx="10" />
    {/* Left person - head */}
    <circle cx="16" cy="21" r="8" />
    {/* Left person - body */}
    <rect x="3" y="35" width="24" height="18" rx="8" />
    {/* Right person - head */}
    <circle cx="74" cy="21" r="8" />
    {/* Right person - body */}
    <rect x="63" y="35" width="24" height="18" rx="8" />
  </svg>
);

const stats = [
  { label: 'stats.trusted_since', icon: Handshake },
  { label: 'stats.happy_investors', icon: Smile },
  { label: 'stats.aum', icon: IndianRupee },
  { label: 'stats.active_dist', icon: null, customIcon: <GroupIcon /> },
];

const services = [
  {
    icon: TrendingUp,
    title: 'Debt Management',
    description: 'Access loans from 50+ banks & NBFCs. Compare rates, apply instantly, and track your applications.',
    href: '/services/debt',
    color: 'from-primary to-primary/80',
    fullContent: {
      overview: 'Get instant access to competitive loan products from over 50 leading banks and NBFCs across India. Our AI-powered platform helps you find the best rates tailored to your financial profile.',
      features: [
        'Compare interest rates from 50+ lenders in real-time',
        'Instant loan eligibility check without affecting credit score',
        'Digital application process with minimal documentation',
        'Track application status across multiple lenders',
        'Personal, business, home, and vehicle loans available',
        'Dedicated relationship manager for premium customers'
      ],
      benefits: [
        'Save up to 2% on interest rates through our partnerships',
        'Get loan approval in as fast as 24-48 hours',
        'Flexible repayment options tailored to your cash flow',
        'Zero platform fees for loan applications'
      ]
    }
  },
  {
    icon: BarChart3,
    title: 'Wealth Management',
    description: 'Grow your wealth with curated investment products. Mutual funds, bonds, and fixed income solutions.',
    href: '/services/wealth',
    color: 'from-secondary to-secondary/80',
    fullContent: {
      overview: 'Build and grow your wealth with our comprehensive investment solutions. Access curated portfolios, expert advisory, and cutting-edge tools to achieve your financial goals.',
      features: [
        'Curated mutual fund portfolios based on risk profile',
        'Direct equity investment with research reports',
        'Fixed income products: bonds, FDs, and NCDs',
        'Tax-saving investment options (ELSS, PPF, NPS)',
        'Real-time portfolio tracking and rebalancing alerts',
        'Dedicated wealth advisor for portfolios above ₹10L'
      ],
      benefits: [
        'Zero commission on direct mutual funds',
        'AI-driven portfolio recommendations',
        'Tax optimization strategies to maximize returns',
        'Regular performance reviews and insights'
      ]
    }
  },
  {
    icon: Home,
    title: 'Real Estate Legacy & Marketplace',
    description: 'Enjoy exclusive membership privileges with access to special discounts, while becoming part of a legacy-driven ecosystem built on trust, growth, and powerful networking.',
    href: '/services/real-estate',
    color: 'from-accent to-accent/80',
    fullContent: {
      overview: 'Explore verified premium properties across India. Whether you\'re looking for your dream home or a lucrative investment opportunity, we connect you with the best real estate options.',
      features: [
        '5,000+ verified residential and commercial properties',
        'Virtual property tours and 3D walkthroughs',
        'ROI calculator for investment properties',
        'Legal verification and documentation support',
        'Home loan assistance with pre-approved offers',
        'Property management services for investors'
      ],
      benefits: [
        'Access to exclusive pre-launch projects',
        'Negotiation support from real estate experts',
        'End-to-end transaction management',
        'Post-purchase rental management services'
      ]
    }
  },
  {
    icon: Briefcase,
    title: 'Venture Capital Advisory & Startup Ecosystem Consulting',
    description: 'Enabling startups to access the right investors, structure capital efficiently, scale sustainably, while providing comprehensive support in navigating government grants and schemes.',
    href: '/services/consultancy',
    color: 'from-primary to-secondary',
    fullContent: {
      overview: 'Scale your business with strategic guidance and funding. Connect with experienced consultants and venture capitalists who understand your industry and growth challenges.',
      features: [
        'Business strategy and growth consulting',
        'Financial planning and fundraising support',
        'Venture capital and angel investor connections',
        'Market research and competitive analysis',
        'Operational efficiency and cost optimization',
        'Mergers, acquisitions, and exit strategy planning'
      ],
      benefits: [
        'Access to network of 200+ investors and VCs',
        'Industry-specific expert consultants',
        'Pitch deck preparation and investor presentations',
        'Post-funding operational support'
      ]
    }
  },
];

const features = [
  'AI-Powered Recommendations',
  'Real-time Portfolio Tracking',
  'Secure Document Vault',
  'Expert Advisory Support',
  'Multi-lingual Support',
  'Compliance & Security',
];

const testimonials = [
  {
    id: '1',
    name: 'Kavitha B',
    role: 'Vice President, Wells Fargo',
    text: 'Secured a home loan at the best market interest rates with a smooth process and convenient doorstep service.',
    avatarUrl: './reviews/kavitha.jpeg'
  }
];

const partners = [
  'HDFC', 'ICICI ', 'SBI', 'Axis', 'Kotak', 'Bajaj Finserv', 'Tata Capital', 'L&T Finance'
];



const LandingPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [showVCForm, setShowVCForm] = useState(false);
  const [vcForm, setVCForm] = useState({ name: '', mobile: '', email: '', idNumber: '', services: '' });
  const [vcSubmitted, setVCSubmitted] = useState(false);
  const [vcStep, setVCStep] = useState<'form' | 'payment' | 'processing' | 'success'>('form');
  const [payMethod, setPayMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [upiId, setUpiId] = useState('');
  const [bankName, setBankName] = useState('');
  const [payErrors, setPayErrors] = useState<Record<string, string>>({});
  const { t } = useLanguage();

  const handleServiceClick = (service: typeof services[0]) => {
    if (service.title.startsWith('Venture Capital')) {
      setVCForm({ name: '', mobile: '', email: '', idNumber: '', services: '' });
      setVCSubmitted(false);
      setVCStep('form');
      setCardData({ number: '', name: '', expiry: '', cvv: '' });
      setUpiId('');
      setBankName('');
      setPayErrors({});
      setShowVCForm(true);
    } else {
      setSelectedService(service);
    }
  };

  const handleVCSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVCStep('payment');
  };

  const formatCardNum = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 3 ? `${d.slice(0,2)}/${d.slice(2)}` : d; };

  const handleVCPay = () => {
    const e: Record<string, string> = {};
    if (payMethod === 'card') {
      if (cardData.number.replace(/\s/g, '').length < 16) e.number = 'Enter valid 16-digit card number';
      if (!cardData.name.trim()) e.name = 'Enter cardholder name';
      if (cardData.expiry.length < 5) e.expiry = 'Enter valid expiry MM/YY';
      if (cardData.cvv.length < 3) e.cvv = 'Enter valid CVV';
    } else if (payMethod === 'upi') {
      if (!upiId.includes('@')) e.upi = 'Enter valid UPI ID';
    } else {
      if (!bankName) e.bank = 'Select a bank';
    }
    setPayErrors(e);
    if (Object.keys(e).length > 0) return;
    setVCStep('processing');
    setTimeout(() => setVCStep('success'), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      <Header />

       

      <section className="relative pt-6 pb-6">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="w-full px-6 lg:px-12 relative z-10">
          {/* Hero two-column: text left, icon right */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

            {/* Left: Text */}
            <div className="flex-1 text-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Shield className="w-4 h-4" />
                  {t('hero.trusted')}
                </span>
              </motion.div>

              <motion.p
                className="text-lg md:text-xl text-gray-900 font-semibold mb-3 max-w-xl"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              >
                "Invest in <span style={{ fontWeight: 800, background: 'linear-gradient(135deg, #1A3D6E, #2A6F8D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Mutual Fund</span> Investments, <span style={{ fontWeight: 800, background: 'linear-gradient(135deg, #1A3D6E, #2A6F8D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Loan Support</span>, Real Estate Legacy Planning &amp; Startup Advisory."
              </motion.p>

              <motion.h1
                className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 leading-tight whitespace-nowrap"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              >
                India's <span style={{ color: '#1e3a8a' }}>1<sup style={{ fontSize: '0.55em', verticalAlign: 'super', color: '#1e3a8a' }}>st</sup></span> Pioneering{' '}<span className="text-gradient">{t('hero.title2')}</span>{' '}<span className="text-gradient">{t('hero.title3')}</span>
              </motion.h1>

              <motion.p
                className="text-sm font-bold text-muted-foreground mb-6"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
              >
                “Offering a unique boutique ecosystem across four strategic verticals.”
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-start"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Button size="lg" className="gradient-primary text-primary-foreground shadow-glow" asChild>
                  <Link to="/register">
                    {t('hero.getstarted')}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/opportunities">{t('hero.explore')}</Link>
                </Button>
              </motion.div>
            </div>

            {/* Right: 3D Fintech Icon */}
            <motion.div
              className="flex-shrink-0 w-44 h-44 md:w-56 md:h-56 lg:w-[240px] lg:h-[240px]"
              initial={{ opacity: 0, x: 60, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            >
              <FintechIcon3D />
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-6"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
          >
            {stats.map((stat, index) => (
              <Card key={index} className="glass card-hover border-0">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 mx-auto mb-3 text-primary flex items-center justify-center">
                    {stat.customIcon ?? <stat.icon className="w-8 h-8 text-primary" />}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground mt-1">{t(stat.label)}</div>
                  <div className="text-xl font-bold text-primary mt-1">{t(stat.label + '_val')}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

       {/* Trusted Partners */}
      <section className="py-10 border-y border-border">
        <div className="container">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('partners.title')}</h2>
            <p className="text-muted-foreground">{t('partners.subtitle')}</p>
          </div>
          <div className="relative overflow-hidden">
            <div 
              className="flex gap-12 md:gap-16 animate-scroll hover:pause-animation"
              style={{
                animation: 'scroll 20s linear infinite',
                width: 'calc(200% + 8rem)'
              }}
            >
              {[...partners, ...partners].map((partner, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0 text-xl md:text-2xl font-bold text-muted-foreground/70 hover:text-foreground transition-colors whitespace-nowrap"
                >
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll {
            animation: scroll 20s linear infinite;
          }
          .hover\\:pause-animation:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      {/* Services Section */}
      <section id="services" className="py-10 bg-muted/30">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('services.title')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card 
                  className="h-full card-hover group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300"
                  onClick={() => handleServiceClick(service)}
                >
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <service.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed flex-grow">{service.description}</p>
                    <button
                      className="inline-flex items-center text-sm font-semibold text-primary hover:gap-2 transition-all group-hover:translate-x-1"
                    >
                      Learn More <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

     

      {/* Features Section - Removed */}

      {/* Testimonials */}
      <section className="py-6 bg-muted/30">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('testimonials.title')}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t('testimonials.subtitle')}
            </p>
          </div>
          
          <CardTestimonials testimonials={testimonials} />
        </div>
      </section>

      {/* Partner Section */}
      <PartnerWithLendrex />
      <Footer />

      {/* CTA Section - Commented Out
      <div className="pt-[110px]">
        <div className="container">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-90" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNHMtNi4yNjggMTQtMTQgMTR6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-30" />
            <div className="relative z-10 p-8 md:p-16 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('cta.title')}
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                {t('cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <Link to="/register">
                    {t('cta.create')}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link to="/contact">
                    {t('cta.expert')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      

      <Footer />

      {/* Under Maintenance popup */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔧</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Under Maintenance</h3>
              <p className="text-gray-500 text-sm mb-1">We're working hard to bring</p>
              <p className="text-primary font-semibold text-sm mb-4">{selectedService.title}</p>
              <p className="text-gray-400 text-xs mb-6">This feature will be available soon. Stay tuned!</p>
              <button
                onClick={() => setSelectedService(null)}
                className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VC Registration Form Popup */}
      <AnimatePresence>
        {showVCForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => vcStep !== 'processing' && setShowVCForm(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            >
              {/* STEP 1: Form */}
              {vcStep === 'form' && (
                <div className="p-7">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Venture Capital Advisory</h3>
                  <p className="text-sm text-muted-foreground mb-5">Fill in your details and we'll get back to you.</p>
                  <form onSubmit={handleVCSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                      <input required type="text" placeholder="Your full name" value={vcForm.name}
                        onChange={e => setVCForm({ ...vcForm, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No <span className="text-red-500">*</span></label>
                      <input required type="tel" placeholder="+91 98765 43210" value={vcForm.mobile}
                        onChange={e => setVCForm({ ...vcForm, mobile: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                      <input required type="email" placeholder="you@example.com" value={vcForm.email}
                        onChange={e => setVCForm({ ...vcForm, email: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar / PAN <span className="text-red-500">*</span></label>
                      <input required type="text" placeholder="Aadhaar or PAN number" value={vcForm.idNumber}
                        onChange={e => setVCForm({ ...vcForm, idNumber: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Consulting Services</label>
                      <textarea rows={3} placeholder="Describe which services you are interested in..." value={vcForm.services}
                        onChange={e => setVCForm({ ...vcForm, services: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">Submit</button>
                      <button type="button" onClick={() => setShowVCForm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 2: Payment */}
              {vcStep === 'payment' && (
                <div>
                  <div className="bg-[#1E3A6D] text-white px-5 py-3 rounded-t-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-[#1E3A6D]" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Lendrix Ventech</p>
                        <p className="text-xs text-white/70">VC Advisory Consultation</p>
                      </div>
                    </div>
                    <div className="text-xs text-white/80 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Secured by Razorpay
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4 bg-gray-50 rounded-lg px-4 py-2">
                      <span className="text-sm text-gray-600">Consultation Fee</span>
                      <span className="font-bold text-[#1E3A6D]">₹2,999</span>
                    </div>
                    {/* Method tabs */}
                    <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-4">
                      {(['card','upi','netbanking'] as const).map(m => (
                        <button key={m} onClick={() => { setPayMethod(m); setPayErrors({}); }}
                          className={`flex-1 py-2 text-xs font-medium transition-colors ${
                            payMethod === m ? 'bg-[#1E3A6D] text-white' : 'text-gray-500 hover:bg-gray-50'
                          }`}>
                          {m === 'card' ? 'Card' : m === 'upi' ? 'UPI' : 'Net Banking'}
                        </button>
                      ))}
                    </div>

                    {payMethod === 'card' && (
                      <div className="space-y-3">
                        <div>
                          <input placeholder="Card Number" value={cardData.number}
                            onChange={e => setCardData({ ...cardData, number: formatCardNum(e.target.value) })}
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${payErrors.number ? 'border-red-400' : 'border-gray-300'}`} />
                          {payErrors.number && <p className="text-xs text-red-500 mt-1">{payErrors.number}</p>}
                        </div>
                        <div>
                          <input placeholder="Cardholder Name" value={cardData.name}
                            onChange={e => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${payErrors.name ? 'border-red-400' : 'border-gray-300'}`} />
                          {payErrors.name && <p className="text-xs text-red-500 mt-1">{payErrors.name}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <input placeholder="MM/YY" value={cardData.expiry} maxLength={5}
                              onChange={e => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${payErrors.expiry ? 'border-red-400' : 'border-gray-300'}`} />
                            {payErrors.expiry && <p className="text-xs text-red-500 mt-1">{payErrors.expiry}</p>}
                          </div>
                          <div>
                            <input placeholder="CVV" type="password" maxLength={4} value={cardData.cvv}
                              onChange={e => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g,'').slice(0,4) })}
                              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${payErrors.cvv ? 'border-red-400' : 'border-gray-300'}`} />
                            {payErrors.cvv && <p className="text-xs text-red-500 mt-1">{payErrors.cvv}</p>}
                          </div>
                        </div>
                      </div>
                    )}

                    {payMethod === 'upi' && (
                      <div>
                        <input placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)}
                          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${payErrors.upi ? 'border-red-400' : 'border-gray-300'}`} />
                        {payErrors.upi && <p className="text-xs text-red-500 mt-1">{payErrors.upi}</p>}
                      </div>
                    )}

                    {payMethod === 'netbanking' && (
                      <div className="grid grid-cols-2 gap-2">
                        {['SBI','HDFC','ICICI','Axis','Kotak','PNB'].map(b => (
                          <button key={b} onClick={() => setBankName(b)}
                            className={`py-2 rounded-lg border text-xs font-medium transition-colors ${
                              bankName === b ? 'border-[#1E3A6D] bg-[#1E3A6D]/10 text-[#1E3A6D]' : 'border-gray-200 hover:border-[#1E3A6D]/50'
                            }`}>{b}</button>
                        ))}
                        {payErrors.bank && <p className="text-xs text-red-500 col-span-2">{payErrors.bank}</p>}
                      </div>
                    )}

                    <button onClick={handleVCPay}
                      className="w-full mt-4 py-2.5 rounded-xl bg-[#2A938F] hover:bg-[#237d7a] text-white text-sm font-semibold transition-colors">
                      Pay ₹2,999
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                      <Shield className="w-3 h-3" /> 256-bit SSL · Powered by <span className="font-bold text-[#2d6be4]">Razorpay</span>
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 3: Processing */}
              {vcStep === 'processing' && (
                <div className="p-10 text-center">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800">Processing Payment...</p>
                  <p className="text-xs text-gray-400 mt-1">Please do not close this window</p>
                </div>
              )}

              {/* STEP 4: Success */}
              {vcStep === 'success' && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Thank you for Registering.</h3>
                  <p className="text-gray-500 text-sm">Our team will reach you out shortly.</p>
                  <button onClick={() => setShowVCForm(false)}
                    className="mt-6 px-8 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
