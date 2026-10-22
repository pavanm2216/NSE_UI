import { nseRequest, NSEApiError } from './nseApi';
import { buildNftCommon } from './nseNftBankService';
import type { NftField } from './nseNftNomineeService';
export const NFT_SINGLE_BANK_FIELDS: NftField[] = [
  { key: 'PB_ACT_NO', label: 'New primary bank account', max: 40 }, { key: 'PB_HLD_NAM', label: 'Primary account holder name', max: 40 }, { key: 'PB_IFSC_CD', label: 'Primary bank IFSC', max: 11 }, { key: 'PB_ACT_TY', label: 'Primary account type master code', max: 5 }, { key: 'PB_NAM', label: 'Primary bank name', max: 40 }, { key: 'PB_BR_NAM', label: 'Primary bank branch', max: 35 },
];
export function buildNftSingleBank(input: Record<string, string>) {
  const row = buildNftCommon(input);
  for (const field of NFT_SINGLE_BANK_FIELDS) {
    const value = (input[field.key] || '').trim();
    if (!value || value.length > field.max || value.toLowerCase() === 'string') throw new Error(`Enter ${field.label} (up to ${field.max} characters)`);
    row[field.key] = value;
  }
  row.PB_IFSC_CD = row.PB_IFSC_CD.toUpperCase();
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(row.PB_IFSC_CD)) throw new Error('Enter a valid primary bank IFSC');
  return { nft_change_of_bank_account_details: [row] };
}
export async function submitNftSingleBank(input: Record<string, string>) {
  const body = buildNftSingleBank(input);
  let response: { Status?: string; Message?: string };
  try { response = await nseRequest('/nft/change-of-bank-single', body); }
  catch (failure) { if (failure instanceof NSEApiError && failure.status === 404) throw new Error('Mutual funds single-bank change service is unavailable. No primary bank change is confirmed.'); throw failure; }
  if (response?.Status !== 'Success') throw new Error(response?.Message || 'Mutual funds did not confirm receipt of the primary bank change. Check before retrying.');
  return response.Message || 'Mutual funds received the primary bank change';
}
