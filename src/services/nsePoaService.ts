import { nseRequest } from './nseApi';
export function validateNSEPoa(client: string, file: File) {
  if (!client.trim() || client.trim().length > 10 || client.trim().toLowerCase() === 'string') throw new Error('Enter a valid Mutual funds client code of up to 10 characters');
  if (file.name.length > 40 || !/\.(jpe?g|png|tiff?|pdf)$/i.test(file.name)) throw new Error('Choose JPG, JPEG, PNG, TIF, TIFF or PDF with a filename of up to 40 characters');
  if (!file.size || file.size > 5 * 1024 * 1024) throw new Error('Choose a nonempty document within the portal limit of 5 MB');
}
export async function uploadNSEPoa(client: string, file: File) {
  validateNSEPoa(client, file);
  const dataUrl = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('Unable to read the POA document')); reader.readAsDataURL(file); });
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1), extension = file.name.split('.').pop()!.toLowerCase();
  const bytes = atob(base64).slice(0, 8);
  const valid = extension === 'pdf' ? bytes.startsWith('%PDF-') : extension === 'png' ? base64.startsWith('iVBORw0KGgo') : ['jpg', 'jpeg'].includes(extension) ? base64.startsWith('/9j/') : bytes.startsWith('II\x2a\x00') || bytes.startsWith('MM\x00\x2a');
  if (!valid) throw new Error('Document content does not match its filename format');
  const response = await nseRequest<{ status?: string; message?: string }>('/poa/upload', { client_code: client.trim(), file_name: file.name, file_data: base64 });
  if (String(response?.status) !== '100') throw new Error(response?.message || 'Mutual funds did not confirm POA upload');
  return response.message || 'Mutual funds confirmed POA upload';
}
