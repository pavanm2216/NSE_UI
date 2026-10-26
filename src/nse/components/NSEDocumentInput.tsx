import React from 'react';
import { getNSEFieldOptions, type NSEFieldDomain } from '@/services/nseDocumentMasters';

export default function NSEDocumentInput({ domain, field, value, onChange, maxLength, type = 'text', className = 'mt-1 w-full rounded border p-2' }: {
  domain: NSEFieldDomain; field: string; value: string; onChange: (value: string) => void;
  maxLength?: number; type?: string; className?: string;
}) {
  const options = getNSEFieldOptions(domain, field);
  return options ? <select value={value} onChange={event => onChange(event.target.value)} className={className}>
    <option value="">Select</option>
    {options.map(([code, label]) => <option key={code} value={code} disabled={!!maxLength && code.length > maxLength}>{label}{label !== code ? ` (${code})` : ''}</option>)}
  </select> : <input type={type} maxLength={maxLength} value={value} onChange={event => onChange(event.target.value)} className={className} />;
}
