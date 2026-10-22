import { useState, useCallback } from 'react';
import type { ParsedBSEError } from '@/utils/bseValidation';
import { groupErrorsBySection } from '@/utils/bseValidation';

export interface ValidationState {
  hasErrors: boolean;
  errors: ParsedBSEError[];
  errorsBySection: Record<string, ParsedBSEError[]>;
  missingFields: Record<string, string>;
}

export interface UseBSEValidationReturn {
  validationState: ValidationState;
  setValidationErrors: (errors: ParsedBSEError[]) => void;
  clearValidationErrors: () => void;
  updateMissingField: (field: string, value: string) => void;
  getMissingFieldsForSection: (section: string) => ParsedBSEError[];
  hasErrorsInSection: (section: string) => boolean;
  getFieldError: (field: string) => ParsedBSEError | undefined;
}

export function useBSEValidation(): UseBSEValidationReturn {
  const [errors, setErrors] = useState<ParsedBSEError[]>([]);
  const [missingFields, setMissingFields] = useState<Record<string, string>>({});

  const setValidationErrors = useCallback((newErrors: ParsedBSEError[]) => {
    setErrors(newErrors);
    // Initialize missing fields from errors
    const fields: Record<string, string> = {};
    newErrors.forEach((error) => {
      if (error.errorCode === 'required') {
        fields[error.field] = '';
      }
    });
    setMissingFields(fields);
  }, []);

  const clearValidationErrors = useCallback(() => {
    setErrors([]);
    setMissingFields({});
  }, []);

  const updateMissingField = useCallback((field: string, value: string) => {
    setMissingFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const errorsBySection = groupErrorsBySection(errors);

  const getMissingFieldsForSection = useCallback(
    (section: string): ParsedBSEError[] => {
      return errorsBySection[section] || [];
    },
    [errorsBySection]
  );

  const hasErrorsInSection = useCallback(
    (section: string): boolean => {
      return (errorsBySection[section] || []).length > 0;
    },
    [errorsBySection]
  );

  const getFieldError = useCallback(
    (field: string): ParsedBSEError | undefined => {
      return errors.find((e) => e.field === field);
    },
    [errors]
  );

  return {
    validationState: {
      hasErrors: errors.length > 0,
      errors,
      errorsBySection,
      missingFields,
    },
    setValidationErrors,
    clearValidationErrors,
    updateMissingField,
    getMissingFieldsForSection,
    hasErrorsInSection,
    getFieldError,
  };
}
