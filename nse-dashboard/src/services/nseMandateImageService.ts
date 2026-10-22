import { nseRequest } from './nseApi';

// Portal limit; NSE's documentation does not specify a maximum image size.
export const MANDATE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export async function uploadNSEMandateImage(clientCode: string, mandateId: string, file: File) {
  if (!clientCode.trim() || clientCode.trim().length > 10 || clientCode.trim().toLowerCase() === 'string') throw new Error('A valid client code of up to 10 characters is required');
  if (!/^\d{1,15}$/.test(mandateId) || !/[1-9]/.test(mandateId)) throw new Error('A confirmed numeric mandate ID of up to 15 digits is required');
  if (file.name.length > 30 || !/\.jpg$/i.test(file.name)) throw new Error('Choose a .jpg file with a filename of up to 30 characters');
  if (!file.size || file.size > MANDATE_IMAGE_MAX_BYTES) throw new Error('Choose a nonempty image up to the portal limit of 5 MB');
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Unable to read the selected image'));
    reader.readAsDataURL(file);
  });
  const fileData = dataUrl.slice(dataUrl.indexOf(',') + 1);
  // JPEG signature: do not accept a renamed document as an image.
  if (!fileData.startsWith('/9j/')) throw new Error('The selected file must contain a JPEG image');
  const response = await nseRequest<{ status?: string; message?: string }>('/mandate/image-upload', { client_code: clientCode.trim(), mandate_id: mandateId, file_name: file.name, file_data: fileData });
  if (String(response?.status) !== '100') throw new Error(response?.message || 'Mutual funds did not confirm image upload');
  return response.message || 'Mandate uploaded successfully';
}
