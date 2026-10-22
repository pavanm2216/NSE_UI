import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import SocialFlipButton from '@/components/ui/social-flip-button';

const TopHeader: React.FC = () => {
  const [showFullAddress, setShowFullAddress] = useState(false);
  const { t } = useLanguage();
  const gtSlotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = document.querySelector('.gtranslate_wrapper') as HTMLElement | null;
    if (wrapper && gtSlotRef.current && !gtSlotRef.current.contains(wrapper)) {
      gtSlotRef.current.appendChild(wrapper);
    }
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-white text-primary py-2 text-sm border-b border-border">
      <div className="container flex items-center justify-between">
        {/* Left side - Social Media Icons */}
        <div className="flex items-center gap-2">
          <SocialFlipButton />
        </div>

        {/* Right side - Pre-Verified Properties & Trader's Lounge & Social Media */}
        <div className="flex items-center gap-6">
          <Link to="/properties" className="flex items-center gap-2 hover:underline">
            <Home className="w-4 h-4" />
            <span>{t('topheader.properties')}</span>
          </Link>
          <Link to="/traders-lounge" className="flex items-center gap-2 px-4 py-2 gradient-primary text-primary-foreground rounded-lg shadow-glow transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 6L12 2L22 6V8H2V6Z" fill="currentColor" opacity="0.5"/>
              <path d="M4 8H20V18L12 22L4 18V8Z" fill="currentColor"/>
              <path d="M12 22L22 18V8" stroke="white" strokeWidth="1.5" opacity="0.3"/>
            </svg>
            <span className="font-semibold">{t('topheader.traderslounge')}</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          
          {/* Social Media — Language Switcher only on right */}
          <div className="flex items-center gap-2">
            {/* GTranslate slot */}
            <div ref={gtSlotRef} className="flex items-center" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
