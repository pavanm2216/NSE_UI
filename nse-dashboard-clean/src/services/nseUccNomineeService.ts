import { validateNSEMasterValues } from './nseDocumentMasters';

export const UCC_NOMINEE_FIELDS: ReadonlyArray<{ suffix: string; label: string; max: number; optional?: boolean }> = [
  { suffix: 'name', label: 'Nominee name', max: 40 },
  { suffix: 'relationship', label: 'Relationship to investor', max: 2 },
  { suffix: 'applicable', label: 'Share (%)', max: 6 },
  { suffix: 'identity_type', label: 'Nominee identity type', max: 1 },
  { suffix: 'identity_no', label: 'Nominee identity number', max: 30 },
  { suffix: 'email', label: 'Nominee email', max: 120 },
  { suffix: 'mobile', label: 'Nominee mobile', max: 15 },
  { suffix: 'address1', label: 'Nominee address line 1', max: 40 },
  { suffix: 'address2', label: 'Nominee address line 2 (optional)', max: 40, optional: true },
  { suffix: 'address3', label: 'Nominee address line 3 (optional)', max: 40, optional: true },
  { suffix: 'city', label: 'Nominee city', max: 35 },
  { suffix: 'pincode', label: 'Nominee pincode', max: 15 },
  { suffix: 'country', label: 'Nominee country', max: 35 },
];

export function getUccNomineeCount(values: Record<string, string>): number {
  const count = values.nominee_count || '1';
  if (!/^[1-3]$/.test(count)) throw new Error('Add between one and three nominees');
  return Number(count);
}

export function getUccNomineeShare(values: Record<string, string>, index: number): string {
  return values[`nominee_${index}_applicable`] ?? (getUccNomineeCount(values) === 1 ? '100' : '');
}

export function validateUccNominees(values: Record<string, string>) {
  const count = getUccNomineeCount(values);
  for (const [key, value] of Object.entries(values)) {
    const match = /^nominee_(\d+)_/.exec(key);
    if (match && value.trim() && (Number(match[1]) < 1 || Number(match[1]) > count)) throw new Error('Remove details for nominees outside the selected nominee count');
  }
  let total = 0;
  for (let index = 1; index <= count; index++) {
    const prefix = `nominee_${index}_`;
    const text = (suffix: string) => (values[prefix + suffix] || '').trim();
    const share = getUccNomineeShare(values, index).trim();
    for (const field of UCC_NOMINEE_FIELDS) {
      const value = field.suffix === 'applicable' ? share : text(field.suffix);
      if (!field.optional && (!value || value.toLowerCase() === 'string')) throw new Error(`Enter nominee ${index} ${field.suffix.replace(/_/g, ' ')}`);
      // The supplied document limits the second nominee name to 10 characters.
      const max = index === 2 && field.suffix === 'name' ? 10 : field.max;
      if (value.length > max || /[|\r\n]/.test(value)) throw new Error(`Enter nominee ${index} ${field.suffix.replace(/_/g, ' ')} within ${max} characters without line breaks or pipe characters`);
    }
    validateNSEMasterValues('client', values, UCC_NOMINEE_FIELDS.map(field => prefix + field.suffix));
    if (!/^\d{1,3}(\.\d{1,2})?$/.test(share) || Number(share) <= 0 || Number(share) > 100) throw new Error(`Nominee ${index} share must be greater than 0 and at most 100, with up to two decimal places`);
    const [whole, fraction = ''] = share.split('.');
    total += Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
    if (!['1', '2', '3', '4'].includes(text('identity_type'))) throw new Error(`Select nominee ${index} identity type`);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text('email'))) throw new Error(`Enter a valid nominee ${index} email`);
    if (!/^\+?\d{7,15}$/.test(text('mobile'))) throw new Error(`Enter a valid nominee ${index} mobile number`);
    if (text('identity_type') === '1' && !/^[A-Z]{5}\d{4}[A-Z]$/.test(text('identity_no').toUpperCase())) throw new Error(`Enter a valid nominee ${index} PAN`);
    if (text('identity_type') === '2' && !/^\d{4}$/.test(text('identity_no'))) throw new Error('Enter only the last four Aadhaar digits');
    if (text('country') === 'INDIA' && !/^\d{6}$/.test(text('pincode'))) throw new Error(`An Indian nominee ${index} requires a six-digit pincode`);
    if (text('minor_flag') && text('minor_flag') !== 'N') throw new Error('This form supports adult nominees only; minor nominees require guardian details');
  }
  if (total !== 10000) throw new Error('Nominee shares must total 100%');
}
