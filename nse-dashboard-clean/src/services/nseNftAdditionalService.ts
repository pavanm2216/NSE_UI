import { nseRequest, NSEApiError } from './nseApi';
import { buildNftCommon } from './nseNftBankService';
import type { NftField } from './nseNftNomineeService';
export type NftAdditionalMode = 'dividend' | 'broker' | 'consolidation';
export const NFT_ADDITIONAL_FIELDS: Record<NftAdditionalMode, NftField[]> = {
  dividend: [{ key: 'SCH_CODE', label: 'RTA scheme and plan code', max: 10 }, { key: 'REINV_TAG', label: 'Reinvestment option code', max: 1 }],
  broker: [{ key: 'BROKER_TYPE', label: 'Update broker or adviser', max: 3, options: [['', 'Choose type'], ['ARN', 'ARN holder'], ['RIA', 'Registered investment adviser']] }, { key: 'BROKE_CD', label: 'Broker code', max: 20 }, { key: 'SBBR_CODE', label: 'Sub-broker code (optional)', max: 15 }, { key: 'EUIN', label: 'EUIN (optional)', max: 7 }, { key: 'RIA_CODE', label: 'RIA code', max: 20 }],
  consolidation: [{ key: 'SRC_FOLIO', label: 'Source folios (comma-separated)', max: 150 }],
};
const endpoints = { dividend: '/nft/change-of-dividend', broker: '/nft/change-of-broker', consolidation: '/nft/consolidation-of-folio' };
const envelopes = { dividend: 'nft_change_of_dividend_details', broker: 'nft_change_of_broker_details', consolidation: 'nft_consolidation_folio_details' };
export function buildNftAdditional(mode: NftAdditionalMode, input: Record<string, string>) {
  const row = buildNftCommon(input);
  for (const field of NFT_ADDITIONAL_FIELDS[mode]) {
    if (field.key === 'BROKER_TYPE') continue;
    const value = (input[field.key] || '').trim();
    if (value.length > field.max || value.toLowerCase() === 'string') throw new Error(`Enter a valid ${field.label} (up to ${field.max} characters)`);
    row[field.key] = value;
  }
  if (mode === 'dividend' && (!row.SCH_CODE || !row.REINV_TAG)) throw new Error('Enter the scheme/plan code and reinvestment option code');
  if (mode === 'broker') {
    if (!['ARN', 'RIA'].includes(input.BROKER_TYPE)) throw new Error('Choose ARN holder or registered investment adviser');
    if (input.BROKER_TYPE === 'ARN') { if (!row.BROKE_CD) throw new Error('Broker code is required for ARN holders'); row.RIA_CODE = ''; }
    else { if (!row.RIA_CODE) throw new Error('RIA code is required for registered investment advisers'); row.BROKE_CD = ''; row.SBBR_CODE = ''; row.EUIN = ''; }
    if (row.EUIN) { row.EUIN = row.EUIN.toUpperCase(); if (!/^E\d{6}$/.test(row.EUIN)) throw new Error('EUIN must be E followed by six digits'); }
  }
  if (mode === 'consolidation') {
    const folios = row.SRC_FOLIO.split(',').map(value => value.trim());
    const canonical = (value: string) => value.replace(/^0+(?=\d)/, '');
    if (folios.some(value => !/^\d{1,25}$/.test(value))) throw new Error('Enter numeric source folios of up to 25 digits each');
    if (folios.some(value => canonical(value) === canonical(row.FOLIO_NO))) throw new Error('The target folio cannot be a source folio');
    if (new Set(folios.map(canonical)).size !== folios.length) throw new Error('Do not repeat source folios');
    row.SRC_FOLIO = folios.join(',');
  }
  return { [envelopes[mode]]: [row] };
}
export async function submitNftAdditional(mode: NftAdditionalMode, input: Record<string, string>) {
  const body = buildNftAdditional(mode, input);
  let response: { Status?: string; Message?: string };
  try { response = await nseRequest(endpoints[mode], body); }
  catch (failure) { if (failure instanceof NSEApiError && failure.status === 404) throw new Error(`Mutual funds ${mode} service is unavailable. No folio change is confirmed.`); throw failure; }
  if (response?.Status !== 'Success') throw new Error(response?.Message || 'Mutual funds did not confirm receipt of this folio update. Check before retrying.');
  return response.Message || 'Mutual funds received the folio update';
}
