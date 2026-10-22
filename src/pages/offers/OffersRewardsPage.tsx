import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Star, Search, MapPin , ArrowRight, ShoppingBag, Hotel, Film, Calendar, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';



const businesses = [
  { id: '1', name: 'Mani Ventures', category: 'Technology', location: 'Mumbai', rating: 4.5, description: 'Leading IT solutions provider specializing in Cloud Computing and AI', subscriptionType: 'Premium' },
  { id: '2', name: 'Priya Organics', category: 'Food & Beverage', location: 'Delhi', rating: 4.8, description: 'Organic food delivery service with farm-fresh produce', subscriptionType: 'Basic' },
  { id: '3', name: 'A1 Wellness', category: 'Healthcare', location: 'Bangalore', rating: 4.9, description: 'Multi-speciality healthcare clinic with 24/7 emergency services', subscriptionType: 'Pro' },
   { id: '4', name: 'Ki Edutech', category: 'Education', location: 'Pune', rating: 4.6, description: 'Online learning platform for competitive exams and skill development', subscriptionType: 'Premium' },
  { id: '5', name: 'xyz Collections', category: 'Retail', location: 'Mumbai', rating: 4.3, description: 'Trendy clothing and accessories for men and women', subscriptionType: 'Basic' },
  { id: '6', name: 'leo Digital', category: 'Technology', location: 'Bangalore', rating: 4.7, description: 'Full-service digital marketing agency for startups and enterprises', subscriptionType: 'Premium' },
];



const categoryColors = {
  Technology: 'bg-blue-100 text-blue-700',
  'Food & Beverage': 'bg-green-100 text-green-700',
  Healthcare: 'bg-red-100 text-red-700',
  Education: 'bg-purple-100 text-purple-700',
  Retail: 'bg-orange-100 text-orange-700',
};

const subBadgeColors = {
  Premium: 'bg-secondary/10 text-secondary border-secondary/20',
  Pro: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Basic: 'bg-gray-100 text-gray-600 border-gray-200',
};

const vouchers = [
  {
    icon: Gift,
    title: 'Complimentary Vouchers',
    description: 'Exclusive complimentary vouchers as a token of appreciation for your loyalty and referrals.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=400&fit=crop',
    badge: 'Complimentary',
    accent: '#0055ff',
    light: '#eff4ff',
    border: '#c7d9ff',
  },
  {
    icon: Film,
    title: 'Movie Tickets',
    description: 'Enjoy blockbuster movies with free movie ticket vouchers redeemable at leading multiplex chains across India.',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop',
    badge: 'Entertainment',
    accent: '#e0320a',
    light: '#fff2ef',
    border: '#ffc9be',
  },
  {
    icon: Hotel,
    title: 'Resort Vouchers',
    description: 'Unwind at premium resorts and luxury properties with exclusive stay vouchers for you and your family.',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
    badge: 'Luxury Stay',
    accent: '#007a5e',
    light: '#edfaf5',
    border: '#a8e6d4',
  },
  {
    icon: ShoppingBag,
    title: 'Shopping Vouchers',
    description: 'Shop your favourite brands in-store or online with redeemable vouchers across top retail and e-commerce platforms.',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop',
    badge: 'Shopping',
    accent: '#7c3aed',
    light: '#f5f0ff',
    border: '#d4bbff',
  },
  {
    icon: Calendar,
    title: 'Events Vouchers',
    description: 'Get exclusive access to premium events, concerts, business summits, and networking gatherings.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
    badge: 'Events',
    accent: '#b45309',
    light: '#fffbeb',
    border: '#fcd88a',
  },
];

const steps = [
  { num: '01', icon: Zap,          title: 'Refer a Friend',   desc: 'Share your unique referral link with friends, family, or business contacts.' },
  { num: '02', icon: CheckCircle2, title: 'They Sign Up',     desc: 'Your referral registers and completes their first transaction with Lendrix Ventech.' },
  { num: '03', icon: Gift,         title: 'You Get Rewarded', desc: 'Receive your choice of voucher — movie tickets, resort stays, shopping vouchers, and more.' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
  viewport: { once: true },
});

const OffersRewardsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [openModal, setOpenModal] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  
  const [formData, setFormData] = useState({
  businessName: '',
  ownerName: '',
  email: '',
  phone: '',
  category: '',
  address: '',
  description: '',
  logo: null,
});

const [errors, setErrors] = useState<any>({});

const handleChange = (field: string, value: string) => {
  setFormData(prev => ({
    ...prev,
    [field]: value,
  }));
};

const validate = () => {
  let newErrors: any = {};

  if (!formData.businessName || formData.businessName.length < 2) {
    newErrors.businessName = 'Business name must be at least 2 characters';
  }

  if (!formData.ownerName || formData.ownerName.length < 2) {
    newErrors.ownerName = 'Owner name must be at least 2 characters';
  }

  if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Invalid email address';
  }

  if (!formData.phone || formData.phone.length < 10) {
    newErrors.phone = 'Phone number must be at least 10 digits';
  }

  if (!formData.category) {
    newErrors.category = 'Please select a category';
  }

  if (!formData.address || formData.address.length < 5) {
    newErrors.address = 'Address must be at least 5 characters';
  }

  if (!formData.description || formData.description.length < 10) {
    newErrors.description = 'Description must be at least 10 characters';
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

const handleSubmit = () => {
  if (validate()) {
    console.log('Submitted:', formData);

    setFormData({
      businessName: '',
      ownerName: '',
      email: '',
      phone: '',
      category: '',
      address: '',
      description: '',
      logo: null,
    });

    setErrors({});
    setOpenModal(false);
  }
};

  const filteredBusinesses = businesses.filter(b => {
  const q = searchQuery.toLowerCase();
  return (
    (b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q)) &&
    (categoryFilter === 'all' || b.category === categoryFilter)
  );
});

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', color: '#0f172a' }}>
    <TopHeader />
    <Header />

    <style>{`
      /* ── Card ── */
      .or-card {
        position: relative;
        border-radius: 20px;
        overflow: hidden;
        height: 380px;
        border: 1.5px solid #e2e8f0;
        background: #fff;
        transition: transform 0.4s cubic-bezier(0.22,1,0.36,1),
                    box-shadow 0.4s ease,
                    border-color 0.4s ease;
        cursor: pointer;
      }
      .or-card:hover { transform: translateY(-10px) scale(1.01); }
      .or-card .or-img { transition: transform 0.6s cubic-bezier(0.22,1,0.36,1); }
      .or-card:hover .or-img { transform: scale(1.07); }
      .or-card .or-overlay {
        position: absolute; inset: 0;
        background: linear-gradient(to top, rgba(10,20,50,0.88) 0%, rgba(10,20,50,0.25) 55%, transparent 100%);
        transition: opacity 0.4s;
      }
      .or-card .or-content {
        position: absolute; bottom: 0; left: 0; right: 0;
        padding: 22px;
        transform: translateY(6px);
        transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
      }
      .or-card:hover .or-content { transform: translateY(0); }

      /* ── Badge ── */
      .or-badge {
        display: inline-block;
        font-size: 10px; font-weight: 700;
        letter-spacing: 0.12em; text-transform: uppercase;
        padding: 4px 12px; border-radius: 100px;
        border: 1px solid; margin-bottom: 10px;
        backdrop-filter: blur(8px);
      }

      /* ── Step card ── */
      .or-step {
        background: #fff;
        border: 1.5px solid #e2e8f0;
        border-radius: 20px;
        padding: 36px 28px;
        text-align: center;
        transition: transform 0.4s cubic-bezier(0.22,1,0.36,1),
                    border-color 0.4s, box-shadow 0.4s;
      }
      .or-step:hover {
        transform: translateY(-8px);
        border-color: #93c5fd;
        box-shadow: 0 20px 50px rgba(0,85,255,0.1);
      }

      /* ── CTA button ── */
      .or-btn {
        display: inline-flex; align-items: center; gap: 8px;
        background: linear-gradient(135deg, #1E3A6D 0%, #2A938F 100%);
        color: #fff; font-weight: 700; font-size: 15px;
        letter-spacing: 0.03em;
        padding: 14px 36px; border-radius: 12px;
        text-decoration: none;
        box-shadow: 0 8px 28px rgba(29,78,216,0.35);
        transition: transform 0.3s, box-shadow 0.3s;
        position: relative; overflow: hidden;
      }
      .or-btn::after {
        content: '';
        position: absolute; inset: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%);
        pointer-events: none;
      }
      .or-btn:hover {
        transform: translateY(-2px) scale(1.03);
        box-shadow: 0 14px 40px rgba(29,78,216,0.45);
      }

      /* ── Section label ── */
      .or-label {
        display: inline-flex; align-items: center; gap: 10px;
        font-size: 11px; font-weight: 700;
        letter-spacing: 0.18em; text-transform: uppercase;
        color: #1E3A6D; margin-bottom: 14px;
      }
      .or-label::before, .or-label::after {
        content: ''; display: block;
        width: 28px; height: 1.5px;
        background: #1E3A6D; opacity: 0.4;
      }

      /* ── Stat pill ── */
      .or-stat {
        background: #fff;
        border: 1.5px solid #e2e8f0;
        border-radius: 14px;
        padding: 16px 28px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        transition: transform 0.3s, box-shadow 0.3s;
      }
      .or-stat:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(29,78,216,0.12);
      }
    `}</style>

    {/* ── Hero ── */}
    <section style={{ position: 'relative', paddingTop: '32px', paddingBottom: '100px', overflow: 'hidden', background: 'linear-gradient(160deg, #f0f6ff 0%, #f8faff 60%, #fff 100%)' }}>
      {/* Subtle dot grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, #c7d9ff 1px, transparent 1px)', backgroundSize: '36px 36px', opacity: 0.55 }} />
      {/* Soft radial bloom */}
      <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '500px', background: 'radial-gradient(ellipse, rgba(29,78,216,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#eff4ff', border: '1.5px solid #c7d9ff', borderRadius: '100px', padding: '8px 20px', marginBottom: '28px' }}>
            <Sparkles style={{ width: '14px', height: '14px', color: '#1E3A6D' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1E3A6D' }}>Client Referral Program</span>
          </div>

          <h1 style={{ fontSize: 'clamp(38px, 6.5vw, 68px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: '22px' }}>
            Refer & Earn{' '}
            <span style={{ background: 'linear-gradient(135deg, #1E3A6D 0%, #1E3A6D 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Exclusive Rewards
            </span>
          </h1>

          <p style={{ fontSize: '18px', color: '#475569', maxWidth: '540px', margin: '0 auto 40px', lineHeight: 1.75 }}>
            Refer your friends and colleagues to Lendrix Ventech and unlock a world of exclusive vouchers — from movie tickets to luxury resort stays.
          </p>

          <Link to="/register" className="or-btn">
            Start Referring <ArrowRight style={{ width: '18px', height: '18px' }} />
          </Link>
        </motion.div>

        {/* Stat pills */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '40px', flexWrap: 'wrap' }}>
          {[['5+', 'Voucher Types'], ['100%', 'Free to Join'], ['Instant', 'Rewards']].map(([val, label]) => (
            <div key={label} className="or-stat">
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#1E3A6D', letterSpacing: '-0.02em' }}>{val}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px', letterSpacing: '0.05em' }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

{/* ── Business Ecosystem ── */}
<section style={{ padding: '20px 20px', background: '#f8fafc' }}>
  <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

    {/* Heading above Business Ecosystem */}
    <motion.h2 {...fadeUp()} style={{ fontSize: 'clamp(45px, 3.5vw, 38px)', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a', marginBottom: '20px', textAlign: 'center' }}>
      Unlock Exclusive Benefits &amp; Privileges with{' '}
      <span style={{ background: 'linear-gradient(135deg, #1E3A6D 0%, #1E3A6D 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        Lendrix Club Membership
      </span>
    </motion.h2>

    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Gift className="w-5 h-5 text-teal-600" />
          Business Ecosystem
        </h2>
        <p className="text-sm text-gray-500">
          Discover & connect with verified businesses
        </p>
      </div>

    <button
  onClick={() => setOpenModal(true)}
  className="bg-[#1E3A6D] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
>
  + Add Business
</button>
    </div>

    {/* Search + Filter */}
    <div className="flex gap-4 mb-6 flex-wrap">
      <div className="flex items-center border rounded-lg px-3 py-2 bg-white w-full md:w-[70%]">
        <Search className="w-4 h-4 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search businesses..."
          className="w-full outline-none text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <select
        className="border rounded-lg px-3 py-2 bg-white text-sm"
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="all">All Categories</option>
        <option value="Technology">Technology</option>
        <option value="Food & Beverage">Food & Beverage</option>
        <option value="Healthcare">Healthcare</option>
        <option value="Education">Education</option>
        <option value="Retail">Retail</option>
      </select>
    </div>

    <div className="flex items-center justify-between mb-4">
              
              <Badge variant="outline" className="text-xs text-secondary border-secondary/30">Live</Badge>
            </div>


    {/* Count */}
    <p className="text-sm text-gray-500 mb-4">
      {filteredBusinesses.length} businesses listed
    </p>

    {/* Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {filteredBusinesses.map((b) => (
        <div
          key={b.id}
          className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
        >
          {/* Top */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                {b.name.charAt(0)}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  {b.name}
                </h3>

                <div className="flex items-center text-xs text-gray-500 gap-1">
                  <Star className="w-3 h-3 text-teal-500 fill-teal-500" />
                  {b.rating}
                </div>
              </div>
            </div>

            {/* Subscription badge */}
            <span className={`text-xs px-2 py-1 rounded-full border ${subBadgeColors[b.subscriptionType as keyof typeof subBadgeColors]}`}>
              {b.subscriptionType}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 mb-5">
            {b.description}
          </p>

          {/* Category + Location */}
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-6">
            <span className={`px-2 py-1 rounded-full ${categoryColors[b.category as keyof typeof categoryColors]}`}>
              {b.category}
            </span>

            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {b.location}
            </span>
          </div>

          {/* Button */}
          <button className="w-full bg-gradient-to-r from-[#1E3A6D] to-[#2A938F] text-white text-sm font-bold py-2 rounded-lg hover:opacity-90 transition">

  
            Contact Business
          </button>
        </div>
      ))}
    </div>

  </div>
</section>

    {/* ── Voucher Cards ── */}
    <section style={{ padding: '30px 20px', background: '#f8faff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="or-label">What You Earn</div>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a', marginBottom: '12px' }}>Voucher Types</h2>
          <p style={{ color: '#64748b', maxWidth: '460px', margin: '0 auto', lineHeight: 1.75 }}>
            Choose from a variety of exciting rewards when your referral completes their first transaction.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '24px' }}>
          {vouchers.map((v, i) => (
            <motion.div key={i} {...fadeUp(i * 0.09)}>
              <div
                className="or-card"
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = `0 24px 56px ${v.accent}22`;
                  el.style.borderColor = v.border;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = 'none';
                  el.style.borderColor = '#e2e8f0';
                }}
              >
                <img src={v.image} alt={v.title} className="or-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div className="or-overlay" />

                {/* Badge top-left */}
                <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
                  <span className="or-badge" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.35)', background: `${v.accent}cc` }}>
                    {v.badge}
                  </span>
                </div>

                {/* Icon top-right */}
                <div style={{ position: 'absolute', top: '14px', right: '14px', width: '38px', height: '38px', borderRadius: '11px', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                  <v.icon style={{ width: '17px', height: '17px', color: '#fff' }} />
                </div>

                <div className="or-content">
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '7px', letterSpacing: '-0.01em' }}>{v.title}</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>{v.description}</p>
                  <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 600, color: '#93c5fd' }}>
                    <span>Learn more</span>
                    <ArrowRight style={{ width: '13px', height: '13px' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>



    {/* ── How It Works ── */}
    <section style={{ padding: '40px 24px', background: '#fff', borderTop: '1px solid #e8eef8', borderBottom: '1px solid #e8eef8' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="or-label">Simple Process</div>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>How It Works</h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {steps.map((s, i) => (
            <motion.div key={i} {...fadeUp(i * 0.15)}>
              <div className="or-step">
                <div style={{ position: 'relative', display: 'inline-flex', marginBottom: '22px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, #eff4ff 0%, #dbeafe 100%)', border: '1.5px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <s.icon style={{ width: '26px', height: '26px', color: '#1E3A6D' }} />
                  </div>
                  <span style={{ position: 'absolute', top: '-8px', right: '-8px', width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #1E3A6D, #0ea5e9)', fontSize: '10px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {s.num}
                  </span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '10px', color: '#0f172a' }}>{s.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

   

   
   {openModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
   onClick={() => setOpenModal(false)}
  >
    <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl max-h-[90vh] flex flex-col"
     onClick={(e) => e.stopPropagation()}
>

      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b">
         <div>
    <h2 className="text-lg font-semibold">Add Your Business</h2>
    <p className="text-sm text-gray-500 mt-1">
      Submit your business for approval. Admin will review and approve it.
    </p>
  </div>

  {/* Close button */}
  <button onClick={() => setOpenModal(false)}>✕</button>

</div>

      {/* Form */}
      <div className="overflow-y-auto p-5 space-y-4">

        {/* Business Name */}
        <div>
          <label>Business Name</label>
          <input
          placeholder="Enter business name"
            value={formData.businessName}
            onChange={(e) => handleChange('businessName', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
          {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName}</p>}
        </div>

        {/* Owner Name */}
        <div>
          <label>Owner Name</label>
          <input
          placeholder="Enter owner name"
            value={formData.ownerName}
            onChange={(e) => handleChange('ownerName', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
          {errors.ownerName && <p className="text-red-500 text-sm">{errors.ownerName}</p>}
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Email</label>
            <input
             placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label>Phone</label>
            <input
            placeholder="1234567890"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
        </div>

        {/* Category */}
        <div>
          <label>Category</label>
          <Select value={formData.category} onValueChange={(val) => handleChange('category', val)}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {['Technology','Food & Beverage','Healthcare','Education','Retail','Manufacturing','Services'].map((cat) => (
                <SelectItem key={cat} value={cat} className="hover:bg-teal-600 hover:text-white focus:bg-teal-600 focus:text-white cursor-pointer">{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>

        {/* Address */}
        <div>
          <label>Address</label>
          <input
           placeholder="Enter business address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
        </div>

        {/* Description */}
        <div>
          <label>Description</label>
          <textarea
          placeholder="Describe your business..."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

   {/* Business Logo */}
<div>
  <label className="block mb-1">Business Logo</label>

  <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition relative overflow-hidden">

    {/* ✅ Show Image if uploaded */}
    {logoPreview ? (
      <img
        src={logoPreview}
        alt="Logo Preview"
        className="w-full h-40 object-contain"
      />
    ) : (
      <>
        {/* Upload Icon */}
        <svg
          className="w-8 h-8 text-gray-400 mb-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12v-8m0 0l-3 3m3-3l3 3" />
        </svg>

        {/* Text */}
        <span className="text-gray-500 text-sm">
          Click to upload logo
        </span>
      </>
    )}

    {/* Hidden Input */}
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          handleChange('logo', file);
          setLogoPreview(URL.createObjectURL(file));
        }
      }}
    />
  </label>
</div>


      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 p-5 border-t">
        <button onClick={() => setOpenModal(false)} className="border px-4 py-2 rounded-lg">
          Cancel
        </button>

        <button onClick={handleSubmit} className="bg-[#2A938F] text-white px-6 py-2 rounded-lg">
          Submit for Approval
        </button>
      </div>

    </div>
  </div>
)}

    <Footer />
  </div>
  );
};


export default OffersRewardsPage;
