import { api } from './api';
import { Permission, CreatePermissionDto } from '@/types';

export const permissionService = {
  getAll: async (): Promise<Permission[]> => {
    const response = await api.get('/permissions');
    return response.data;
  },

  create: async (data: CreatePermissionDto): Promise<Permission> => {
    const response = await api.post('/permissions', data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/permissions/${id}`);
  },
};
