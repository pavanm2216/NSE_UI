import { afterEach, expect, it, vi } from 'vitest';
import { nseApi } from './nseApi';
import { linkSipMandate, loadApprovedSipMandates } from './nseSipMappingService';
afterEach(() => vi.restoreAllMocks());
const mandate = { id: '456', umrn: 'TESTUMRN123', bank: 'Test Bank', amount: '10000' };
const row = { mandateId: mandate.id, umrnNo: mandate.umrn, bankName: mandate.bank, amount: mandate.amount, clientCode: 'TEST001', status: 'APPROVED' };
it('only offers explicitly approved mandates owned by the SIP client', async () => {
  vi.spyOn(nseApi, 'mandateStatus').mockResolvedValue({ response_status: 'S', report_data: [row, { ...row, status: 'PENDING' }, { ...row, clientCode: 'OTHER' }, { ...row, umrnNo: '' }] });
  expect(await loadApprovedSipMandates('TEST001')).toEqual([mandate]);
});
it('rechecks approval before submitting the actual UMRN and requires status 100', async () => {
  const report = vi.spyOn(nseApi, 'mandateStatus').mockResolvedValue({ response_status: 'S', report_data: [row] });
  const map = vi.spyOn(nseApi, 'mapSipMandate').mockResolvedValue({ sip_reg_id: '123', umrn: mandate.umrn, status: '100', message: '' });
  await expect(linkSipMandate('123', 'TEST001', mandate, 'request by investor')).resolves.toContain('confirmed');
  expect(report).toHaveBeenCalledWith({ client_code: 'TEST001' });
  expect(map).toHaveBeenCalledWith({ sip_reg_id: '123', umrn: mandate.umrn, remark: 'request by investor' });
});
it('blocks changed approval and preserves a failed mapping response', async () => {
  const report = vi.spyOn(nseApi, 'mandateStatus').mockResolvedValue({ response_status: 'S', report_data: [{ ...row, status: 'PENDING' }] });
  const map = vi.spyOn(nseApi, 'mapSipMandate');
  await expect(linkSipMandate('123', 'TEST001', mandate, '')).rejects.toThrow('no longer confirmed approved');
  expect(map).not.toHaveBeenCalled();
  report.mockResolvedValue({ response_status: 'S', report_data: [row] });
  map.mockResolvedValue({ status: '101', message: 'Mapping failed' });
  await expect(linkSipMandate('123', 'TEST001', mandate, '')).rejects.toThrow('Mapping failed');
});
