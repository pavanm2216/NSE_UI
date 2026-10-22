import type { Scheme } from '@/types/starmf/scheme.types';

export interface TransformedScheme {
  parentSchemeCode: string;
  parentSchemeName: string;
  name: string;
  plan: string;
  option: string;
  isin: string;
  bseCode: string;
  amcCode: string;
  rtaCode: string;
  isActive: boolean;
  minPurchaseAmount: number;
  minAddlPurchaseAmount: number;
}

export interface TransformedAMC {
  id: string;
  name: string;
  code: string;
  schemes: TransformedScheme[];
}

/**
 * Transform raw STARMF scheme data into the format expected by MFInvestPage
 */
export function transformScheme(scheme: Scheme): TransformedScheme {
  return {
    parentSchemeCode: scheme.parent_scheme_code || '',
    parentSchemeName: scheme.parent_scheme_name || '',
    name: scheme.name || '',
    plan: scheme.scheme_plan || 'Direct',
    option: scheme.scheme_option || 'Growth',
    isin: scheme.scheme_isin || '',
    bseCode: scheme.scheme_bse_code || '',
    amcCode: scheme.scheme_amc_code || '',
    rtaCode: scheme.scheme_rta_code || '',
    isActive: scheme.is_active ?? true,
    minPurchaseAmount: scheme.min_purchase_amount || 500,
    minAddlPurchaseAmount: scheme.min_addl_purchase_amount || 500,
  };
}

/**
 * Group schemes by AMC and create AMC list
 */
export function groupSchemesByAMC(schemes: Scheme[]): TransformedAMC[] {
  const amcMap = new Map<string, TransformedAMC>();

  schemes.forEach((scheme) => {
    if (!scheme.is_active) return; // Skip inactive schemes

    const amcCode = scheme.scheme_amc_code || 'unknown';
    // Derive AMC name: take words before common fund-type keywords
    const rawName = scheme.parent_scheme_name || '';
    const stopWords = ['Mutual', 'Fund', 'MF', 'Asset', 'Trustee', 'Investment'];
    const words = rawName.split(' ');
    let amcNameWords: string[] = [];
    for (const word of words) {
      if (stopWords.includes(word)) break;
      amcNameWords.push(word);
    }
    const amcName = amcNameWords.length > 0 ? amcNameWords.join(' ') + ' Mutual Fund' : rawName || 'Unknown AMC';

    if (!amcMap.has(amcCode)) {
      amcMap.set(amcCode, {
        id: amcCode.toLowerCase(),
        name: amcName,
        code: amcCode,
        schemes: [],
      });
    }

    const amc = amcMap.get(amcCode)!;
    amc.schemes.push(transformScheme(scheme));
  });

  return Array.from(amcMap.values());
}

/**
 * Extract unique categories from schemes
 */
export function extractCategories(schemes: Scheme[]): string[] {
  const categories = new Set<string>();
  schemes.forEach((scheme) => {
    if (scheme.scheme_category) {
      categories.add(scheme.scheme_category);
    }
  });
  return Array.from(categories).sort();
}

/**
 * Filter schemes by search query
 */
export function filterSchemesBySearch(schemes: TransformedScheme[], query: string): TransformedScheme[] {
  if (!query.trim()) return schemes;
  const lowerQuery = query.toLowerCase();
  return schemes.filter(
    (scheme) =>
      scheme.name.toLowerCase().includes(lowerQuery) ||
      scheme.parentSchemeName.toLowerCase().includes(lowerQuery) ||
      scheme.isin.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Filter schemes by category
 */
export function filterSchemesByCategory(schemes: TransformedScheme[], category: string): TransformedScheme[] {
  if (category === 'All') return schemes;
  // Note: Category filtering would require additional API data
  // For now, return all schemes as the API doesn't provide category in the response
  return schemes;
}
