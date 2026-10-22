import { nseRequest, NSEApiError } from './nseApi';
import { buildNftCommon } from './nseNftBankService';
import type { NftField } from './nseNftNomineeService';
export const NFT_CONTACT_DECLARATIONS = [['', 'Not applicable / not shared'], ['SE', 'Self'], ['SP', 'Spouse'], ['DC', 'Dependent children'], ['DS', 'Dependent siblings'], ['DP', 'Dependent parents']] as const;
export const NFT_CONTACT_FIELDS: NftField[] = [
  { key: 'J1_EMAIL', label: 'Second holder email', max: 120 }, { key: 'J1_MOBILE', label: 'Second holder mobile', max: 15 }, { key: 'J2_EMAIL', label: 'Third holder email', max: 120 }, { key: 'J2_MOBILE', label: 'Third holder mobile', max: 15 },
  ...([['PH_EMA_DEC', 'First holder email declaration'], ['PH_MOB_DEC', 'First holder mobile declaration'], ['J1_EMA_DEC', 'Second holder email declaration'], ['J1_MOB_DEC', 'Second holder mobile declaration'], ['J2_EMA_DEC', 'Third holder email declaration'], ['J2_MOB_DEC', 'Third holder mobile declaration']].map(([key, label]) => ({ key, label, max: 2, options: NFT_CONTACT_DECLARATIONS }))),
];
export function buildNftContact(input: Record<string, string>) {
  const row = buildNftCommon(input);
  for (const field of NFT_CONTACT_FIELDS) {
    const value = (input[field.key] || '').trim();
    if (value.length > field.max || value.toLowerCase() === 'string') throw new Error(`Enter a valid ${field.label}`);
    row[field.key] = value;
    if (field.key.endsWith('_DEC') && !NFT_CONTACT_DECLARATIONS.some(([code]) => code === value)) throw new Error('Choose a documented contact declaration');
    if (field.key.endsWith('_EMAIL') && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error(`Enter a valid ${field.label}`);
    if (field.key.endsWith('_MOBILE') && value && !/^\+?\d{10,14}$/.test(value)) throw new Error(`Enter a valid ${field.label}`);
  }
  for (const contacts of [[['EMAIL', 'PH_EMA_DEC'], ['J1_EMAIL', 'J1_EMA_DEC'], ['J2_EMAIL', 'J2_EMA_DEC']], [['MOBILE_NO', 'PH_MOB_DEC'], ['J1_MOBILE', 'J1_MOB_DEC'], ['J2_MOBILE', 'J2_MOB_DEC']]]) {
    for (const [key, declaration] of contacts) {
      const value = row[key].toLowerCase();
      if (!value && row[declaration]) throw new Error('A contact declaration requires its corresponding contact detail');
      if (value && contacts.some(([other]) => other !== key && row[other].toLowerCase() === value) && !row[declaration]) throw new Error('Choose a declaration for each holder sharing an email or mobile');
    }
  }
  if (!['EMAIL', 'MOBILE_NO', 'J1_EMAIL', 'J1_MOBILE', 'J2_EMAIL', 'J2_MOBILE'].some(key => row[key])) throw new Error('Enter at least one contact detail to update');
  return { nft_change_of_contact_details: [row] };
}
export async function submitNftContact(input: Record<string, string>) {
  let response: { Status?: string; Message?: string };
  try { response = await nseRequest('/nft/change-of-contact', buildNftContact(input)); }
  catch (failure) { if (failure instanceof NSEApiError && failure.status === 404) throw new Error('Mutual funds contact update service is unavailable. No folio contact change is confirmed.'); throw failure; }
  if (response?.Status !== 'Success') throw new Error(response?.Message || 'Mutual funds did not confirm receipt of the contact update. Check before retrying.');
  return response.Message || 'Mutual funds received the contact update';
}
