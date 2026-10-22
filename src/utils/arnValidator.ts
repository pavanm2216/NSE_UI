/**
 * Validate ARN format
 * ARN format: ARN-XXXXX or ARN-XXXXXXXX (5-8 digits)
 */
export function validateARN(arn: string): boolean {
  const arnRegex = /^ARN-\d{5,8}$/;
  return arnRegex.test(arn);
}

/**
 * Get ARN from environment with validation
 * Falls back to demo ARN if invalid
 */
export function getARNFromEnv(): string {
  const arn = import.meta.env.VITE_STARMF_ARN;

  console.log('[ARN Debug] VITE_STARMF_ARN from env:', arn);

  if (!arn) {
    console.warn('[ARN] VITE_STARMF_ARN not configured in .env - using demo ARN');
    return 'ARN-92374';
  }

  if (!validateARN(arn)) {
    console.warn('[ARN] Invalid ARN format in .env:', arn);
    console.warn('[ARN] Expected format: ARN-XXXXX or ARN-XXXXXXXX (5-8 digits)');
    console.warn('[ARN] Using demo ARN instead');
    return 'ARN-92374';
  }

  console.log('[ARN] Valid ARN found:', arn);
  return arn;
}

/**
 * Extract numeric part from ARN
 * ARN-92374 -> 92374
 */
export function extractARNNumber(arn: string): string {
  return arn.replace('ARN-', '');
}

/**
 * Format ARN with prefix
 * 92374 -> ARN-92374
 */
export function formatARN(arnNumber: string): string {
  return `ARN-${arnNumber}`;
}
