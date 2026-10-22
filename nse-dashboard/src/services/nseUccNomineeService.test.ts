import { expect, it, vi, afterEach } from 'vitest';
import { buildNSEUccRegistration, registerNSEUcc } from './nseUccRegistrationService';
import { validUccValues } from './fixtures/nseUccRegistration';
import { NSE_TOKEN_KEY } from './nseApi';

function nominees(shares: string[]) {
  const values: Record<string, string> = { ...validUccValues, nominee_count: String(shares.length) };
  shares.forEach((share, offset) => {
    const index = offset + 1;
    for (const [key, value] of Object.entries(validUccValues)) {
      if (key.startsWith('nominee_1_')) values[key.replace('nominee_1_', `nominee_${index}_`)] = value;
    }
    values[`nominee_${index}_name`] = `Nominee ${index}`;
    values[`nominee_${index}_applicable`] = share;
  });
  return values;
}

afterEach(() => { vi.unstubAllGlobals(); sessionStorage.clear(); });

it('sends two adult nominees with their shares and the API identity/pincode names', () => {
  const values = nominees(['60', '40']);
  values.nominee_2_identity_type = '1';
  values.nominee_2_identity_no = 'abcpa1234f';
  const row = buildNSEUccRegistration(values).reg_details[0];
  expect(row).toMatchObject({ nominee_1_applicable: '60', nominee_2_name: 'Nominee 2', nominee_2_applicable: '40', nominee_2_identity_number: 'ABCPA1234F', nominee_2_pin: '400001', nominee_1_minor_flag: 'N', nominee_2_minor_flag: 'N' });
  for (const key of ['nominee_count', 'nominee_2_identity_no', 'nominee_2_pincode', 'nominee_3_name', 'nominee_opt_out_ref_no']) expect(row).not.toHaveProperty(key);
});

it('accepts three nominees whose decimal allocations total exactly 100%', () => {
  const row = buildNSEUccRegistration(nominees(['33.33', '33.33', '33.34'])).reg_details[0];
  expect(row).toMatchObject({ nominee_1_applicable: '33.33', nominee_2_applicable: '33.33', nominee_3_applicable: '33.34', nominee_3_name: 'Nominee 3', nominee_3_minor_flag: 'N' });
});

it('blocks invalid totals, invalid precision and unsupported nominee counts', () => {
  for (const shares of [['60', '30'], ['60', '50'], ['100', '0'], ['100', '-1'], ['50.001', '49.999'], ['NaN', '50'], ['1e2'], [''], ['101']]) {
    expect(() => buildNSEUccRegistration(nominees(shares))).toThrow();
  }
  expect(() => buildNSEUccRegistration({ ...nominees(['100']), nominee_count: '4' })).toThrow('one and three');
});

it('validates each added nominee before sending any request', async () => {
  const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
  for (const change of [{ nominee_2_email: '' }, { nominee_2_relationship: '99' }, { nominee_2_identity_type: '9' }, { nominee_2_country: 'UNKNOWN' }, { nominee_2_pincode: '123' }, { nominee_2_name: 'Too long a second nominee name' }, { nominee_2_minor_flag: 'Y' }]) {
    await expect(registerNSEUcc({ ...nominees(['60', '40']), ...change })).rejects.toThrow();
  }
  expect(fetcher).not.toHaveBeenCalled();
});

it('removes every nominee slot on opt-out instead of leaking previous nominees', () => {
  const row = buildNSEUccRegistration({ ...nominees(['40', '30', '30']), nomination_opt: 'N', nomination_authentication: 'O', nominee_opt_out_ref_no: 'TESTREF001' }).reg_details[0];
  expect(Object.keys(row).some(key => /^nominee_\d+_/.test(key))).toBe(false);
  expect(row).not.toHaveProperty('nominee_count');
  expect(row).not.toHaveProperty('nominee_soa');
});

it('posts the complete multi-nominee registration once', async () => {
  const values = nominees(['60', '40']);
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ reg_details: [{ client_code: values.client_code, reg_status: 'REG_SUCCESS', reg_id: '12345' }] }) });
  vi.stubGlobal('fetch', fetcher);
  expect(await registerNSEUcc(values)).toMatchObject({ state: 'registered' });
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(JSON.parse(fetcher.mock.calls[0][1].body).reg_details[0]).toMatchObject({ nominee_1_applicable: '60', nominee_2_applicable: '40', nomination_opt: 'Y' });
});
