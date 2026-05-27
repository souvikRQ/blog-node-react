import { api } from '@/lib/api-client.js';
import { ChangePasswordRequest } from '@blog/shared-types';

export const changePassword = async (data: ChangePasswordRequest): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/auth/change-password', data);
  return response.data;
};
