/**
 * Scheme Code Resolver
 * Generates or extracts scheme codes from available data
 */

export interface SchemeCodeResolution {
  code: string;
  source: 'parent_scheme_code' | 'scheme_isin' | 'scheme_code' | 'generated';
  isValid: boolean;
}

/**
 * Generate a scheme code from scheme name
 * Example: "SBI ESG EXCLUSIONARY STRATEGY FUND REGULAR GROWTH" -> "SBI-ESG-EXCL-GR"
 */
export function generateSchemeCode(schemeName: string): string {
  // Extract key words from scheme name
  const words = schemeName.split(' ').filter(w => w.length > 0);
  
  // Take first word (AMC), and first letter of next 2-3 significant words
  const parts: string[] = [];
  
  // Add AMC name (first word)
  if (words.length > 0) {
    parts.push(words[0].substring(0, 3).toUpperCase());
  }
  
  // Add first letters of next words (skip common words)
  const skipWords = ['FUND', 'REGULAR', 'DIRECT', 'GROWTH', 'DIVIDEND', 'PLAN', 'OPTION', 'STRATEGY'];
  let addedWords = 0;
  
  for (let i = 1; i < words.length && addedWords < 3; i++) {
    const word = words[i].toUpperCase();
    if (!skipWords.includes(word) && word.length > 2) {
      parts.push(word.substring(0, 3));
      addedWords++;
    }
  }
  
  // Add last word if it's meaningful (like GROWTH, DIVIDEND)
  if (words.length > 0) {
    const lastWord = words[words.length - 1].toUpperCase();
    if (['GROWTH', 'DIVIDEND', 'INCOME', 'BALANCED'].includes(lastWord)) {
      parts.push(lastWord.substring(0, 2));
    }
  }
  
  return parts.join('-');
}

/**
 * Resolve the BSE scheme code for use in order_new / sxp_register.
 * BSE requires the scheme_bse_code format (e.g. '007-DP', '010-GR').
 * ISIN and parent_scheme_code are NOT accepted by order_new.
 * Returns empty string if no valid BSE code exists — callers must handle this.
 */
export function resolveBSEOrderCode(scheme: any): string {
  const code = (scheme.scheme_bse_code || scheme.scheme_code || '').trim();
  // Reject known-bad placeholder values
  if (!code || code.includes('Unknown') || code === 'UNKNOWN') return '';
  return code;
}

/**
 * Resolve scheme code from available fields (legacy — do not use for order_new)
 */
export function resolveSchemeCode(scheme: any): SchemeCodeResolution {
  // Priority 1: parent_scheme_code
  if (scheme.parent_scheme_code && scheme.parent_scheme_code.trim()) {
    return {
      code: scheme.parent_scheme_code,
      source: 'parent_scheme_code',
      isValid: true,
    };
  }
  
  // Priority 2: scheme_isin
  if (scheme.scheme_isin && scheme.scheme_isin.trim()) {
    return {
      code: scheme.scheme_isin,
      source: 'scheme_isin',
      isValid: true,
    };
  }
  
  // Priority 3: scheme_code
  if (scheme.scheme_code && scheme.scheme_code.trim()) {
    return {
      code: scheme.scheme_code,
      source: 'scheme_code',
      isValid: true,
    };
  }
  
  // Priority 4: scheme_id
  if (scheme.scheme_id && scheme.scheme_id.toString().trim()) {
    return {
      code: scheme.scheme_id.toString(),
      source: 'scheme_code',
      isValid: true,
    };
  }
  
  // Fallback: Generate from scheme name
  if (scheme.name && scheme.name.trim()) {
    const generatedCode = generateSchemeCode(scheme.name);
    console.warn('[Scheme Code] Generated code from name:', {
      name: scheme.name,
      generatedCode,
    });
    return {
      code: generatedCode,
      source: 'generated',
      isValid: false, // Generated codes may not work with API
    };
  }
  
  // Last resort
  return {
    code: 'UNKNOWN',
    source: 'generated',
    isValid: false,
  };
}

/**
 * Check if scheme code is valid (not placeholder)
 */
export function isValidSchemeCode(code: string): boolean {
  if (!code || code.trim() === '') return false;
  if (code.includes('Unknown')) return false;
  if (code === 'L-Unknown-Unknown') return false;
  if (code === 'UNKNOWN') return false;
  return true;
}

/**
 * Get best available scheme code with fallback
 */
export function getBestSchemeCode(scheme: any): string {
  const resolution = resolveSchemeCode(scheme);
  
  console.log('[Scheme Code Resolution]', {
    schemeName: scheme.name,
    resolvedCode: resolution.code,
    source: resolution.source,
    isValid: resolution.isValid,
  });
  
  return resolution.code;
}
