import { create } from 'zustand';
import { notificationApi } from '../api/notification';
import type { Notification, NotificationStats } from '../types';

interface NotificationState {
  // 状态
  notifications: Notification[];
  stats: NotificationStats | null;
  isLoading: boolean;
  page: number;
  hasMore: boolean;

  // 方法
  fetchNotifications: (refresh?: boolean) => Promise<void>;
  fetchStats: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  // 初始状态
  notifications: [],
  stats: null,
  isLoading: false,
  page: 1,
  hasMore: true,

  // 获取通知列表
  fetchNotifications: async (refresh = false) => {
    const { isLoading, page, notifications } = get();

    if (isLoading) return;

    const currentPage = refresh ? 1 : page;
    set({ isLoading: true });

    try {
      const response = await notificationApi.getList({ page: currentPage, size: 20 });
      const newNotifications = response.data.items || [];
      const hasMore = currentPage < response.data.total_pages;

      set({
        notifications: refresh ? newNotifications : [...notifications, ...newNotifications],
        page: currentPage + 1,
        hasMore,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({ isLoading: false });
    }
  },

  // 获取通知统计
  fetchStats: async () => {
    try {
      const response = await notificationApi.getStats();
      set({ stats: response.data });
    } catch (error) {
      console.error('Failed to fetch notification stats:', error);
    }
  },

  // 标记单条为已读
  markAsRead: async (id: number) => {
    try {
      await notificationApi.markAsRead(id);

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        ),
        stats: state.stats
          ? { ...state.stats, unread: Math.max(0, state.stats.unread - 1) }
          : null,
      }));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  // 标记所有为已读
  markAllAsRead: async () => {
    try {
      await notificationApi.markAllAsRead();

      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
        stats: state.stats ? { ...state.stats, unread: 0 } : null,
      }));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  },

  // 删除通知
  deleteNotification: async (id: number) => {
    try {
      await notificationApi.delete(id);

      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
        stats: state.stats
          ? {
              ...state.stats,
              total: state.stats.total - 1,
              unread: state.notifications.find((n) => n.id === id)?.is_read
                ? state.stats.unread
                : Math.max(0, state.stats.unread - 1),
            }
          : null,
      }));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  },

  // 清空状态
  clearAll: () => {
    set({
      notifications: [],
      stats: null,
      page: 1,
      hasMore: true,
    });
  },
}));

export default useNotificationStore;
