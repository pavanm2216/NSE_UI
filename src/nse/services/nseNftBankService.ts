import { nseRequest, NSEApiError } from './nseApi';
import { buildNftNominee, NFT_COMMON_FIELDS, NftField } from './nseNftNomineeService';
export const NFT_BANK_FIELDS: NftField[] = [
  { key: 'ACT_NO', label: 'Account number', max: 40 }, { key: 'HLD_NA', label: 'Account holder name', max: 40 }, { key: 'IFS_CD', label: 'IFSC', max: 11 }, { key: 'ACT_TY', label: 'Account type master code', max: 5 }, { key: 'NAME', label: 'Bank name', max: 40 }, { key: 'BR_NAM', label: 'Branch name', max: 35 },
];
export function buildNftCommon(input: Record<string, string>) {
  const validated = buildNftNominee({ ...input, NOM_OPT: 'Y' }).nft_nominee_registration_modification_details[0];
  return Object.fromEntries(NFT_COMMON_FIELDS.map(field => [field.key, validated[field.key]]));
}
export function buildNftBank(input: Record<string, string>) {
  const row = buildNftCommon(input);
  let banks = 0;
  const accounts: string[] = [];
  for (let number = 1; number <= 5; number++) {
    const prefix = `AB${number}_`;
    if (!NFT_BANK_FIELDS.some(field => input[prefix + field.key]?.trim())) continue;
    banks++;
    for (const field of NFT_BANK_FIELDS) {
      const value = (input[prefix + field.key] || '').trim();
      if (!value || value.length > field.max || value.toLowerCase() === 'string') throw new Error(`Bank ${number}: enter ${field.label} (up to ${field.max} characters)`);
      row[prefix + field.key] = value;
    }
    row[prefix + 'IFS_CD'] = row[prefix + 'IFS_CD'].toUpperCase();
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(row[prefix + 'IFS_CD'])) throw new Error(`Bank ${number}: enter a valid IFSC`);
    const account = `${row[prefix + 'ACT_NO']}|${row[prefix + 'IFS_CD']}`;
    if (accounts.includes(account)) throw new Error('Do not repeat the same bank account');
    accounts.push(account);
  }
  if (!banks) throw new Error('Enter at least one complete bank account');
  return { nft_change_of_bank_account_details: [row] };
}
export async function submitNftBank(input: Record<string, string>) {
  let response: { Status?: string; Message?: string };
  try { response = await nseRequest('/nft/change-of-bank', buildNftBank(input)); }
  catch (failure) { if (failure instanceof NSEApiError && failure.status === 404) throw new Error('Mutual funds multiple-bank update service is unavailable. No folio bank change is confirmed.'); throw failure; }
  if (response?.Status !== 'Success') throw new Error(response?.Message || 'Mutual funds did not confirm receipt of the bank update. Check before retrying.');
  return response.Message || 'Mutual funds received the multiple-bank update';
}
