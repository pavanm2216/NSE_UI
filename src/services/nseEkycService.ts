import { nseRequest } from './nseApi';
export interface NSEEkycInput { amcCode: string; panNo: string; mobileNo: string; invEmail: string; }
export function buildNSEEkyc(input: NSEEkycInput) {
  const body = { amcCode: input.amcCode.trim(), panNo: input.panNo.trim().toUpperCase(), mobileNo: input.mobileNo.trim(), invEmail: input.invEmail.trim() };
  if (!body.amcCode || !/^[A-Za-z0-9_-]+$/.test(body.amcCode) || body.amcCode.toLowerCase() === 'string') throw new Error('Enter an RTA AMC code');
  if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(body.panNo)) throw new Error('Enter a valid PAN');
  if (!/^[6-9]\d{9}$/.test(body.mobileNo)) throw new Error('Enter a valid 10-digit mobile number');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.invEmail)) throw new Error('Enter a valid email address');
  return body;
}
export async function registerNSEEkyc(input: NSEEkycInput) {
  const response = await nseRequest<{ link?: string; message?: string; success?: boolean }>('/ekyc/register', buildNSEEkyc(input));
  if (response?.success === false) throw new Error(response.message || 'Mutual funds rejected eKYC registration');
  let url: URL;
  try { url = new URL(response?.link || ''); } catch { throw new Error('Mutual funds returned no usable eKYC link. Registration is unconfirmed.'); }
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Mutual funds returned an unusable eKYC link');
  return { link: url.href, message: response.message || 'Mutual funds received the eKYC registration request' };
}
