import { nseRequest } from './nseApi';
export function validateNftImage(reference: string, file: File) {
  if (!reference.trim() || reference.trim().length > 100 || /[\\/]/.test(reference) || reference !== reference.trim()) throw new Error('Enter the exact NFT image reference filename, up to 100 characters');
  if (file.name !== reference) throw new Error('The document filename must exactly match the IMG_REF_NO in the NFT request');
  if (!/\.tiff?$/i.test(file.name)) throw new Error('Choose a TIFF document. Other NFT file formats are not documented in the supplied rules.');
  if (!file.size || file.size > 5 * 1024 * 1024) throw new Error('Choose a nonempty document within the portal limit of 5 MB');
}
export async function buildNftImage(reference: string, file: File) {
  validateNftImage(reference, file);
  const url = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('Unable to read NFT document')); reader.readAsDataURL(file); });
  const base64 = url.slice(url.indexOf(',') + 1), bytes = atob(base64).slice(0, 4);
  if (!bytes.startsWith('II\x2a\x00') && !bytes.startsWith('MM\x00\x2a')) throw new Error('Document content does not match TIFF format');
  return { img_name: reference, img_data: base64 };
}
export async function uploadNftImage(reference: string, file: File) {
  const body = await buildNftImage(reference, file);
  const response = await nseRequest<{ img_name?: string; message?: string; status?: string }>('/nft/image-upload', body);
  if (response?.status !== 'SUCCESS') throw new Error(response?.message || 'Mutual funds did not confirm the NFT image upload. Check before retrying.');
  if (response.img_name !== reference) throw new Error('Mutual funds returned a different image reference. Upload mapping is unconfirmed.');
  return response.message || 'Mutual funds confirmed the NFT image upload';
}
