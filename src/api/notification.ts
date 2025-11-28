import { http } from './http';
import { API_CONFIG } from '../constants/config';
import type {
  Notification,
  NotificationStats,
  PaginatedResponse,
  ApiResponse,
} from '../types';

// 通知 API 服务
export const notificationApi = {
  // 获取通知列表
  async getList(params?: { page?: number; size?: number; type?: string }): Promise<ApiResponse<PaginatedResponse<Notification>>> {
    return http.get<PaginatedResponse<Notification>>(API_CONFIG.ENDPOINTS.NOTIFICATION.LIST, params);
  },

  // 获取通知统计
  async getStats(): Promise<ApiResponse<NotificationStats>> {
    return http.get<NotificationStats>(API_CONFIG.ENDPOINTS.NOTIFICATION.STATS);
  },

  // 按类型获取通知统计
  async getStatsByType(): Promise<ApiResponse<Record<string, number>>> {
    return http.get<Record<string, number>>(API_CONFIG.ENDPOINTS.NOTIFICATION.STATS_BY_TYPE);
  },

  // 标记单条通知为已读
  async markAsRead(id: number): Promise<ApiResponse<null>> {
    return http.put<null>(`${API_CONFIG.ENDPOINTS.NOTIFICATION.MARK_ONE_READ}/${id}/read`);
  },

  // 批量标记为已读
  async batchMarkAsRead(ids: number[]): Promise<ApiResponse<null>> {
    return http.put<null>(API_CONFIG.ENDPOINTS.NOTIFICATION.BATCH_MARK_READ, { ids });
  },

  // 标记所有通知为已读
  async markAllAsRead(): Promise<ApiResponse<null>> {
    return http.put<null>(API_CONFIG.ENDPOINTS.NOTIFICATION.MARK_ALL_READ);
  },

  // 删除通知
  async delete(id: number): Promise<ApiResponse<null>> {
    return http.delete<null>(`${API_CONFIG.ENDPOINTS.NOTIFICATION.DELETE}/${id}`);
  },

  // 删除所有通知
  async deleteAll(): Promise<ApiResponse<null>> {
    return http.delete<null>(API_CONFIG.ENDPOINTS.NOTIFICATION.DELETE_ALL);
  },
};

export default notificationApi;
