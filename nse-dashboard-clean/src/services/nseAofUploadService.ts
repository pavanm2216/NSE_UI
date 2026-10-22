import { nseRequest } from './nseApi';

// Portal limit; NSE's documentation does not specify a maximum image size.
export const AOF_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export async function uploadNSEAofImage(clientCode: string, documentType: 'NRM' | 'RIA', file: File) {
  if (!clientCode.trim() || clientCode.trim().length > 10 || clientCode.trim().toLowerCase() === 'string') throw new Error('A valid client code of up to 10 characters is required');
  if (!['NRM', 'RIA'].includes(documentType)) throw new Error('Select NRM or RIA document type');
  if (file.name.length > 40 || !/\.jpg$/i.test(file.name)) throw new Error('Choose a .jpg file with a filename of up to 40 characters');
  if (!file.size || file.size > AOF_IMAGE_MAX_BYTES) throw new Error('Choose a nonempty image up to the portal limit of 5 MB');
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Unable to read the selected image'));
    reader.readAsDataURL(file);
  });
  const fileData = dataUrl.slice(dataUrl.indexOf(',') + 1);
  // JPEG signature: do not accept a renamed document as an image.
  if (!fileData.startsWith('/9j/')) throw new Error('The selected file must contain a JPEG image');
  const response = await nseRequest<{ status?: string; message?: string }>('/aof/image-upload', { client_code: clientCode.trim(), document_type: documentType, file_name: file.name, file_data: fileData });
  if (String(response?.status) !== '100') throw new Error(response?.message || 'Mutual funds did not confirm image upload');
  return response.message || 'AOF image uploaded successfully';
}
