import { http } from './http';
import { API_CONFIG } from '../constants/config';
import type {
  Category,
  ApiResponse,
} from '../types';

// 分类 API 服务
export const categoryApi = {
  // 获取分类列表
  async getList(): Promise<ApiResponse<Category[]>> {
    return http.get<Category[]>(API_CONFIG.ENDPOINTS.CATEGORY.LIST);
  },

  // 获取所有启用的分类
  async getAll(): Promise<ApiResponse<Category[]>> {
    return http.get<Category[]>(API_CONFIG.ENDPOINTS.CATEGORY.ALL, { all: true });
  },

  // 获取带文章数量的分类
  async getWithCount(): Promise<ApiResponse<Category[]>> {
    return http.get<Category[]>(API_CONFIG.ENDPOINTS.CATEGORY.WITH_COUNT);
  },

  // 获取分类详情
  async getDetail(id: number): Promise<ApiResponse<Category>> {
    return http.get<Category>(`${API_CONFIG.ENDPOINTS.CATEGORY.DETAIL}/${id}`);
  },

  // 通过 slug 获取分类
  async getBySlug(slug: string): Promise<ApiResponse<Category>> {
    return http.get<Category>(`${API_CONFIG.ENDPOINTS.CATEGORY.BY_SLUG}/${slug}`);
  },
};

export default categoryApi;
