import { nseMasterOptions, validateNSEMasterValues, type NSECodeOption } from './nseDocumentMasters';

export interface UccProfileField {
  key: string; label: string; max: number; step: number; required: boolean; options?: readonly NSECodeOption[];
}
const yesNo: readonly NSECodeOption[] = [['N', 'No'], ['Y', 'Yes']];
const kyc: readonly NSECodeOption[] = [['K', 'KRA compliant'], ['C', 'CKYC compliant'], ['B', 'Biometric KYC'], ['E', 'Aadhaar eKYC PAN']];
export const UCC_DEMAT_FIELDS = ['pms', 'default_dp', 'cdsl_dpid', 'cdslcltid', 'cmbp_id', 'nsdldpid', 'nsdlcltid'];

export function getUccProfile(values: Record<string, string>) {
  const code = values.tax_status || '01';
  const label = nseMasterOptions('clientTaxStatuses').find(([value]) => value === code)?.[1] || '';
  const minor = ['02', '26', '28', '42'].includes(code);
  const individual = minor || ['01', '11', '13', '21', '24', '41', '61', '62', '70', '77', '78'].includes(code);
  return {
    minor, individual, entity: !individual,
    foreign: /NRI|NRE|NRO|OCI|QFI|FPI|FII|OVERSEAS|OCB|PERSON OF INDIAN ORIGIN/.test(label),
    seafarer: ['77', '78'].includes(code),
    joint: ['JO', 'AS'].includes(values.holding_nature),
    third: ['JO', 'AS'].includes(values.holding_nature) && values.third_holder_enabled === 'Y',
    demat: values.client_type === 'D',
  };
}

export function getUccProfileFields(values: Record<string, string>): UccProfileField[] {
  const profile = getUccProfile(values);
  const fields: UccProfileField[] = [];
  const add = (key: string, label: string, max: number, step: number, required = true, options?: readonly NSECodeOption[]) => fields.push({ key, label, max, step, required, options });
  const exemption = (prefix: string, title: string, guardian = false) => {
    add(`${prefix}_pan_exempt`, `${title} PAN exempt?`, 1, 0, true, yesNo);
    if (values[`${prefix}_pan_exempt`] === 'Y') {
      add(`${prefix}_exempt_category`, `${title} exemption category`, 2, 0, true, nseMasterOptions('panExemptCategories'));
      add(guardian ? 'guardian_exempt_ref_no' : `${prefix}_kra_exempt_ref_no`, `${title} KRA exemption reference`, 10, 3);
    } else if (prefix !== 'primary_holder') add(`${prefix}_pan`, `${title} PAN`, 10, 0);
  };
  const holderKyc = (prefix: string, title: string) => {
    add(`${prefix}_kyc_type`, `${title} KYC type (optional)`, 1, 3, false, kyc);
    if (values[`${prefix}_kyc_type`] === 'C') add(`${prefix}_ckyc_number`, `${title} CKYC number`, 14, 3);
  };
  exemption('primary_holder', 'Investor');
  for (const prefix of profile.joint ? ['second_holder', ...(profile.third ? ['third_holder'] : [])] : []) {
    const title = prefix === 'second_holder' ? 'Second holder' : 'Third holder';
    add(`${prefix}_first_name`, `${title} first name`, 70, 0);
    add(`${prefix}_middle_name`, `${title} middle name (optional)`, 70, 0, false);
    add(`${prefix}_last_name`, `${title} last name (optional)`, 70, 0, false);
    add(`${prefix}_dob`, `${title} date of birth`, 10, 0);
    exemption(prefix, title);
    holderKyc(prefix, title);
    add(`${prefix}_email`, `${title} email`, 50, 2);
    add(`${prefix}_email_declaration`, `${title} email belongs to`, 2, 2, true, nseMasterOptions('contactDeclarations'));
    add(`${prefix}_mobile`, `${title} mobile`, prefix === 'second_holder' ? 20 : 10, 2);
    add(`${prefix}_mobile_declaration`, `${title} mobile belongs to`, 2, 2, true, nseMasterOptions('contactDeclarations'));
  }
  if (profile.minor) {
    add('guardian_first_name', 'Guardian first name', 120, 0);
    add('guardian_middle_name', 'Guardian middle name (optional)', 120, 0, false);
    add('guardian_last_name', 'Guardian last name (optional)', 120, 0, false);
    add('guardian_dob', 'Guardian date of birth', 10, 0);
    add('guardian_relation', 'Guardian relationship', 2, 0, true, nseMasterOptions('guardianRelationships'));
    exemption('guardian', 'Guardian', true);
    holderKyc('guardian', 'Guardian');
  }
  if (profile.demat) {
    add('pms', 'Portfolio management service (PMS)?', 1, 1, true, yesNo);
    add('default_dp', 'Depository', 4, 1, true, [['CDSL', 'CDSL'], ['NSDL', 'NSDL']]);
    if (values.default_dp === 'CDSL') {
      add('cdsl_dpid', 'CDSL DP ID', 8, 1);
      add('cdslcltid', 'CDSL client ID', 16, 1);
    }
    if (values.default_dp === 'NSDL') {
      add('cmbp_id', 'CMBP ID', 16, 1);
      add('nsdldpid', 'NSDL DP ID', 8, 1);
      add('nsdlcltid', 'NSDL client ID', 8, 1);
    }
  }
  if (profile.foreign) {
    add('foreign_address_1', 'Foreign address line 1', 40, 2, !profile.seafarer);
    add('foreign_address_2', 'Foreign address line 2 (optional)', 40, 2, false);
    add('foreign_address_3', 'Foreign address line 3 (optional)', 40, 2, false);
    add('foreign_address_city', 'Foreign city (optional)', 100, 2, false);
    add('foreign_address_pincode', 'Foreign postal code', 10, 2);
    add('foreign_address_state', 'Foreign state / province', 50, 2);
    add('foreign_address_country', 'Foreign country', 100, 2, true, nseMasterOptions('clientCountries').map(([, name]) => [name, name]));
  }
  if (profile.entity) {
    add('lei_no', 'Legal entity identifier (LEI, if applicable)', 20, 3, false);
    if (values.lei_no) add('lei_validity', 'LEI valid until', 10, 3);
  }
  return fields;
}

export function normalizeUccProfile(values: Record<string, string>): Record<string, string> {
  const next = { ...values };
  next.holding_nature ||= 'SI'; next.client_type ||= 'P'; next.primary_holder_pan_exempt ||= 'N';
  const profile = getUccProfile(next);
  if (profile.joint) next.second_holder_pan_exempt ||= 'N';
  if (profile.third) next.third_holder_pan_exempt ||= 'N';
  if (profile.minor) next.guardian_pan_exempt ||= 'N';
  const active = new Set(getUccProfileFields(next).map(field => field.key));
  for (const key of Object.keys(next)) {
    const conditional = /^(second_holder_|third_holder_|guardian_|foreign_address_|lei_)/.test(key) || UCC_DEMAT_FIELDS.includes(key) || ['primary_holder_exempt_category', 'primary_holder_kra_exempt_ref_no', 'primary_holder_pan_exempt'].includes(key);
    if (conditional && !active.has(key) && key !== 'third_holder_enabled') delete next[key];
    if (next[key] && (/_pan$/.test(key) || ['nsdldpid', 'lei_no'].includes(key))) next[key] = next[key].toUpperCase();
  }
  if (!profile.joint) delete next.third_holder_enabled;
  if (!profile.individual) delete next.gender;
  for (const prefix of ['primary_holder', 'second_holder', 'third_holder', 'guardian']) {
    if (next[`${prefix}_pan_exempt`] === 'Y') delete next[`${prefix}_pan`];
    if (next[`${prefix}_kyc_type`] !== 'C') next[`${prefix}_ckyc_number`] = '';
  }
  return next;
}

export function validateUccDate(value: string, label: string, adult?: boolean) {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value || value > today) throw new Error(`Enter a valid ${label}`);
  const age = Number(today.slice(0, 4)) - Number(value.slice(0, 4)) - (today.slice(5) < value.slice(5) ? 1 : 0);
  if (adult === true && age < 18) throw new Error(`${label} must be for an adult`);
  if (adult === false && age >= 18) throw new Error('Choose an adult investor type for an investor aged 18 or older');
}

export function validateUccProfileFields(values: Record<string, string>, step?: number) {
  for (const field of getUccProfileFields(values).filter(field => step == null || field.step === step)) {
    const value = (values[field.key] || '').trim();
    if (!value && field.required) throw new Error(`Enter ${field.label.toLowerCase()}`);
    if (!value) continue;
    if (value.length > field.max || /[|\r\n]/.test(value)) throw new Error(`Enter ${field.label.toLowerCase()} within ${field.max} characters without line breaks or pipe characters`);
    if (field.options && !field.options.some(([code]) => code === value)) throw new Error(`Select ${field.label.toLowerCase()}`);
    validateNSEMasterValues('client', values, [field.key]);
    if (/_pan$/.test(field.key) && !/^[A-Z]{5}\d{4}[A-Z]$/.test(value.toUpperCase())) throw new Error(`Enter a valid ${field.label.toLowerCase()}`);
    if (/_dob$/.test(field.key)) validateUccDate(value, field.label.toLowerCase(), true);
    if (/_ckyc_number$/.test(field.key) && !/^\d{14}$/.test(value)) throw new Error(`${field.label} must contain 14 digits`);
    if (/_email$/.test(field.key) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error(`Enter a valid ${field.label.toLowerCase()}`);
    if (/_mobile$/.test(field.key) && !/^\+?\d{7,15}$/.test(value)) throw new Error(`Enter a valid ${field.label.toLowerCase()}`);
    if (['cdsl_dpid', 'cdslcltid', 'nsdlcltid'].includes(field.key) && !new RegExp(`^\\d{${field.max}}$`).test(value)) throw new Error(`${field.label} must contain ${field.max} digits`);
    if (field.key === 'nsdldpid' && !/^IN\d{6}$/.test(value.toUpperCase())) throw new Error('NSDL DP ID must be IN followed by six digits');
    if (field.key === 'lei_validity' && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value)) throw new Error('Enter a valid LEI expiry date');
    if (field.key === 'lei_no' && !/^[A-Z0-9]{20}$/.test(value)) throw new Error('Enter a 20-character LEI');
  }
  if ((step == null || step === 3) && values.lei_no && !/^\d{4}-\d{2}-\d{2}$/.test(values.lei_validity || '')) throw new Error('Enter the LEI validity date');
}
