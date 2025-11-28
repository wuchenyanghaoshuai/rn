import { http } from './http';
import { API_CONFIG } from '../constants/config';
import type {
  PointsInfo,
  PointsHistory,
  PaginatedResponse,
  ApiResponse,
} from '../types';

// 积分规则类型
interface PointsRule {
  id: number;
  name: string;
  description: string;
  points: number;
  type: string;
  daily_limit?: number;
}

// 积分等级类型
interface PointsLevel {
  level: number;
  name: string;
  min_points: number;
  max_points?: number;
  benefits?: string[];
}

// 积分 API 服务
export const pointsApi = {
  // 获取当前用户积分信息
  async getMyPoints(): Promise<ApiResponse<PointsInfo>> {
    return http.get<PointsInfo>(API_CONFIG.ENDPOINTS.POINTS.MY);
  },

  // 获取积分历史记录
  async getHistory(params?: { page?: number; size?: number; type?: string }): Promise<ApiResponse<PaginatedResponse<PointsHistory>>> {
    return http.get<PaginatedResponse<PointsHistory>>(API_CONFIG.ENDPOINTS.POINTS.HISTORY, params);
  },

  // 获取积分统计
  async getStats(): Promise<ApiResponse<{
    total_earned: number;
    total_spent: number;
    this_month_earned: number;
  }>> {
    return http.get(API_CONFIG.ENDPOINTS.POINTS.STATS);
  },

  // 获取积分等级列表
  async getLevels(): Promise<ApiResponse<PointsLevel[]>> {
    return http.get<PointsLevel[]>(API_CONFIG.ENDPOINTS.POINTS.LEVELS);
  },

  // 获取积分规则列表
  async getRules(): Promise<ApiResponse<PointsRule[]>> {
    return http.get<PointsRule[]>(API_CONFIG.ENDPOINTS.POINTS.RULES);
  },
};

export default pointsApi;
