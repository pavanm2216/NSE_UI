import { expect, it } from 'vitest';
import { parseNSEUccResponse as parse, validateNSEUccRequest as validate } from './nseUccService';
it('rejects placeholders, invalid batch sizes and response-only request fields', () => {
  expect(() => validate({ reg_details: [] })).toThrow('1 and 50');
  expect(() => validate({ reg_details: [{ client_code: 'string' }] })).toThrow('placeholders');
  expect(() => validate({ reg_details: [{ client_code: 'TEST001', reg_id: '123' }] })).toThrow('response fields');
});
it('handles successful response keys with trailing spaces without claiming KYC verification', () => {
  expect(parse({ reg_details: [{ client_code: 'TEST001', reg_id: '123', reg_status: 'REG_SUCCESS' }] }, 'TEST001')).toMatchObject({ state: 'registered', id: '123' });
  expect(parse({ reg_details: [{ client_code: 'TEST001', reg_id: '0', reg_status: 'REG_SUCCESS' }] }, 'TEST001').state).toBe('unknown');
  expect(parse({ reg_details: [{ client_code: 'TEST001', reg_status: 'REG_FAILED', reg_remark: 'Invalid code' }] }, 'TEST001')).toMatchObject({ state: 'rejected', remark: 'Invalid code' });
  expect(() => parse({ reg_details: [{ client_code: 'OTHER', reg_id: '123', reg_status: 'REG_SUCCESS' }] }, 'TEST001')).toThrow('different client');
});
