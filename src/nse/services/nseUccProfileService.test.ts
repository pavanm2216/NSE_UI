import { expect, it, vi, afterEach } from 'vitest';
import { buildNSEUccRegistration, registerNSEUcc } from './nseUccRegistrationService';
import { getUccProfile, getUccProfileFields } from './nseUccProfileService';
import { nseMasterOptions } from './nseDocumentMasters';
import { validUccValues } from './fixtures/nseUccRegistration';
import { NSE_TOKEN_KEY } from './nseApi';

function profileValues(changes: Record<string, string> = {}): Record<string, string> {
  const values: Record<string, string> = { ...validUccValues, holding_nature: 'SI', client_type: 'P', primary_holder_pan_exempt: 'N', ...changes };
  const profile = getUccProfile(values);
  if (profile.minor) values.primary_holder_dob_incorporation = '2015-01-02';
  if (profile.entity) values.primary_holder_pan = 'ABCCD1234F';
  // Fill required profile sections, including sections revealed by the DP selection.
  for (let pass = 0; pass < 3; pass++) for (const field of getUccProfileFields(values)) {
    if (!field.required || values[field.key]) continue;
    values[field.key] = field.options ? field.options[0][0]
      : field.key.endsWith('_pan') ? 'ABCPD1234F'
      : field.key.endsWith('_dob') ? '1980-01-01'
      : field.key.endsWith('_email') ? 'holder@example.test'
      : field.key.endsWith('_mobile') ? '9000000001'
      : field.key === 'cdsl_dpid' ? '12345678'
      : field.key === 'cdslcltid' ? '1234567812345678'
      : field.key === 'nsdldpid' ? 'IN123456'
      : field.key === 'nsdlcltid' ? '12345678'
      : field.key === 'cmbp_id' ? '1234567812345678'
      : field.key.endsWith('_pincode') ? '10001'
      : field.key.endsWith('_ref_no') ? 'TESTREF001'
      : 'Test';
  }
  return values;
}

afterEach(() => { vi.unstubAllGlobals(); sessionStorage.clear(); });

it.each(nseMasterOptions('clientTaxStatuses'))('accepts documented tax status %s (%s) with its required fields', (code) => {
  const row = buildNSEUccRegistration(profileValues({ tax_status: code })).reg_details[0];
  expect(row.tax_status).toBe(code);
});

it.each(['JO', 'AS'])('preserves %s and maps additional holders, contacts and dates', holding => {
  const values = profileValues({ holding_nature: holding, third_holder_enabled: 'Y', second_holder_kyc_type: 'C', second_holder_ckyc_number: '12345678901234' });
  const row = buildNSEUccRegistration(values).reg_details[0];
  expect(row).toMatchObject({ holding_nature: holding, second_holder_first_name: 'Test', third_holder_first_name: 'Test', second_holder_dob: '01/01/1980', third_holder_dob: '01/01/1980', second_holder_pan_exempt: 'N', second_holder_ckyc_number: '12345678901234', second_holder_email_declaration: 'SE' });
  expect(row).not.toHaveProperty('third_holder_enabled');
  expect(() => buildNSEUccRegistration({ ...values, second_holder_first_name: '' })).toThrow('second holder first name');
  expect(() => buildNSEUccRegistration({ ...values, third_holder_email: '' })).toThrow('third holder email');
});

it('collects guardian details for minors and converts both dates', () => {
  const values = profileValues({ tax_status: '02' });
  expect(buildNSEUccRegistration(values).reg_details[0]).toMatchObject({ tax_status: '02', primary_holder_dob_incorporation: '02/01/2015', guardian_dob: '01/01/1980', guardian_relation: '06' });
  expect(() => buildNSEUccRegistration({ ...values, guardian_first_name: '' })).toThrow('guardian first name');
  expect(() => buildNSEUccRegistration({ ...values, primary_holder_dob_incorporation: '1990-01-01' })).toThrow('adult investor type');
});

it.each(['CDSL', 'NSDL'])('maps the selected %s depository fields and validates identifiers', dp => {
  const values = profileValues({ client_type: 'D', default_dp: dp });
  const row = buildNSEUccRegistration(values).reg_details[0];
  expect(row).toMatchObject({ client_type: 'D', default_dp: dp, pms: 'N' });
  if (dp === 'CDSL') {
    expect(row).toMatchObject({ cdsl_dpid: '12345678', cdslcltid: '1234567812345678' });
    expect(() => buildNSEUccRegistration({ ...values, cdslcltid: '123' })).toThrow('16 digits');
    expect(row).not.toHaveProperty('nsdldpid');
  } else {
    expect(row).toMatchObject({ nsdldpid: 'IN123456', nsdlcltid: '12345678', cmbp_id: '1234567812345678' });
    expect(() => buildNSEUccRegistration({ ...values, nsdldpid: 'BAD' })).toThrow('NSDL DP ID');
    expect(row).not.toHaveProperty('cdslcltid');
  }
});

it('supports NRE/NRO banks and foreign addresses without requiring an Indian mobile', () => {
  for (const [tax_status, account_type_1] of [['21', 'NE'], ['24', 'NO']]) {
    const values = profileValues({ tax_status, account_type_1, indian_mobile_no: '' });
    expect(buildNSEUccRegistration(values).reg_details[0]).toMatchObject({ tax_status, account_type_1, foreign_address_1: 'Test', country: 'INDIA' });
    expect(() => buildNSEUccRegistration({ ...values, foreign_address_country: '' })).toThrow('foreign country');
  }
});

it('requires exemption category and KRA reference when PAN is exempt', () => {
  const values = profileValues({ primary_holder_pan_exempt: 'Y' });
  const row = buildNSEUccRegistration(values).reg_details[0];
  expect(row).toMatchObject({ primary_holder_pan_exempt: 'Y', primary_holder_exempt_category: '01', primary_holder_kra_exempt_ref_no: 'TESTREF001' });
  expect(row).not.toHaveProperty('primary_holder_pan');
  expect(() => buildNSEUccRegistration({ ...values, primary_holder_kra_exempt_ref_no: '' })).toThrow('kra exemption reference');
});

it('drops details that no longer apply after changing account type', () => {
  const old = profileValues({ holding_nature: 'JO', third_holder_enabled: 'Y', client_type: 'D', default_dp: 'CDSL', tax_status: '26' });
  const values = { ...old, tax_status: '01', primary_holder_dob_incorporation: '1990-01-01', holding_nature: 'SI', client_type: 'P' };
  const row = buildNSEUccRegistration(values).reg_details[0];
  expect(Object.keys(row).some(key => /^(second_holder|third_holder|guardian|foreign_address)_/.test(key))).toBe(false);
  for (const key of ['pms', 'default_dp', 'cdslcltid', 'cdsl_dpid', 'third_holder_enabled']) expect(row).not.toHaveProperty(key);
});

it('submits the selected joint demat profile without replacing it with SI/P', async () => {
  const values = profileValues({ holding_nature: 'AS', client_type: 'D', default_dp: 'NSDL' });
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ reg_details: [{ client_code: values.client_code, reg_status: 'REG_SUCCESS', reg_id: '12345' }] }) });
  vi.stubGlobal('fetch', fetcher);
  expect(await registerNSEUcc(values)).toMatchObject({ state: 'registered' });
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(JSON.parse(fetcher.mock.calls[0][1].body).reg_details[0]).toMatchObject({ holding_nature: 'AS', client_type: 'D', default_dp: 'NSDL', second_holder_first_name: 'Test' });
});
