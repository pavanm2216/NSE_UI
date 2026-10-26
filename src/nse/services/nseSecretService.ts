import { nseRequest } from './nseApi';

export async function changeNSEApiSecret(currentPassword: string, newPassword: string): Promise<string> {
  if (!currentPassword.trim()) throw new Error('Current password is required');
  if (!newPassword.trim() || newPassword.length < 8) throw new Error('New password must be at least 8 characters');
  if (currentPassword === newPassword) throw new Error('New password must differ from the current password');
  const response = await nseRequest<{ status?: string; message?: string; remark?: string }>(
    '/auth/change-password',
    { current_password: currentPassword, new_password: newPassword },
  );
  return response?.message || response?.remark || 'Password changed successfully';
}
