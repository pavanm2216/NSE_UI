import { useQuery } from '@tanstack/react-query';
import { getPortfolioByFolio } from '@/services/investwellAuthService';
import type { FolioPortfolioResponse } from '@/types/investwell';

export const usePortfolioByFolio = (token: string, pan: string, endDate: string) =>
  useQuery<FolioPortfolioResponse>({
    queryKey: ['portfolio-folio', token, pan, endDate],
    queryFn: () => getPortfolioByFolio(token, pan, endDate),
    enabled: !!token && !!pan,
    retry: 1,
    gcTime: 0,
  });
