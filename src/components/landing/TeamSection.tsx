import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TeamCarouselGallery } from '@/components/ui/carousel-circular-image-gallery';

const TeamSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section style={{ background: '#f4efe6', overflow: 'hidden', paddingTop: '48px', paddingBottom: '48px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px', padding: '0 24px' }}>
        <h2 style={{
          margin: 0, fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, color: '#111',
          fontFamily: "'Georgia','Times New Roman',serif", letterSpacing: '-0.02em',
        }}>
          {t('team.title')}
        </h2>
        <p style={{ margin: '8px 0 0', fontSize: '15px', color: '#888', fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>
          {t('team.subtitle')}
        </p>
      </div>
      <TeamCarouselGallery />
    </section>
  );
};

export default TeamSection;
