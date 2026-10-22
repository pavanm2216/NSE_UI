import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type { ParsedBSEError } from '@/utils/bseValidation';

interface BSEValidationErrorsProps {
  errors: ParsedBSEError[];
  missingFields: Record<string, string>;
  onFieldChange: (field: string, value: string) => void;
  onRetry: () => void;
  isLoading?: boolean;
}

export const BSEValidationErrors: React.FC<BSEValidationErrorsProps> = ({
  errors,
  missingFields,
  onFieldChange,
  onRetry,
  isLoading = false,
}) => {
  if (errors.length === 0) {
    return null;
  }

  const requiredErrors = errors.filter((e) => e.errorCode === 'required');
  const otherErrors = errors.filter((e) => e.errorCode !== 'required');

  return (
    <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 space-y-6">
      <div className="flex items-start gap-4">
        <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-amber-900 text-lg">
            {errors.length === 1
              ? 'Additional information required'
              : `${errors.length} additional details required`}
          </h3>
          <p className="text-sm text-amber-800 mt-1">
            Please provide the following information to continue with your order.
          </p>
        </div>
      </div>

      {/* Required fields section */}
      {requiredErrors.length > 0 && (
        <div className="space-y-4">
          {requiredErrors.map((error) => (
            <div key={error.field} className="space-y-2">
              <label className="block text-sm font-semibold text-amber-900">
                {error.metadata?.label || error.field}
                <span className="text-red-600 ml-1">*</span>
              </label>

              {error.metadata?.type === 'select' ? (
                <select
                  value={missingFields[error.field] || ''}
                  onChange={(e) => onFieldChange(error.field, e.target.value)}
                  className="w-full rounded-lg border-2 border-amber-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                >
                  <option value="">
                    Select {error.metadata?.label?.toLowerCase()}
                  </option>
                  {error.field === 'depository' && (
                    <>
                      <option value="C">CDSL</option>
                      <option value="N">NSDL</option>
                    </>
                  )}
                  {error.field === 'account_type' && (
                    <>
                      <option value="SB">Savings Account</option>
                      <option value="CB">Current Account</option>
                    </>
                  )}
                </select>
              ) : (
                <input
                  type={error.metadata?.type || 'text'}
                  value={missingFields[error.field] || ''}
                  onChange={(e) => onFieldChange(error.field, e.target.value)}
                  placeholder={error.metadata?.placeholder}
                  pattern={error.metadata?.pattern}
                  className="w-full rounded-lg border-2 border-amber-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                />
              )}

              {error.metadata?.helpText && (
                <p className="text-xs text-amber-700 mt-1">
                  {error.metadata.helpText}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Other validation errors */}
      {otherErrors.length > 0 && (
        <div className="rounded-lg bg-white border border-amber-200 p-4 space-y-2">
          <p className="text-sm font-semibold text-gray-900">Validation Issues:</p>
          {otherErrors.map((error) => (
            <div key={error.field} className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">•</span>
              <span className="text-sm text-gray-700">{error.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onRetry}
          disabled={
            isLoading ||
            requiredErrors.some((e) => !missingFields[e.field]?.trim())
          }
          className="flex-1 rounded-lg bg-amber-600 text-white font-semibold py-2.5 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? 'Processing...' : 'Continue Order'}
        </button>
      </div>
    </div>
  );
};

interface DematDetailsProps {
  dematAccount: string;
  depository: string;
  dpId: string;
  clientId: string;
  onDematAccountChange: (value: string) => void;
  onDepositoryChange: (value: string) => void;
  onDpIdChange: (value: string) => void;
  onClientIdChange: (value: string) => void;
  errors?: Record<string, string>;
}

export const DematDetailsSection: React.FC<DematDetailsProps> = ({
  dematAccount,
  depository,
  dpId,
  clientId,
  onDematAccountChange,
  onDepositoryChange,
  onDpIdChange,
  onClientIdChange,
  errors = {},
}) => {
  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 space-y-5">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Demat Account Details</h3>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Demat Account Number
            <span className="text-red-600 ml-1">*</span>
          </label>
          <input
            type="text"
            value={dematAccount}
            onChange={(e) => onDematAccountChange(e.target.value)}
            placeholder="Enter your demat account number"
            className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm font-medium outline-none transition-all ${
              errors.dematAccount
                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            }`}
          />
          {errors.dematAccount && (
            <p className="text-xs text-red-600">{errors.dematAccount}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Depository
            <span className="text-red-600 ml-1">*</span>
          </label>
          <select
            value={depository}
            onChange={(e) => onDepositoryChange(e.target.value)}
            className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm font-medium outline-none transition-all ${
              errors.depository
                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            }`}
          >
            <option value="">Select Depository</option>
            <option value="C">CDSL</option>
            <option value="N">NSDL</option>
          </select>
          {errors.depository && (
            <p className="text-xs text-red-600">{errors.depository}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            DP ID
            <span className="text-red-600 ml-1">*</span>
          </label>
          <input
            type="text"
            value={dpId}
            onChange={(e) => onDpIdChange(e.target.value)}
            placeholder="Enter DP ID"
            className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm font-medium outline-none transition-all ${
              errors.dpId
                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            }`}
          />
          {errors.dpId && (
            <p className="text-xs text-red-600">{errors.dpId}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Client ID
            <span className="text-red-600 ml-1">*</span>
          </label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => onClientIdChange(e.target.value)}
            placeholder="Enter Client ID"
            className={`w-full rounded-lg border-2 px-4 py-2.5 text-sm font-medium outline-none transition-all ${
              errors.clientId
                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            }`}
          />
          {errors.clientId && (
            <p className="text-xs text-red-600">{errors.clientId}</p>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-xs text-blue-900 font-medium leading-6">
        💡 Your demat account details are available from your depository (CDSL/NSDL) statement or your DP's portal.
      </div>
    </div>
  );
};
