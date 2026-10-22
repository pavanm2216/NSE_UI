import { describe, expect, it } from 'vitest';
import { validateNSEUccDraft } from './nseUccDraftService';

describe('Client Master document groups', () => {
  it('validates the bank step separately from the later KYC step', () => {
    const bank = { account_no_1: '12345', confirm_account: '12345', account_type_1: 'SB', ifsc_code_1: 'HDFC0001234', div_pay_mode: '04' };
    expect(() => validateNSEUccDraft(bank, 1)).not.toThrow();
    expect(() => validateNSEUccDraft(bank, 3)).toThrow('primary holder kyc type');
    expect(() => validateNSEUccDraft({ ...bank, confirm_account: '98765' }, 1)).toThrow('do not match');
  });
  it('requires the document opt-out authentication and reference', () => {
    expect(() => validateNSEUccDraft({ nomination_opt: 'N' }, 4)).toThrow('nomination authentication');
    expect(() => validateNSEUccDraft({ nomination_opt: 'N', nomination_authentication: 'O' }, 4)).toThrow('nominee opt out ref no');
    expect(() => validateNSEUccDraft({ nomination_opt: 'N', nomination_authentication: 'V', nominee_opt_out_ref_no: 'REF123' }, 4)).not.toThrow();
  });
  it('validates the conditional nominee identity and contact fields', () => {
    const nominee = {
      nomination_opt: 'Y', nominee_1_name: 'Example', nominee_1_relationship: '20', nomination_authentication: 'O', nominee_soa: 'Y',
      nominee_1_identity_type: '2', nominee_1_identity_no: '123456789012', nominee_1_email: 'example@example.com', nominee_1_mobile: '9876543210',
      nominee_1_address1: 'Example street', nominee_1_city: 'Mumbai', nominee_1_pincode: '400001', nominee_1_country: 'INDIA',
    };
    expect(() => validateNSEUccDraft(nominee, 4)).toThrow('last four Aadhaar digits');
    expect(() => validateNSEUccDraft({ ...nominee, nominee_1_identity_no: '1234' }, 4)).not.toThrow();
    expect(() => validateNSEUccDraft({ ...nominee, nominee_1_identity_no: '1234', nominee_1_email: '' }, 4)).toThrow('nominee 1 email');
  });
});
