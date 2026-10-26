import { nseApi, nseRequest } from './nseApi';
import type { ResendCommResponse } from '../types/nse';

export const NSE_LINK_PRODUCTS = ['PUR', 'RED', 'SWH_REG', 'SIP_REG', 'XSIP_REG', 'XSIP_CAN', 'STP_REG', 'STP_CAN', 'SWP_REG', 'SWP_CAN', 'CL_ACT', 'SIP_CAN', 'MANDATE_AUTH', 'SIP_TOPUP'] as const;
export type NSELinkProduct = typeof NSE_LINK_PRODUCTS[number];
export type NSEResendProduct = NSELinkProduct | 'SIP_STEPUP';
export async function resendNSECommunication(productType: NSEResendProduct, productRefId: string) {
  const ref = productRefId.trim();
  if (![...NSE_LINK_PRODUCTS, 'SIP_STEPUP'].includes(productType)) throw new Error('Unsupported Mutual funds communication product');
  if (!ref || ref.length > 15 || ref.toLowerCase() === 'string' || (productType !== 'CL_ACT' && (!/^\d+$/.test(ref) || !/[1-9]/.test(ref)))) throw new Error('Enter a valid product reference of up to 15 characters');
  const result = await nseRequest<ResendCommResponse>('/communication/resend', { productType, productRefId: ref });
  if (result?.error_remark?.trim()) throw new Error(result.error_remark.trim());
  if (result?.response_status !== 'S') throw new Error('Mutual funds did not confirm the resend. Check with Mutual funds before sending again.');
  if (result.productType !== productType || result.productRefId?.trim() !== ref) throw new Error('Mutual funds returned a different product reference; resend is not confirmed');
}
export async function getNSEHolderLinks(productType: NSELinkProduct, productRefId: string) {
  const ref = productRefId.trim();
  if (!NSE_LINK_PRODUCTS.includes(productType)) throw new Error('Unsupported Mutual funds link product');
  if (!ref || ref.length > 15 || ref.toLowerCase() === 'string' || (productType !== 'CL_ACT' && !/^\d+$/.test(ref))) throw new Error('Enter a valid product reference, up to 15 characters; order and registration IDs must be numeric');
  const result = await nseApi.communicationLink({ productType, productRefId: ref });
  if (result.errorMessage?.trim()) throw new Error(result.errorMessage.trim());
  if (result.productType !== productType || result.productRefId?.trim() !== ref) throw new Error('Mutual funds returned links for a different product reference');
  const links = [result.firstHolderLink, result.secondHolderLink, result.thirdHolderLink].flatMap((value, index) => {
    if (!value?.trim()) return [];
    let url: URL;
    try { url = new URL(value.trim()); } catch { throw new Error('Mutual funds returned an invalid holder link'); }
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Mutual funds returned an unsafe holder link');
    return [{ holder: ['First holder', 'Second holder', 'Third holder'][index], url: url.href }];
  });
  if (!links.length) throw new Error('Mutual funds has no authorization link available for this reference');
  return links;
}
