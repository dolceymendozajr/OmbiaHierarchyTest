import { api } from './api';
import { User, CreateUserDto, UserPermission } from '@/types';

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (data: CreateUserDto): Promise<User> => {
    const response = await api.post('/users', data);
    return response.data;
  },

  getUserPermissions: async (userId: string): Promise<UserPermission[]> => {
    const response = await api.get(`/users/${userId}/permissions`);
    return response.data;
  },
};
