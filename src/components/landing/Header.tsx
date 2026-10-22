import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/* ── Mega panel data ── */
const megaData: Record<string, {
  heading: string;
  description: string;
  href: string;
  viewAllLabel: string;
  items: { title: string; href: string; description?: string }[];
}> = {
  'Client Solutions': {
    heading: 'CLIENT SOLUTIONS',
    description: "Explore Lendrix's tailored client solutions across wealth, network and portfolio management.",
    href: '/client-solutions',
    viewAllLabel: 'View all solutions',
    items: [
      { title: 'Privy Alpha League',    href: '/client-solutions/privy-alpha-circle',  description: 'A Network Initiative Connecting people to Opportunities.' },
      { title: 'Angel Wealth League',   href: '/client-solutions/angel-wealth-league', description: 'Newedge Portfolio: Smart Diversification for Businesses and Individuals.' },
      { title: 'Private Wealth League', href: '/client-solutions/private-wealth-league', description: 'Crafting Intelligent Solutions to Preserve Wealth and Create Enduring Legacies.' },
    ],
  },
  Borrowing: {
    heading: 'BORROWING',
    description: 'Flexible borrowing solutions for personal and business needs.',
    href: '/borrowing',
    viewAllLabel: 'View all borrowing',
    items: [
      { title: 'Personal', href: '/borrowing/personal', description: 'Personal loans, home loans, gold loans & more with EMI calculators.' },
      { title: 'Business', href: '/borrowing/business', description: 'Business loans, working capital, machinery & equipment loans.' },
    ],
  },
  Investing: {
    heading: 'INVESTING & WEALTH',
    description: 'Comprehensive investment and wealth management solutions for every profile.',
    href: '/investing',
    viewAllLabel: 'View all investing',
    items: [
      { title: 'Individual',     href: '/investing/individual',     description: 'Mutual Funds, Bonds, Demat Account & more for individuals.' },
      { title: 'Non Individual', href: '/investing/non-individual', description: 'Investment solutions tailored for corporates and institutions.' },
    ],
  },
  'Business Consultancy': {
    heading: 'BUSINESS CONSULTANCY',
    description: 'Strategic advisory and consultancy services to grow and transform your business.',
    href: '/business-consultancy',
    viewAllLabel: 'View all consultancy',
    items: [
      { title: 'Start-up Consultancy Advisory', href: '/business-consultancy/startup-advisory',      description: 'Expert guidance to launch and scale your startup.' },
      { title: 'Business Consultancy',          href: '/business-consultancy/business-consultancy', description: 'Strategic advisory to grow and transform your business.' },
    ],
  },
};

const navigation = [
  { name: 'Client Solutions',     href: '#services',        hasMega: true  },
  { name: 'Borrowing',            href: '#borrowing',       hasMega: true  },
  { name: 'Investing',            href: '#investing',       hasMega: true  },
  { name: 'Business Consultancy', href: '#consultancy',     hasMega: true  },
  { name: 'Offers & Rewards',     href: '/offers-rewards',  hasMega: false },
  { name: 'About Us',             href: '/about',           hasMega: false },
];

const DropdownItem: React.FC<{ item: { title: string; href: string; description?: string }; onClick: () => void }> = ({ item, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={item.href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      // "min-w-[280px]" ensures the box is wide enough for the text
      className="block px-4 py-3 border-b border-gray-100 last:border-0 transition-all duration-150 min-w-[280px]"
      style={{ 
        background: hovered ? 'linear-gradient(to right, #1E3A6D, #2A938F)' : 'white'
      }}
    >
      {/* "whitespace-nowrap" is the fix that prevents the text from breaking into two lines */}
      <span 
        className="text-[14px] font-bold block mb-0.5 whitespace-nowrap" 
        style={{ color: hovered ? 'white' : '#1a202c' }}
      >
        {item.title}
      </span>
      
      {item.description && (
        <span 
          className="text-[13px] block leading-relaxed opacity-80" 
          style={{ color: hovered ? 'white' : '#6b7280' }}
        >
          {item.description}
        </span>
      )}
    </Link>
  );
};
const Header: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
  const headerRef = useRef<HTMLElement>(null);
  const navButtonRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { t } = useLanguage();
  const navigate = useNavigate();
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = useCallback((name: string) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    const el = navButtonRefs.current[name];
    if (el) {
      const rect = el.getBoundingClientRect();
      setDropdownPos({ left: rect.left, top: rect.bottom });
    }
    setActiveMenu(name);
  }, []);

  const closeMenu = useCallback(() => {
    leaveTimer.current = setTimeout(() => setActiveMenu(null), 120);
  }, []);

  const keepOpen = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  }, []);

  const panel = activeMenu ? megaData[activeMenu] : null;

  return (
    <>
      <header ref={headerRef} className="sticky top-10 z-50">
        <div className="bg-primary text-white border-b border-primary-foreground/20">
          <div className="max-w-[1800px] mx-auto px-3">
            <nav className="flex items-center h-16 gap-1">

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 flex-shrink-0 mr-2">
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                  <img src="/logo.png" alt="Lendrix" className="w-7 h-7" />
                </div>
                <div className="hidden lg:block">
                  <div className="font-bold text-sm text-white leading-tight whitespace-nowrap">{t('company.name')}</div>
                  <div className="text-xs text-white/70 leading-tight whitespace-nowrap">{t('company.tagline')}</div>
                </div>
              </Link>

              {/* Desktop nav */}
              <div className="hidden lg:flex items-center h-full">
                {navigation.map((item) => (
                  item.hasMega && megaData[item.name] ? (
                    <div
                      key={item.name}
                      ref={el => { navButtonRefs.current[item.name] = el; }}
                      className="h-full flex items-center"
                      onMouseEnter={() => openMenu(item.name)}
                      onMouseLeave={closeMenu}
                    >
                      <button className="flex items-center px-4 h-full text-sm font-semibold whitespace-nowrap transition-colors hover:bg-white/10">
                        {item.name}
                      </button>
                    </div>
                  ) : (
                    <Link key={item.name} to={item.href}
                      className="flex items-center px-4 h-full text-sm font-semibold whitespace-nowrap hover:bg-white/10 transition-colors"
                      onMouseEnter={() => setActiveMenu(null)}
                    >
                      {item.name}
                    </Link>
                  )
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden lg:flex text-white hover:bg-white/10 text-xs whitespace-nowrap px-2">
                      {t('nav.signin')} / Register
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild><Link to="/login?role=customer">Client Login</Link></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="icon"
                  className="lg:hidden text-white hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </nav>
          </div>
        </div>

      </header>

      {/* ── Positioned mega dropdown portal ── */}
      {activeMenu && panel && createPortal(
        <div
          className="fixed z-[9999] shadow-xl"
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
          onMouseEnter={keepOpen}
          onMouseLeave={closeMenu}
        >
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl" style={{ minWidth: '220px', maxWidth: '260px' }}>
            {panel.items.map((s) => (
              <DropdownItem key={s.title} item={s} onClick={() => setActiveMenu(null)} />
            ))}
          </div>
        </div>,
        document.body
      )}

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed top-[calc(2.5rem+4rem)] left-0 right-0 z-40 bg-primary text-white border-b border-primary-foreground/20 max-h-[80vh] overflow-y-auto"
          >
            <div className="container py-4 space-y-1">
              {navigation.map((item) => (
                item.hasMega ? (
                  <div key={item.name}>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === item.name ? null : item.name)}
                      className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold hover:bg-white/10 rounded-lg"
                    >
                      {item.name}
                      <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded === item.name ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {mobileExpanded === item.name && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden ml-4 mt-1 space-y-1"
                        >
                          {megaData[item.name]?.items.map((s) => (
                            <Link key={s.title} to={s.href}
                              className="block px-3 py-2 text-sm hover:bg-white/10 rounded-lg"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <div className="font-medium">{s.title}</div>
                              <div className="text-xs text-white/60 mt-0.5">{s.description}</div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link key={item.name} to={item.href}
                    className="block px-3 py-2.5 text-sm font-semibold hover:bg-white/10 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              <div className="pt-4 border-t border-white/20">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/login">{t('nav.signin')}</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
