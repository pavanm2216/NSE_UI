import React from 'react';
import { Handshake, Smile, IndianRupee, Contact } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage'; // Adjust path as needed

export const StatsSection = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: <Handshake className="w-12 h-12 text-blue-700" strokeWidth={1.5} />,
      label: t('stats.trusted_since'),
      value: t('stats.trusted_year'),
    },
    {
      icon: <Smile className="w-12 h-12 text-blue-700" strokeWidth={1.5} />,
      label: t('stats.happy_investors'),
      value: t('stats.happy_investors_val'),
    },
    {
      icon: <IndianRupee className="w-12 h-12 text-blue-700" strokeWidth={1.5} />,
      label: t('stats.aum'),
      value: t('stats.aum_val'),
    },
    {
      icon: <Contact className="w-12 h-12 text-blue-700" strokeWidth={1.5} />,
      label: t('stats.active_dist'),
      value: t('stats.active_dist_val'),
    },
  ];

  return (
    <div className="bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {stats.map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center space-y-3">
            {/* Icon Container */}
            <div className="mb-2">
              {item.icon}
            </div>
            
            {/* Label */}
            <p className="text-gray-700 text-lg font-medium">
              {item.label}
            </p>
            
            {/* Value */}
            <h2 className="text-4xl font-bold text-blue-700">
              {item.value}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};