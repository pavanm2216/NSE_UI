import { useState, useEffect } from 'react';
import { getActiveUCCList, extractInvestorInfo, type UCCData } from '@/services/starmf/uccService';
import { isBSEConnected } from '@/services/bseAuth';

export interface InvestorInfo {
  clientCode: string;
  memberId: string;
  uccStatus: string;
  holdingNature: string;
  taxStatus: string;
  isDematAccount: boolean;
  holderName: string;
  holderPAN: string;
  bankAccounts: Array<{
    ifsc_code: string;
    bank_acc_num: string;
    bank_acc_type: string;
    account_owner: string;
  }>;
}

export function useUCC() {
  const [uccData, setUccData] = useState<UCCData[]>([]);
  const [investorInfo, setInvestorInfo] = useState<InvestorInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUCC = async () => {
    if (!isBSEConnected()) {
      setError('Please login to BSE first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('[useUCC] Fetching UCC data...');
      const data = await getActiveUCCList();
      setUccData(data);

      if (data.length > 0) {
        const info = extractInvestorInfo(data);
        setInvestorInfo(info);
        console.log('[useUCC] Investor info:', info);
      } else {
        setError('No active UCC found');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch UCC data';
      console.error('[useUCC] Error:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isBSEConnected()) {
      fetchUCC();
    }
  }, []);

  return {
    uccData,
    investorInfo,
    loading,
    error,
    refetch: fetchUCC,
  };
}
