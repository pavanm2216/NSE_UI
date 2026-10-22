import { expect, it, vi } from 'vitest';
vi.mock('./nseApi', () => ({ nseRequest: vi.fn(), NSEApiError: class extends Error { constructor(message: string, public status: number) { super(message); } } }));
import { nseRequest, NSEApiError } from './nseApi';
import { buildNftAdditional as build, submitNftAdditional } from './nseNftAdditionalService';
const common = { AMC_CODE: 'TST', FOLIO_NO: '000123', TAX_NUMBER: 'AAAAA1234A', DOC_TYPE: '', TWOFA_AUTH: 'E', EMAIL: 'investor@example.test' };
it('builds dividend payload with documented sizes and exact envelope', () => {
  const row = build('dividend', { ...common, SCH_CODE: 'TESTSCH', REINV_TAG: 'Y' }).nft_change_of_dividend_details[0];
  expect(row.SCH_CODE).toBe('TESTSCH'); expect(row.REINV_TAG).toBe('Y'); expect(row).not.toHaveProperty('NCT_TYPE');
  expect(() => build('dividend', common)).toThrow('scheme/plan');
  expect(() => build('dividend', { ...common, SCH_CODE: 'x'.repeat(11), REINV_TAG: 'Y' })).toThrow('10 characters');
  expect(() => build('dividend', { ...common, SCH_CODE: 'TESTSCH', REINV_TAG: 'YES' })).toThrow('1 characters');
});
it('requires the chosen broker/adviser code and omits the local choice from the wire', () => {
  expect(() => build('broker', common)).toThrow('Choose ARN');
  expect(() => build('broker', { ...common, BROKER_TYPE: 'ARN' })).toThrow('Broker code');
  expect(() => build('broker', { ...common, BROKER_TYPE: 'RIA' })).toThrow('RIA code');
  const row = build('broker', { ...common, BROKER_TYPE: 'RIA', RIA_CODE: 'TESTRIA', BROKE_CD: 'TESTBROKER' }).nft_change_of_broker_details[0];
  expect(row.RIA_CODE).toBe('TESTRIA'); expect(row.BROKE_CD).toBe(''); expect(row).not.toHaveProperty('BROKER_TYPE');
  expect(() => build('broker', { ...common, BROKER_TYPE: 'ARN', BROKE_CD: 'TESTBROKER', EUIN: 'invalid' })).toThrow('EUIN');
});
it('normalizes source lists, preserves leading zeros and rejects self/duplicate sources', () => {
  const row = build('consolidation', { ...common, SRC_FOLIO: '000456, 000789' }).nft_consolidation_folio_details[0];
  expect(row.FOLIO_NO).toBe('000123'); expect(row.SRC_FOLIO).toBe('000456,000789');
  expect(() => build('consolidation', { ...common, SRC_FOLIO: '123' })).toThrow('target');
  expect(() => build('consolidation', { ...common, SRC_FOLIO: '456,000456' })).toThrow('repeat');
  expect(() => build('consolidation', { ...common, SRC_FOLIO: '456,' })).toThrow('numeric');
  expect(() => build('consolidation', { ...common, SRC_FOLIO: '1'.repeat(26) })).toThrow('25 digits');
});
it('uses all three wrapper paths and requires explicit Success', async () => {
  const values = { dividend: { ...common, SCH_CODE: 'TESTSCH', REINV_TAG: 'Y' }, broker: { ...common, BROKER_TYPE: 'ARN', BROKE_CD: 'TESTBROKER' }, consolidation: { ...common, SRC_FOLIO: '456' } };
  const paths = { dividend: '/nft/change-of-dividend', broker: '/nft/change-of-broker', consolidation: '/nft/consolidation-of-folio' };
  for (const mode of ['dividend', 'broker', 'consolidation'] as const) {
    vi.mocked(nseRequest).mockResolvedValueOnce({ Status: 'Success', Message: 'Request added' });
    await expect(submitNftAdditional(mode, values[mode])).resolves.toBe('Request added');
    expect(nseRequest).toHaveBeenLastCalledWith(paths[mode], build(mode, values[mode]));
    vi.mocked(nseRequest).mockRejectedValueOnce(new NSEApiError('<html>404</html>', 404));
    await expect(submitNftAdditional(mode, values[mode])).rejects.toThrow('unavailable');
  }
  vi.mocked(nseRequest).mockResolvedValueOnce({ Message: '' });
  await expect(submitNftAdditional('consolidation', values.consolidation)).rejects.toThrow('did not confirm');
});
