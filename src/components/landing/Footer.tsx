import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import LegalPopup from '@/components/ui/legal-popup';
import SocialFlipButton from '@/components/ui/social-flip-button';

const footerLinks = {
  services: [
    { name: 'Debt Management', href: '#services', type: 'scroll' },
    { name: 'Wealth Management', href: '#services', type: 'scroll' },
    { name: 'Real Estate', href: '#services', type: 'scroll' },
    { name: 'VC Advisory & Startup Consultancy', href: '#services', type: 'scroll' },
  ],
  company: [
    { name: 'About Us', href: '/about', type: 'link' },
    { name: 'Careers', href: '/careers', type: 'link' },
    { name: 'Team', href: '/login?role=admin', type: 'link' },
    { name: 'Blogs', href: '/traderslounge', type: 'link' },
  ],
  support: [
    { name: 'Help Center', href: '/contact', type: 'link' },
    { name: 'Contact Us', href: '/contact', type: 'link' },
    { name: 'FAQs', href: '/contact', type: 'link' },
    { name: 'Partner with Us', href: '/contact', type: 'link' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#', type: 'popup' },
    { name: 'Terms of Service', href: '#', type: 'popup' },
    { name: 'Compliance', href: '#', type: 'popup' },
    { name: 'Disclaimer', href: '#', type: 'popup' },
  ],
};

const Footer: React.FC = () => {
  const [legalPopup, setLegalPopup] = useState<{ isOpen: boolean; title: string }>({ isOpen: false, title: '' });
  const location = useLocation();
  const navigate = useNavigate();

  const handleServicesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      window.location.href = '/#services';
    } else {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLinkClick = (link: any, e: React.MouseEvent) => {
    if (link.type === 'scroll') {
      handleServicesClick(e);
    } else if (link.type === 'popup') {
      e.preventDefault();
      setLegalPopup({ isOpen: true, title: link.name });
    } else if (link.type === 'link') {
  e.preventDefault();

  // ✅ Special handling for Blogs
  if (link.name === 'Blogs') {
    navigate('/traders-lounge', { state: { section: 'blogs' } });
  } else if (link.name === 'Team') {
    navigate('/login?role=admin');
  } else {
    navigate(link.href);
  }

  setTimeout(() => window.scrollTo(0, 0), 100);
}
  };

  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="Lendrix Ventech" className="w-8 h-8" />
              </div>
              <div>
                <div className="font-bold text-lg">Lendrix Ventech</div>
                <div className="text-sm text-sidebar-foreground/60">Empowering Entrepreneurs & Ecosystem</div>
              </div>
            </Link>
            <p className="text-sidebar-foreground/70 text-sm mb-6 max-w-xs">
              Your complete financial ecosystem. Manage loans, investments, real estate, and business consulting all in one place.
            </p>
            <div className="space-y-2 text-sm text-sidebar-foreground/70">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contactus@lendrixventech.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>9652019666</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>502/5B, 5th Floor, Capital Park, Madhapur, Telangana -500081</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <button 
                    onClick={(e) => handleLinkClick(link, e)}
                    className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <button 
                    onClick={(e) => handleLinkClick(link, e)}
                    className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <button 
                    onClick={(e) => handleLinkClick(link, e)}
                    className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <button 
                    onClick={(e) => handleLinkClick(link, e)}
                    className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

         {/* Bottom Bar */}
  <div className="mt-6 pt-4 border-t border-sidebar-border flex flex-col md:flex-row items-center justify-between gap-4">
    
    <div className="text-sm text-sidebar-foreground/60 text-center md:text-left">
      <p>© 2025 Lendrix Ventech Private Limited. All rights reserved.</p>
      <p className="mt-1">
        Design & Developed by Qualex Consulting India Pvt. Ltd.
      </p>
    </div>

    <div className="flex items-center gap-4">
      <SocialFlipButton darkMode />
    </div>

  </div>
  </div>
      
      <LegalPopup 
        isOpen={legalPopup.isOpen}
        onClose={() => setLegalPopup({ isOpen: false, title: '' })}
        title={legalPopup.title}
        content=""
      />
    </footer>
  );
};

export default Footer;
