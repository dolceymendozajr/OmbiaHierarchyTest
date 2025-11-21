import { api } from './api';
import { HierarchyNode, CreateHierarchyDto, EffectivePermission } from '@/types';

export const hierarchyService = {
  getAll: async (): Promise<HierarchyNode[]> => {
    const response = await api.get('/hierarchy');
    return response.data;
  },

  getById: async (id: string): Promise<HierarchyNode> => {
    const response = await api.get(`/hierarchy/${id}`);
    return response.data;
  },

  create: async (data: CreateHierarchyDto): Promise<HierarchyNode> => {
    const response = await api.post('/hierarchy', data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/hierarchy/${id}`);
  },

  getEffectivePermissions: async (nodeId: string): Promise<EffectivePermission[]> => {
    const response = await api.get(`/permissions/effective/${nodeId}`);
    return response.data;
  },
};
