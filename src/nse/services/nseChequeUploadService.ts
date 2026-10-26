import { nseRequest } from './nseApi';
export interface NSEChequeBank { client: string; account: string; ifsc: string; type: string; }
export function validateNSEChequeBank(bank: NSEChequeBank) {
  if (!bank.client.trim() || bank.client.trim().length > 10 || bank.client.trim().toLowerCase() === 'string') throw new Error('Enter a valid client code of up to 10 characters');
  if (!/^\d{1,25}$/.test(bank.account.trim())) throw new Error('Account number must contain up to 25 digits');
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bank.ifsc.trim().toUpperCase())) throw new Error('Enter a valid 11-character IFSC');
  if (!['SB', 'CB', 'NE', 'NO'].includes(bank.type)) throw new Error('Select a documented bank account type');
}
export function validateNSEChequeFile(file: File) {
  if (file.name.length > 40 || !/\.png$/i.test(file.name)) throw new Error('Choose a .png file with a filename of up to 40 characters');
  if (!file.size || file.size > 5 * 1024 * 1024) throw new Error('Choose a nonempty image within the portal limit of 5 MB');
}
export async function uploadNSECheque(bank: NSEChequeBank, file: File) {
  validateNSEChequeBank(bank); validateNSEChequeFile(file);
  const dataUrl = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('Unable to read the cheque image')); reader.readAsDataURL(file); });
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
  if (!base64.startsWith('iVBORw0KGgo')) throw new Error('The selected file must contain a PNG image');
  const response = await nseRequest<{ status?: string; message?: string }>('/cancel-cheque/upload', { file_name: file.name, client_code: bank.client.trim(), account_no: bank.account.trim(), ifsc: bank.ifsc.trim().toUpperCase(), account_type: bank.type, file_data: base64 });
  if (String(response?.status) !== '100') throw new Error(response?.message || 'Mutual funds did not confirm cheque upload');
  return response.message || 'Mutual funds confirmed cheque upload';
}
