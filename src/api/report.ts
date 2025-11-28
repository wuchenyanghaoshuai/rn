import { http } from './http';
import { API_CONFIG } from '../constants/config';
import type { ApiResponse } from '../types';

export interface CreateReportPayload {
  target_type: 'article' | 'moment' | 'comment';
  target_id: number;
  reason: string;
  description?: string;
  evidence?: string;
}

export const reportApi = {
  // 创建举报
  async create(data: CreateReportPayload): Promise<ApiResponse<null>> {
    return http.post<null>(API_CONFIG.ENDPOINTS.REPORT.CREATE, data);
  },

  // 获取我的举报
  async getMyReports(params?: { page?: number; size?: number }): Promise<ApiResponse<any>> {
    return http.get<any>(API_CONFIG.ENDPOINTS.REPORT.MY, params);
  },
};

export default reportApi;
