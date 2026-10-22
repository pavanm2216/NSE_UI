import { describe, expect, it } from 'vitest';
import { getNSEFieldOptions, nseMasterOptions, validateNSEMasterValues } from './nseDocumentMasters';
import { buildNSEFatcaData } from './nseFatcaDataService';

describe('Mutual funds document code domains', () => {
  it('keeps Client Master and FATCA code tables separate', () => {
    expect(getNSEFieldOptions('client', 'occupation_code')).toHaveLength(8);
    expect(getNSEFieldOptions('fatca', 'occ_code')).toHaveLength(14);
    expect(getNSEFieldOptions('client', 'state')).toContainEqual(['BH', 'BIHAR']);
    expect(getNSEFieldOptions('fatca', 'ubo_state')).toContainEqual(['BR', 'BIHAR']);
    expect(getNSEFieldOptions('client', 'country')).toContainEqual(['101', 'INDIA']);
    expect(getNSEFieldOptions('fatca', 'tax_res1')).toContainEqual(['IN', 'INDIA']);
    expect(getNSEFieldOptions('client', 'tax_status')).toContainEqual(['75', 'BANK/ CO-OPERATIVE BANK']);
    expect(getNSEFieldOptions('fatca', 'tax_status')).toContainEqual(['75', 'ARTIFICIAL JURIDICAL PERSON']);
  });
  it('preserves leading zeros and rejects names or codes from the wrong table', () => {
    expect(() => validateNSEMasterValues('client', { occupation_code: '01' })).not.toThrow();
    expect(() => validateNSEMasterValues('client', { occupation_code: 'Business' })).toThrow('occupation code');
    expect(() => validateNSEMasterValues('client', { occupation_code: '09' })).toThrow('occupation code');
    expect(() => validateNSEMasterValues('fatca', { occ_code: '09' })).not.toThrow();
    expect(() => validateNSEMasterValues('fatca', { tax_res2: '101' })).toThrow('tax res2');
    expect(() => buildNSEFatcaData({ occ_code: 'Doctor' })).toThrow('occ code');
  });
  it('uses FATCA identity masters for every tax residence and UBO', () => {
    for (const key of ['id1_type', 'id2_type', 'id3_type', 'id4_type', 'ubo_id_ty']) {
      expect(getNSEFieldOptions('fatca', key)).toContainEqual(['C', 'PAN CARD']);
      expect(getNSEFieldOptions('fatca', key)).toContainEqual(['C1', 'COMPANY IDENTIFICATION NUMBER']);
    }
    expect(nseMasterOptions('guardianRelationships').map(([code]) => code)).toEqual(['06', '13', '23']);
    expect(nseMasterOptions('nomineeRelationships').some(([code]) => code === '23')).toBe(false);
    expect(nseMasterOptions('fatcaExemptions')).toContainEqual(['K', 'Broker']);
    expect(getNSEFieldOptions('fatca', 'nffe_catg')).toBeUndefined();
  });
});
