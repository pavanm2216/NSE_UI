import { useEffect, useState, useCallback } from 'react';
import { getMasterSchemeList } from '@/services/starmf/schemeService';
import { groupSchemesByAMC, type TransformedAMC, type TransformedScheme } from '@/services/starmf/schemeTransformService';
import type { Scheme } from '@/types/starmf/scheme.types';
import { loginToBSE, isBSEConnected } from '@/services/bseAuth';

interface UseMFSchemesState {
  amcs: TransformedAMC[];
  allSchemes: TransformedScheme[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useMFSchemes(): UseMFSchemesState {
  const [amcs, setAmcs] = useState<TransformedAMC[]>([]);
  const [allSchemes, setAllSchemes] = useState<TransformedScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchemes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isBSEConnected()) {
        const username = import.meta.env.VITE_BSE_USERNAME || 'demo';
        const password = import.meta.env.VITE_BSE_PASSWORD || 'demo';
        console.log('[MFSchemes] Authenticating with BSE...');
        await loginToBSE(username, password);
      }

      const response = await getMasterSchemeList({
        start: 0,
        length: 100,
      });

      if (!response?.data?.lists || !Array.isArray(response.data.lists)) {
        throw new Error('Invalid API response format');
      }

      const schemes: Scheme[] = response.data.lists;
      const transformedAmcs = groupSchemesByAMC(schemes);
      const allTransformedSchemes = schemes
        .filter((s) => s.is_active)
        .map((s) => ({
          parentSchemeCode: s.parent_scheme_code || '',
          parentSchemeName: s.parent_scheme_name || '',
          name: s.name || '',
          plan: s.scheme_plan || 'Direct',
          option: s.scheme_option || 'Growth',
          isin: s.scheme_isin || '',
          bseCode: s.scheme_bse_code || '',
          amcCode: s.scheme_amc_code || '',
          rtaCode: s.scheme_rta_code || '',
          isActive: s.is_active ?? true,
          minPurchaseAmount: s.min_purchase_amount || 500,
          minAddlPurchaseAmount: s.min_addl_purchase_amount || 500,
        }));

      setAmcs(transformedAmcs);
      setAllSchemes(allTransformedSchemes);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load mutual fund schemes';
      setError(errorMessage);
      console.error('Error fetching schemes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchemes();
  }, [fetchSchemes]);

  return {
    amcs,
    allSchemes,
    loading,
    error,
    retry: fetchSchemes,
  };
}
