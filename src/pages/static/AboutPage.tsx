import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Target, Users, Award, TrendingUp, Phone, BarChart3, Home, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MeetOurTeam from '@/components/landing/MeetOurTeam';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';

const ScrollRod: React.FC<{ flip?: boolean }> = ({ flip }) => (
  <div className="relative flex-shrink-0" style={{ height: '22px', zIndex: 10, maxWidth: '440px', margin: '0 auto', width: '100%' }}>
    <div style={{
      position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)',
      height: '16px', borderRadius: '8px',
      background: flip
        ? 'linear-gradient(180deg,hsl(220,65%,30%) 0%,hsl(220,65%,42%) 45%,hsl(220,65%,28%) 100%)'
        : 'linear-gradient(180deg,hsl(220,65%,42%) 0%,hsl(220,65%,30%) 55%,hsl(220,65%,22%) 100%)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 0 1px 3px rgba(255,255,255,0.18)',
    }} />
    {[0, 1].map(side => (
      <div key={side} style={{
        position: 'absolute',
        [side === 0 ? 'left' : 'right']: '-9px',
        top: '50%', transform: 'translateY(-50%)',
        width: '28px', height: '28px', borderRadius: '50%',
        background: 'radial-gradient(circle at 36% 32%, hsl(220,65%,58%), hsl(220,65%,20%))',
        boxShadow: '0 3px 10px rgba(0,0,0,0.5), inset 0 1px 3px rgba(255,255,255,0.3)',
        border: '1.5px solid rgba(255,255,255,0.22)',
        zIndex: 11,
      }} />
    ))}
  </div>
);

const MissionVisionRollout: React.FC = () => {
  const progress = useMotionValue(0);
  const clipPath = useTransform(
    progress,
    [0, 1],
    ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)']
  );
  // bottom rod starts at top (negative of full paper height) and rolls down to 0
  const bottomY = useTransform(progress, [0, 1], ['-100%', '0%']);

  useEffect(() => {
    const controls = animate(progress, 1, {
      duration: 2.2,
      ease: [0.12, 0.8, 0.32, 1],
      delay: 0.3,
    });
    return controls.stop;
  }, []);

  return (
    <div className="mb-8 w-full" style={{ position: 'relative', paddingLeft: '10px', paddingRight: '10px' }}>

      {/* Fixed top rod */}
      <ScrollRod />

      {/* Clipped paper + bottom rod together so rod rides the paper edge */}
      <div style={{ position: 'relative' }}>
        {/* Paper revealed top-to-bottom via clipPath */}
        <div style={{ overflow: 'hidden' }}>
          <motion.div style={{ clipPath }}>
            <div style={{
              maxWidth: '400px',
              margin: '0 auto',
              background: 'linear-gradient(180deg, #eef4ff 0%, #dbeafe 45%, #e0f2fe 75%, #e8f8f5 100%)',
              borderLeft: '1px solid rgba(30,80,180,0.15)',
              borderRight: '1px solid rgba(30,80,180,0.15)',
              boxShadow: '2px 0 8px rgba(30,80,180,0.06), -2px 0 8px rgba(30,80,180,0.06)',
              position: 'relative',
            }}>
              <div className="relative px-10 py-7">

            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/25" />
              <Target className="w-3.5 h-3.5 text-primary/40" />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/25" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="text-center mb-3"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full gradient-primary shadow-md mb-2">
                <Target className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">Our Mission</p>
              <div className="w-8 h-px bg-primary/30 mx-auto mb-3" />
              <p className="text-sm text-gray-600 leading-relaxed italic max-w-xs mx-auto">
                To empower individuals and businesses to achieve financial success by connecting them with innovations & technology.
              </p>
            </motion.div>

            <div className="flex items-center gap-1.5 justify-center my-2">
              {[0,1,2].map(i => (
                <div key={i} className="rounded-full bg-primary/25" style={{ width: i===1?'6px':'4px', height: i===1?'6px':'4px' }} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="text-center mb-3"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-secondary/80 shadow-md mb-2">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-2">Our Vision</p>
              <div className="w-8 h-px bg-secondary/30 mx-auto mb-3" />
              <p className="text-sm text-gray-600 leading-relaxed italic max-w-xs mx-auto">
                To redefine the financial landscape by seamlessly merging technology with opportunities, driving prosperity for individuals and businesses.
              </p>
            </motion.div>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/25" />
              <TrendingUp className="w-3.5 h-3.5 text-primary/40" />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/25" />
            </div>
            </div>{/* end inner px-8 py-5 */}
          </div>{/* end paper */}
          <ScrollRod flip />
          </motion.div>
        </div>{/* end overflow hidden */}
      </div>
    </div>
  );
};

const AboutPage: React.FC = () => {
const team = [
  {
    name: 'Deepak Dash',
    designation: 'Founder & Managing Director ',
    image: '/deepak.png',
    social: {
      linkedin: 'https://www.linkedin.com/in/deepak-dash-783bb123',
     
    }
  },
  {
    name: 'Dhruv Dash',
    designation: 'Founder & Director ',
    image: '/cof&.png',
    social: {
      linkedin: 'https://www.linkedin.com/in/dhruv-dash/',
      
    }
  },
  {
    name: 'Brigadier Inder Sethi',
    designation: 'Head of Global Strategy',
    image: '/head&s.png',
    social: {
      linkedin: 'https://www.linkedin.com/in/brigindersethi',
      
    }
  },
   {
    name: 'Mr. Mohan Srinivas Kanala  ',
    designation: 'Chief Technology Officer',
    image: '/cto.jpeg',
    social: {
      linkedin: 'https://www.linkedin.com/in/kanalamohan/',
     
    }
  },
   {
    name: 'Prachi Bothra',
    designation: 'Head of Public Relations & CSR',
    image: '/csr2.jpeg',
    social: {
      linkedin: 'https://www.linkedin.com/in/prachi-bothra-1a0bb788/',
      
    }
  },
  {
    name: 'Satish Peddada ',
    designation: 'Head of Ai & Transformation',
    image: '/ai&t.png',
    social: {
      linkedin: 'https://www.linkedin.com/in/satishpeddada/',
      
    }
  },
  {
    name: 'Ravindra Appasani ',
    designation: 'Head of Venture Capital Advisory',
    image: '/head&vc2.png',
    social: {
      linkedin: 'https://www.linkedin.com/in/ravindraappasani/',
      
    }
  },
  {
    name: 'Bhabani Shankar ',
    designation: 'Head Of Governence',
    image: '/dirr.png',
    social: {
      linkedin: '#',
      
    }
  },
  
 
  {
    name: 'Sudhakar Peddada',
    designation: 'Chief Operating Officer',
    image: '/coo.png',
    social: {
      linkedin: 'https://www.linkedin.com/in/sudhakarpeddada',
      
    }
  },
  
  {
    name: 'CA Lakshminath Kothuri',
    designation: 'Chief Finacial Officer',
    image: '/head&fin.png',
    social: {
      linkedin: 'https://www.linkedin.com/in/loka-lakshminath-k-79bb6b47/',
      
    }
  },
  {
    name: 'Kaluguri Manikanta ',
    designation: 'Product Manager & Technology Architect ',
    image: '/mani2.jpeg',
    social: {
      linkedin: 'https://www.linkedin.com/in/kaluguri-manikanta-21419a287/',
      
    }
  }
  
 
  
  
];



  return (
    <div className="h-screen overflow-hidden flex flex-col bg-background">
      <TopHeader />
      <Header />
      
      <div className="flex-1 overflow-y-auto">
      <section className="pt-8 pb-20">
        <div className="container">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4"></h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Lendrix Ventech Private Limited is a multi-vertical financial, advisory, and consulting firm
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
            {/* LEFT: Mission & Vision side by side */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <MissionVisionRollout />

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[{ label: 'Consulting' }, { label: 'Research' }, { label: 'Strategic Advisory' }, { label: '24/7 Support' }].map((item) => (
                  <div key={item.label} className="text-center p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold text-sm">{item.label}</h4>
                  </div>
                ))}
              </div>

              <div className="bg-primary/10 p-6 rounded-lg">
                <h4 className="font-semibold mb-2">Call to ask any question</h4>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-lg font-bold text-primary">+91 9652019666</span>
                </div>
              </div>
            </motion.div>

            {/* RIGHT: 4 service verticals */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-4">

              {/* ✅ ADD THIS TEXT BLOCK */}
 <div className="mb-4 text-center px-4 max-w-xl mx-auto">
  <p className="font-bold text-lg md:text-xl text-black leading-relaxed whitespace-normal">
    <span className="block">
      India’s{" "}
      <span className="text-xl md:text-2xl font-extrabold text-blue-900">
        1
        <sup className="text-[0.55em] align-super">st</sup>
      </span>{" "}
      integrated platform bridging
    </span>
    <span className="block">Debt, Wealth management, Business consulting,</span>
    <span className="block">and Startup ecosystems across four strategic verticals.</span>
  </p>
</div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: TrendingUp, label: 'Debt Management', color: 'from-primary to-primary/80' },
                  { icon: BarChart3, label: 'Wealth Management', color: 'from-secondary to-secondary/80' },
                  { icon: Home, label: 'Real Estate Legacy & Marketplace', color: 'from-accent to-accent/80' },
                  { icon: Briefcase, label: 'Venture Capital Advisory & Startup Ecosystem Consulting', color: 'from-primary to-secondary' },
                ].map((item, i) => {
                  // Each card starts stacked at position (0,0) and fans to its grid cell
                  const col = i % 2;  // 0 or 1
                  const row = Math.floor(i / 2); // 0 or 1
                  const startX = col === 0 ? 0 : -120; // start from col-0 position
                  const startY = row === 0 ? 0 : -140; // start from row-0 position
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: startX, y: startY, scale: 0.85 }}
                      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.4 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Card className="text-center hover:shadow-lg transition-shadow border-0 shadow-md overflow-hidden h-36">
                        <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                            <item.icon className="w-6 h-6 text-white" />
                          </div>
                          <motion.p
                            className="font-semibold text-sm text-gray-800 leading-snug"
                            initial={{ clipPath: 'inset(0 100% 0 0)' }}
                            animate={{ clipPath: 'inset(0 0% 0 0)' }}
                            transition={{ duration: 0.5, delay: 0.7 + i * 0.18, ease: 'easeOut' }}
                          >
                            {item.label}
                          </motion.p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground">We Are Here to Grow Your Business Exponentially</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Multi-Vertical Expertise</h3>
                <p className="text-sm text-muted-foreground">
                  Financial, real estate, and venture consulting under one roof.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full bg-secondary/10 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Personalized Strategies</h3>
                <p className="text-sm text-muted-foreground">
                  Every solution tailored to your goals and risk profile.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full bg-secondary/10 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Research-Driven Approach</h3>
                <p className="text-sm text-muted-foreground">
                  Decisions backed by data, insights, and industry expertise.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full bg-accent/10 mx-auto mb-4 flex items-center justify-center">
                  <Award className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">End-to-End Support</h3>
                <p className="text-sm text-muted-foreground">
                  From advisory to execution and continuous guidance.
                </p>
              </CardContent>
            </Card>
          </div><br />

          {/* Meet Our Team Carousel */}
          <MeetOurTeam />
        </div>
      </section>

      <Footer />
      </div>
    </div>
  );
};

export default AboutPage;