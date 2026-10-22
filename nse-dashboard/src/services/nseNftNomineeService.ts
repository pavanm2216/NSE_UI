import { nseRequest } from './nseApi';
import { parseNSEDueDate } from './nseSipPauseService';
import { nseMasterOptions } from './nseDocumentMasters';
export interface NftField { key: string; label: string; max: number; options?: readonly (readonly [string, string])[]; type?: string; }
export const NFT_COMMON_FIELDS: NftField[] = [
  { key: 'AMC_CODE', label: 'AMC master code', max: 3 }, { key: 'FOLIO_NO', label: 'Folio number', max: 25 }, { key: 'FH_NAME', label: 'First holder name (optional)', max: 40 }, { key: 'TAX_NUMBER', label: 'First holder PAN', max: 10 },
  { key: 'DOC_TYPE', label: 'Authorization method', max: 1, options: [['', 'Digital 2FA'], ['W', 'Wet signature']] },
  { key: 'TWOFA_AUTH', label: 'Digital authorization channel', max: 1, options: [['', 'Select channel'], ['M', 'Mobile'], ['E', 'Email'], ['B', 'Both']] },
  { key: 'IMG_REF_NO', label: 'Uploaded image reference (optional)', max: 150 }, { key: 'EMAIL', label: 'First holder email', max: 120 }, { key: 'MOBILE_NO', label: 'First holder mobile', max: 15 },
];
export const NFT_NOMINEE_FIELDS: NftField[] = [
  { key: 'NAME', label: 'Nominee name', max: 40 }, { key: 'RELA', label: 'Relationship code (numeric)', max: 25, options: [['', 'Select relationship'], ...nseMasterOptions('nomineeRelationships').map(([code, label]) => [code, `${label} (${code})`] as const)] }, { key: 'PER', label: 'Allocation percent (whole number)', max: 3 },
  { key: 'ID_T', label: 'Identity type', max: 1, options: [['', 'Select identity'], ['1', 'PAN'], ['2', 'Aadhaar last four digits'], ['3', 'Driving licence'], ['4', 'Passport (outside India)']] },
  { key: 'IDNO', label: 'Identity number', max: 30 }, { key: 'MIN_F', label: 'Minor', max: 1, options: [['N', 'No'], ['Y', 'Yes']] }, { key: 'DOB', label: 'Date of birth (required for minor)', max: 10, type: 'date' },
  { key: 'GUARD', label: 'Guardian name (optional)', max: 40 }, { key: 'GRELA', label: 'Guardian relationship code (optional)', max: 1 }, { key: 'GPAN', label: 'Guardian PAN (optional)', max: 10 },
  { key: 'EMAI', label: 'Nominee email', max: 120 }, { key: 'MOB', label: 'Nominee mobile', max: 15 }, { key: 'ADD1', label: 'Address line 1', max: 40 }, { key: 'ADD2', label: 'Address line 2 (optional)', max: 40 }, { key: 'ADD3', label: 'Address line 3 (optional)', max: 40 },
  { key: 'CITY', label: 'City', max: 35 }, { key: 'PIN', label: 'Postal code', max: 15 }, { key: 'CON', label: 'Country name', max: 35, options: [['', 'Select country'], ...nseMasterOptions('clientCountries').filter(([, name]) => name.length <= 35).map(([, name]) => [name, name] as const)] },
];
const pan = /^[A-Z]{5}\d{4}[A-Z]$/;
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobile = /^\+?\d{10,14}$/;
export function buildNftNominee(input: Record<string, string>, today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })) {
  const row: Record<string, string> = {};
  const take = (key: string, max: number, required = false) => {
    const value = (input[key] || '').trim();
    if ((required && !value) || value.length > max || value.toLowerCase() === 'string') throw new Error(`Enter a valid ${key} (up to ${max} characters)`);
    row[key] = value; return value;
  };
  NFT_COMMON_FIELDS.forEach(field => take(field.key, field.max, ['AMC_CODE', 'FOLIO_NO', 'TAX_NUMBER'].includes(field.key)));
  if (!/^\d{1,25}$/.test(row.FOLIO_NO)) throw new Error('Folio number must be numeric');
  row.TAX_NUMBER = row.TAX_NUMBER.toUpperCase();
  if (!pan.test(row.TAX_NUMBER)) throw new Error('Enter a valid first holder PAN');
  if (!['', 'W'].includes(row.DOC_TYPE)) throw new Error('Choose digital 2FA or wet signature');
  if (row.EMAIL && !email.test(row.EMAIL)) throw new Error('Enter a valid first holder email');
  if (row.MOBILE_NO && !mobile.test(row.MOBILE_NO)) throw new Error('Enter a valid first holder mobile');
  if (row.DOC_TYPE === 'W') {
    if (!row.EMAIL) throw new Error('First holder email is required for wet signature');
    row.TWOFA_AUTH = '';
  } else {
    if (!['M', 'E', 'B'].includes(row.TWOFA_AUTH)) throw new Error('Choose the digital authorization channel');
    if (['M', 'B'].includes(row.TWOFA_AUTH) && !row.MOBILE_NO) throw new Error('Enter the mobile number for mobile authorization');
    if (['E', 'B'].includes(row.TWOFA_AUTH) && !row.EMAIL) throw new Error('Enter the email for email authorization');
    row.IMG_REF_NO = '';
  }
  row.NCT_TYPE = 'NOM';
  row.NOM_OPT = take('NOM_OPT', 1, true);
  if (!['Y', 'N'].includes(row.NOM_OPT)) throw new Error('Choose whether to opt out of nomination');
  if (row.NOM_OPT === 'Y') { row.NOM_COUNT = ''; row.NOM_SOA = ''; }
  else {
    row.NOM_COUNT = take('NOM_COUNT', 1, true);
    if (!['1', '2', '3'].includes(row.NOM_COUNT)) throw new Error('This API wrapper supports one to three nominees');
    row.NOM_SOA = take('NOM_SOA', 1, true);
    if (!['Y', 'N'].includes(row.NOM_SOA)) throw new Error('Choose nominee display in statements');
    let allocation = 0;
    for (let number = 1; number <= Number(row.NOM_COUNT); number++) {
      const prefix = `NOM${number}_`;
      NFT_NOMINEE_FIELDS.forEach(field => take(prefix + field.key, field.max, ['NAME', 'RELA', 'PER', 'ID_T', 'IDNO', 'MIN_F', 'EMAI', 'MOB', 'ADD1', 'CITY', 'PIN', 'CON'].includes(field.key)));
      if (!/^\d+$/.test(row[prefix + 'RELA'])) throw new Error(`Nominee ${number} relationship must be a numeric code`);
      const percent = row[prefix + 'PER'];
      if (!/^\d{1,3}$/.test(percent) || Number(percent) < 1 || Number(percent) > 100) throw new Error('Each nominee allocation must be a whole number from 1 to 100');
      allocation += Number(percent);
      const identity = row[prefix + 'ID_T'], id = row[prefix + 'IDNO'];
      if (!['1', '2', '3', '4'].includes(identity)) throw new Error('Choose a documented nominee identity type');
      if (identity === '1') { row[prefix + 'IDNO'] = id.toUpperCase(); if (!pan.test(row[prefix + 'IDNO'])) throw new Error('Enter a valid nominee PAN'); }
      if (identity === '2' && !/^\d{4}$/.test(id)) throw new Error('Enter only the last four Aadhaar digits');
      if (identity === '4' && /^(india|in)$/i.test(row[prefix + 'CON'])) throw new Error('Passport identity is documented for nominees outside India');
      if (!email.test(row[prefix + 'EMAI']) || !mobile.test(row[prefix + 'MOB'])) throw new Error(`Enter valid email and mobile for nominee ${number}`);
      if (!['Y', 'N'].includes(row[prefix + 'MIN_F'])) throw new Error('Choose nominee minor status');
      const dob = row[prefix + 'DOB'];
      if (row[prefix + 'MIN_F'] === 'Y' && !dob) throw new Error('Date of birth is required for a minor nominee');
      if (dob) {
        let iso: string; try { iso = parseNSEDueDate(dob); } catch { throw new Error('Enter a valid nominee birth date'); }
        if (iso > today) throw new Error('Nominee birth date cannot be in the future');
        const [year, month, day] = iso.split('-'); row[prefix + 'DOB'] = `${month}/${day}/${year}`;
        const eighteenth = `${Number(year) + 18}-${month}-${day}`;
        if ((eighteenth > today) !== (row[prefix + 'MIN_F'] === 'Y')) throw new Error('Nominee minor status must match date of birth');
      }
      if (row[prefix + 'GPAN']) { row[prefix + 'GPAN'] = row[prefix + 'GPAN'].toUpperCase(); if (!pan.test(row[prefix + 'GPAN'])) throw new Error('Enter a valid guardian PAN'); }
    }
    if (allocation !== 100) throw new Error('Nominee allocations must total 100 percent');
  }
  return { nft_nominee_registration_modification_details: [row] };
}
export async function submitNftNominee(input: Record<string, string>) {
  const response = await nseRequest<{ Status?: string; Message?: string }>('/nft/nominee', buildNftNominee(input));
  if (response?.Status !== 'Success') throw new Error(response?.Message || 'Mutual funds did not confirm receipt of the nominee update. Check before retrying.');
  return response.Message || 'Mutual funds received the nominee update';
}
