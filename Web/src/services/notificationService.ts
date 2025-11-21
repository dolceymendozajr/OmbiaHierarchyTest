import { api } from './api';
import { Notification } from '@/types';

export const notificationService = {
  getUserNotifications: async (userId: string): Promise<Notification[]> => {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },
};
