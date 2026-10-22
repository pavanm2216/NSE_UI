import React from 'react';
import { Scheme } from './types';

const SchemeCard: React.FC<{ scheme: Scheme; onInvest: (s: Scheme, mode: 'lumpsum' | 'sip') => void }> = ({ scheme, onInvest }) => {
  const sipOk     = !scheme.sip_allowed      || scheme.sip_allowed      === 'Y';
  const lumpsumOk = !scheme.purchase_allowed || scheme.purchase_allowed === 'Y';
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-[#1E3A6D]/20 transition-all flex flex-col gap-3 group">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#1E3A6D]/8 border border-[#1E3A6D]/10 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-[#1E3A6D]">
            {(scheme.scheme_amc_code || scheme.scheme_amc_name || 'MF').slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#1E3A6D] transition-colors">{scheme.name}</p>
          <p className="text-[11px] text-gray-400 mt-0.5 truncate">{scheme.scheme_amc_name || scheme.scheme_amc_code}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] font-semibold bg-[#1E3A6D]/8 text-[#1E3A6D] rounded-full px-2.5 py-1">
          {scheme.scheme_sub_category || scheme.scheme_category}
        </span>
        <span className="text-[10px] font-semibold bg-[#00b386]/10 text-[#00b386] rounded-full px-2.5 py-1">
          {scheme.scheme_option}
        </span>
        <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 rounded-full px-2.5 py-1 ml-auto">
          {scheme.scheme_plan}
        </span>
      </div>
      <div className="bg-gray-50 rounded-xl px-3 py-2 flex items-center justify-between">
        <p className="text-[10px] text-gray-400 uppercase tracking-wide">ISIN</p>
        <p className="text-xs font-mono font-semibold text-gray-700">{scheme.scheme_isin || '—'}</p>
      </div>
      <div className="flex items-center justify-between text-[10px] text-gray-400 px-0.5">
        <span>SIP from <span className="font-semibold text-gray-600">₹{(scheme.min_sip_amount ?? 500).toLocaleString('en-IN')}</span></span>
        <span>Lumpsum from <span className="font-semibold text-gray-600">₹{(scheme.min_purchase_amount ?? 1000).toLocaleString('en-IN')}</span></span>
      </div>
      <div className="flex gap-2 mt-auto pt-1">
        {lumpsumOk && (
          <button
            onClick={() => onInvest(scheme, 'lumpsum')}
            className="flex-1 bg-[#1E3A6D] hover:bg-[#162d57] text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
          >
            Invest Now
          </button>
        )}
        {sipOk && (
          <button
            onClick={() => onInvest(scheme, 'sip')}
            className="flex-1 border-2 border-[#00b386] text-[#00b386] hover:bg-[#00b386] hover:text-white text-xs font-bold py-2.5 rounded-xl transition-all"
          >
            Start SIP
          </button>
        )}
        {!lumpsumOk && !sipOk && (
          <span className="flex-1 text-center text-[10px] text-gray-400 py-2.5">Not available for orders</span>
        )}
      </div>
    </div>
  );
};

export default SchemeCard;
