/**
 * BSE Field Mapping System
 * Maps BSE API field names to UI field metadata
 */

export interface BSEFieldMetadata {
  label: string;
  type: 'text' | 'email' | 'tel' | 'select';
  section: 'investor' | 'bank' | 'demat' | 'investment' | 'holder';
  required: boolean;
  placeholder?: string;
  pattern?: string;
  helpText?: string;
}

export const BSE_FIELD_MAP: Record<string, BSEFieldMetadata> = {
  depository_acct: {
    label: 'Demat Account Number',
    type: 'text',
    section: 'demat',
    required: true,
    placeholder: 'Enter your demat account number',
    helpText: 'Your depository account number from CDSL or NSDL',
  },
  depository: {
    label: 'Depository',
    type: 'select',
    section: 'demat',
    required: true,
    helpText: 'Select CDSL or NSDL',
  },
  dp_id: {
    label: 'DP ID',
    type: 'text',
    section: 'demat',
    required: true,
    placeholder: 'Enter DP ID',
  },
  client_id: {
    label: 'Client ID',
    type: 'text',
    section: 'demat',
    required: true,
    placeholder: 'Enter Client ID',
  },
  pan: {
    label: 'PAN Number',
    type: 'text',
    section: 'investor',
    required: true,
    placeholder: 'ABCDE1234F',
    pattern: '[A-Z]{5}[0-9]{4}[A-Z]{1}',
  },
  folio: {
    label: 'Folio Number',
    type: 'text',
    section: 'investment',
    required: false,
    placeholder: 'Leave blank for new folio',
  },
  email: {
    label: 'Email Address',
    type: 'email',
    section: 'investor',
    required: true,
    placeholder: 'your.email@example.com',
  },
  mobnum: {
    label: 'Mobile Number',
    type: 'tel',
    section: 'investor',
    required: true,
    placeholder: '9999999999',
    pattern: '[0-9]{10}',
  },
  ifsc: {
    label: 'IFSC Code',
    type: 'text',
    section: 'bank',
    required: true,
    placeholder: 'SBIN0001234',
    pattern: '[A-Z]{4}0[A-Z0-9]{6}',
  },
  bank_account: {
    label: 'Bank Account Number',
    type: 'text',
    section: 'bank',
    required: true,
    placeholder: 'Enter bank account number',
  },
  no: {
    label: 'Bank Account Number',
    type: 'text',
    section: 'bank',
    required: true,
    placeholder: 'Enter bank account number',
  },
  ucc: {
    label: 'UCC',
    type: 'text',
    section: 'investor',
    required: true,
  },
  holder_name: {
    label: 'Holder Name',
    type: 'text',
    section: 'holder',
    required: true,
  },
  account_type: {
    label: 'Account Type',
    type: 'select',
    section: 'bank',
    required: true,
  },
};

/**
 * Parsed BSE validation error
 */
export interface ParsedBSEError {
  orderId?: string;
  field: string;
  errorCode: string;
  message: string;
  metadata?: BSEFieldMetadata;
}

/**
 * Parse BSE validation error response
 */
export function parseBSEValidationErrors(response: any): ParsedBSEError[] {
  const errors: ParsedBSEError[] = [];

  if (!response?.messages || !Array.isArray(response.messages)) {
    return errors;
  }

  response.messages.forEach((msg: any) => {
    if (!msg.field) return;

    // Extract order ID and field name from format: "ORD35520480.depository_acct"
    const fieldParts = msg.field.split('.');
    const orderId = fieldParts[0];
    const fieldName = fieldParts[1] || msg.field;

    const metadata = BSE_FIELD_MAP[fieldName];
    const userMessage = metadata
      ? `${metadata.label} is ${msg.errcode}`
      : `${fieldName} is ${msg.errcode}`;

    errors.push({
      orderId,
      field: fieldName,
      errorCode: msg.errcode,
      message: userMessage,
      metadata,
    });
  });

  return errors;
}

/**
 * Group validation errors by section
 */
export function groupErrorsBySection(
  errors: ParsedBSEError[]
): Record<string, ParsedBSEError[]> {
  const grouped: Record<string, ParsedBSEError[]> = {};

  errors.forEach((error) => {
    const section = error.metadata?.section || 'other';
    if (!grouped[section]) {
      grouped[section] = [];
    }
    grouped[section].push(error);
  });

  return grouped;
}

/**
 * Check if all required fields are available
 */
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): { valid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];

  requiredFields.forEach((field) => {
    const value = data[field];
    if (!value || (typeof value === 'string' && !value.trim())) {
      missingFields.push(field);
    }
  });

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Get user-friendly error message for a field
 */
export function getFieldErrorMessage(field: string, errorCode: string): string {
  const metadata = BSE_FIELD_MAP[field];

  if (!metadata) {
    return `${field} validation failed (${errorCode})`;
  }

  const messages: Record<string, string> = {
    required: `${metadata.label} is required`,
    invalid: `${metadata.label} is invalid`,
    duplicate: `${metadata.label} already exists`,
    not_found: `${metadata.label} not found`,
  };

  return messages[errorCode] || `${metadata.label} validation failed`;
}
