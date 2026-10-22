import React from 'react';

interface TimeSelectorProps {
  selected: string;
  onSelect: (timeframe: string) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ selected, onSelect }) => {
  const timeframes = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

  return (
    <div className="flex gap-4 p-4 justify-center">
      {timeframes.map((tf) => (
        <button
          key={tf}
          onClick={() => onSelect(tf)}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            selected === tf
              ? 'bg-[#00C805] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {tf}
        </button>
      ))}
    </div>
  );
};

export default TimeSelector;
