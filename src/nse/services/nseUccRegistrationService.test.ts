import { afterEach, expect, it, vi } from 'vitest';
import { buildNSEUccRegistration as build, parseNSEUccRegistration as parse, registerNSEUcc } from './nseUccRegistrationService';
import { validUccValues as values } from './fixtures/nseUccRegistration';
import { NSE_TOKEN_KEY } from './nseApi';

afterEach(() => { vi.unstubAllGlobals(); sessionStorage.clear(); });
it('maps a single adult physical investor to the documented UCC envelope and wire field names', () => {
  const row = build({ ...values, primary_holder_pan: values.primary_holder_pan.toLowerCase(), ifsc_code_1: 'test0001234', reg_status: 'REG_SUCCESS', reg_id: '123', arbitrary: 'injected' }).reg_details[0];
  expect(row).toMatchObject({
    client_code: 'TESTUCC001', primary_holder_pan: 'ABCPD1234F', primary_holder_dob_incorporation: '02/01/1990', holding_nature: 'SI', client_type: 'P',
    primary_holder_pan_exempt: 'N', default_bank_flag_1: 'Y', account_no_1: '000123456789', ifsc_code_1: 'TEST0001234', occupation_code: '02', country: 'INDIA',
    nominee_1_identity_number: '1234', nominee_1_pin: '400001', nominee_1_applicable: '100', nominee_1_minor_flag: 'N',
  });
  for (const key of ['confirm_account', 'nominee_1_identity_no', 'nominee_1_pincode', 'reg_id', 'reg_status', 'reg_remark', 'arbitrary']) expect(row).not.toHaveProperty(key);
  expect(row.primary_holder_ckyc_number).toBe('');
});
it('sends an authenticated opt-out reference and clears stale nominee data', () => {
  const row = build({ ...values, nomination_opt: 'N', nomination_authentication: 'V', nominee_opt_out_ref_no: 'TESTREF001' }).reg_details[0];
  expect(row).toMatchObject({ nomination_opt: 'N', nomination_authentication: 'V', nominee_opt_out_ref_no: 'TESTREF001' });
  expect(Object.keys(row).some(key => key.startsWith('nominee_1_'))).toBe(false);
  expect(row).not.toHaveProperty('nominee_soa');
  expect(() => build({ ...values, nomination_opt: 'N', nomination_authentication: 'O' })).toThrow('nominee opt out ref no');
});
it('blocks unsupported profiles, missing declarations, invalid codes and overlong or delimiter-containing values', () => {
  for (const change of [{ tax_status: '02' }, { country: '228' }, { account_type_1: 'NE' }, { primary_holder_pan: 'ABCHD1234F' }, { aadhaar_updated: '' }, { gender: 'X' }, { occupation_code: '99' }, { primary_holder_dob_incorporation: '2099-01-01' }, { address_1: 'X'.repeat(41) }, { primary_holder_first_name: 'Test|Injected' }]) expect(() => build({ ...values, ...change })).toThrow();
  expect(() => build({ ...values, primary_holder_kyc_type: 'C' })).toThrow('14-digit');
  expect(build({ ...values, primary_holder_kyc_type: 'C', primary_holder_ckyc_number: '12345678901234' }).reg_details[0].primary_holder_ckyc_number).toBe('12345678901234');
});
it('requires matching identity, confirmed status and a nonzero registration ID', () => {
  const row = { client_code: values.client_code, reg_status: 'REG_SUCCESS', reg_id: '12345' };
  expect(parse({ reg_details: [row] }, values.client_code)).toMatchObject({ state: 'registered', registrationId: '12345' });
  expect(parse({ reg_details: [{ ...row, reg_status: 'REG_FAILED', reg_remark: 'Duplicate client code' }] }, values.client_code)).toMatchObject({ state: 'rejected', remark: 'Duplicate client code' });
  for (const changed of [{ ...row, client_code: 'OTHER' }, { ...row, reg_id: '0' }, { ...row, reg_id: undefined }, { ...row, reg_status: 'PENDING' }]) expect(parse({ reg_details: [changed] }, values.client_code).state).toBe('unknown');
  expect(parse({ reg_details: [] }, values.client_code).state).toBe('unknown');
  expect(parse({ reg_details: [row, row] }, values.client_code).state).toBe('unknown');
  expect(parse({ response_status: 'F', reg_details: [row] }, values.client_code).state).toBe('unknown');
});
it('posts once with the bearer token and never treats HTTP 200 alone as registration', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => JSON.stringify({ reg_details: [{ client_code: values.client_code, reg_status: 'REG_FAILED', reg_id: '0', reg_remark: 'Client already exists' }] }) });
  vi.stubGlobal('fetch', fetcher);
  expect(await registerNSEUcc(values)).toMatchObject({ state: 'rejected', remark: 'Client already exists' });
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(fetcher).toHaveBeenCalledWith('/nse-api/ucc/register', expect.objectContaining({ method: 'POST', headers: expect.objectContaining({ Authorization: 'Bearer test-token' }), body: JSON.stringify(build(values)) }));
});
it('returns unknown on a timeout without retrying or exposing database details', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const fetcher = vi.fn().mockRejectedValue(new Error('timeout')); vi.stubGlobal('fetch', fetcher);
  expect(await registerNSEUcc(values)).toMatchObject({ state: 'unknown' });
  expect(fetcher).toHaveBeenCalledTimes(1);
  fetcher.mockResolvedValue({ ok: false, status: 500, text: async () => JSON.stringify({ detail: 'DB save failed: private SQL parameters' }) });
  const result = await registerNSEUcc(values);
  expect(result.state).toBe('unknown');
  expect(result.remark).not.toContain('private SQL');
});

it('explains an API opt-out schema rejection without dropping the reference or retrying', async () => {
  sessionStorage.setItem(NSE_TOKEN_KEY, 'test-token');
  const fetcher = vi.fn().mockResolvedValue({ ok: false, status: 422, text: async () => JSON.stringify({ detail: [{ type: 'extra_forbidden', loc: ['body', 'reg_details', 0, 'nominee_opt_out_ref_no'], msg: 'Extra inputs are not permitted' }] }) });
  vi.stubGlobal('fetch', fetcher);
  const result = await registerNSEUcc({ ...values, nomination_opt: 'N', nomination_authentication: 'O', nominee_opt_out_ref_no: 'TESTREF001' });
  expect(result.state).toBe('rejected');
  expect(result.remark).toContain('API provider must add support');
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(JSON.parse(fetcher.mock.calls[0][1].body).reg_details[0]).toHaveProperty('nominee_opt_out_ref_no', 'TESTREF001');
});
