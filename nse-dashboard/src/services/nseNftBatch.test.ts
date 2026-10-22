import { expect, it, vi } from 'vitest';
vi.mock('./nseApi', () => ({ nseRequest: vi.fn(), NSEApiError: class extends Error { constructor(message: string, public status: number) { super(message); } } }));
import { nseRequest, NSEApiError } from './nseApi';
import { buildNftNominee, submitNftNominee } from './nseNftNomineeService';
import { buildNftBank, submitNftBank } from './nseNftBankService';
import { buildNftContact, submitNftContact } from './nseNftContactService';
const common = { AMC_CODE: 'TST', FOLIO_NO: '000123', TAX_NUMBER: 'AAAAA1234A', DOC_TYPE: '', TWOFA_AUTH: 'E', EMAIL: 'investor@example.test' };
const nominee = { ...common, NOM_OPT: 'N', NOM_COUNT: '1', NOM_SOA: 'Y', NOM1_NAME: 'Test nominee', NOM1_RELA: '01', NOM1_PER: '100', NOM1_ID_T: '2', NOM1_IDNO: '1234', NOM1_MIN_F: 'N', NOM1_EMAI: 'nominee@example.test', NOM1_MOB: '9000000000', NOM1_ADD1: 'Test address', NOM1_CITY: 'Test city', NOM1_PIN: '123456', NOM1_CON: 'India' };
const bank = { ...common, AB1_ACT_NO: '000123456789', AB1_HLD_NA: 'Test investor', AB1_IFS_CD: 'TEST0000123', AB1_ACT_TY: 'SB', AB1_NAME: 'Test bank', AB1_BR_NAM: 'Test branch' };
it('builds exact nominee wrapper fields and clears nominees when opting out', () => {
  const row = buildNftNominee(nominee).nft_nominee_registration_modification_details[0];
  expect(row.NOM1_EMAI).toBe('nominee@example.test'); expect(row.NCT_TYPE).toBe('NOM');
  const optout = buildNftNominee({ ...nominee, NOM_OPT: 'Y' }).nft_nominee_registration_modification_details[0];
  expect(optout.NOM_OPT).toBe('Y'); expect(optout).not.toHaveProperty('NOM1_NAME');
});
it('enforces integer allocations, identities, conditional fields and wrapper count', () => {
  expect(() => buildNftNominee({ ...nominee, NOM1_PER: '99' })).toThrow('100 percent');
  expect(() => buildNftNominee({ ...nominee, NOM1_PER: '9.5' })).toThrow('whole number');
  expect(() => buildNftNominee({ ...nominee, NOM1_IDNO: '123456789012' })).toThrow('last four');
  expect(() => buildNftNominee({ ...nominee, NOM_COUNT: '4' })).toThrow('three');
  expect(() => buildNftNominee({ ...nominee, NOM1_EMAI: '' })).toThrow('EMAI');
});
it('formats minor DOB as MM/DD/YYYY and validates age and guardian PAN', () => {
  expect(buildNftNominee({ ...nominee, NOM1_MIN_F: 'Y', NOM1_DOB: '2020-12-03' }, '2026-10-16').nft_nominee_registration_modification_details[0].NOM1_DOB).toBe('12/03/2020');
  expect(() => buildNftNominee({ ...nominee, NOM1_MIN_F: 'Y' })).toThrow('birth');
  expect(() => buildNftNominee({ ...nominee, NOM1_DOB: '2020-12-03' })).toThrow('minor status');
  expect(() => buildNftNominee({ ...nominee, NOM1_GPAN: 'invalid' })).toThrow('guardian PAN');
});
it('requires the correct authorization and wet signature email', () => {
  expect(() => buildNftNominee({ ...nominee, TWOFA_AUTH: '' })).toThrow('channel');
  expect(() => buildNftNominee({ ...nominee, DOC_TYPE: 'W', EMAIL: '' })).toThrow('email');
  expect(buildNftNominee({ ...nominee, DOC_TYPE: 'W', IMG_REF_NO: 'test.tiff' }).nft_nominee_registration_modification_details[0].TWOFA_AUTH).toBe('');
});
it('requires complete bank groups and excludes nominee fields', () => {
  const row = buildNftBank(bank).nft_change_of_bank_account_details[0];
  expect(row.AB1_ACT_NO).toBe('000123456789'); expect(row).not.toHaveProperty('NCT_TYPE');
  expect(() => buildNftBank(common)).toThrow('at least one');
  expect(() => buildNftBank({ ...bank, AB2_ACT_NO: '123' })).toThrow('Bank 2');
  expect(() => buildNftBank({ ...bank, AB1_IFS_CD: 'invalid' })).toThrow('IFSC');
});
it('requires documented declarations for all holders sharing contact details', () => {
  expect(() => buildNftContact({ ...common, J1_EMAIL: common.EMAIL })).toThrow('each holder');
  const row = buildNftContact({ ...common, J1_EMAIL: common.EMAIL, PH_EMA_DEC: 'SE', J1_EMA_DEC: 'SP' }).nft_change_of_contact_details[0];
  expect(row.J1_EMA_DEC).toBe('SP');
  expect(() => buildNftContact({ ...common, PH_EMA_DEC: 'XX' })).toThrow('documented');
  expect(() => buildNftContact({ ...common, J2_MOBILE: 'abc' })).toThrow('mobile');
});
it('requires explicit Success and treats 404 as unavailable for bank/contact', async () => {
  vi.mocked(nseRequest).mockResolvedValueOnce({ Message: '' });
  await expect(submitNftNominee(nominee)).rejects.toThrow('did not confirm');
  vi.mocked(nseRequest).mockResolvedValueOnce({ Status: 'Success', Message: 'Request added' });
  await expect(submitNftNominee(nominee)).resolves.toBe('Request added');
  vi.mocked(nseRequest).mockRejectedValueOnce(new NSEApiError('<html>404</html>', 404));
  await expect(submitNftBank(bank)).rejects.toThrow('unavailable');
  vi.mocked(nseRequest).mockRejectedValueOnce(new NSEApiError('<html>404</html>', 404));
  await expect(submitNftContact(common)).rejects.toThrow('unavailable');
});
