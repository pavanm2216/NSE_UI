import axios from 'axios';
import { getOrFetchAggregatorToken } from './investwellAuthService';

const API_BASE_URL = '/iw-api/api/aggregator/reports';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Add token to request headers
apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await getOrFetchAggregatorToken();
    config.headers.token = token;
  } catch (error) {
    console.error('[portfolioAPI] Failed to get token:', error);
  }
  return config;
});

// Format date to YYYY-MM-DD
const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Build filters array
interface FilterOptions {
  endDate?: string | Date;
  pan?: string;
  panWise?: string | number;
  startDate?: string | Date;
  dataSource?: string | number;
}

const buildFilters = (options: FilterOptions): string => {
  const filters: Record<string, any>[] = [];
  
  if (options.endDate) {
    filters.push({ endDate: formatDate(options.endDate) });
  }
  if (options.startDate) {
    filters.push({ startDate: formatDate(options.startDate) });
  }
  if (options.pan) {
    filters.push({ pan: options.pan });
  }
  if (options.panWise !== undefined) {
    filters.push({ panWise: String(options.panWise) });
  }
  if (options.dataSource !== undefined) {
    filters.push({ dataSource: String(options.dataSource) });
  }
  
  return JSON.stringify(filters);
};

// API Service Functions
export const portfolioAPI = {
  /**
   * Get Portfolio Returns grouped by appid or objectiveid
   */
  getPortfolioReturns: async (
    group: 'appid' | 'objectiveid' | 'schid' | 'folioid',
    options: FilterOptions
  ) => {
    const response = await apiClient.get('/getPortfolioReturns', {
      params: { group, filters: buildFilters(options) },
    });
    return response.data;
  },

  getPortfolioReturnsDetailed: async (groupBy: number, options: FilterOptions) => {
    const response = await apiClient.get('/getPortfolioReturnsDetailed', {
      params: { filters: buildFilters(options), groupBy },
    });
    return response.data;
  },

  getPortfolioForOtherAssets: async (options: FilterOptions) => {
    const response = await apiClient.get('/getPortfolioForOtherAssets', {
      params: { filters: buildFilters(options) },
    });
    return response.data;
  },

  getAllPortfolioData: async (pan: string, endDate?: Date | string) => {
    const date = endDate ? formatDate(endDate) : formatDate(new Date());
    const [returns, detailed, otherAssets] = await Promise.allSettled([
      portfolioAPI.getPortfolioReturns('appid', { pan, endDate: date }),
      portfolioAPI.getPortfolioReturnsDetailed(1008, { pan, endDate: date, panWise: '1' }),
      portfolioAPI.getPortfolioForOtherAssets({ pan, endDate: date }),
    ]);
    return {
      returns: returns.status === 'fulfilled' ? returns.value : null,
      detailed: detailed.status === 'fulfilled' ? detailed.value : null,
      otherAssets: otherAssets.status === 'fulfilled' ? otherAssets.value : null,
      errors: {
        returns: returns.status === 'rejected' ? returns.reason : null,
        detailed: detailed.status === 'rejected' ? detailed.reason : null,
        otherAssets: otherAssets.status === 'rejected' ? otherAssets.reason : null,
      },
    };
  },
};

export { formatDate, buildFilters };
