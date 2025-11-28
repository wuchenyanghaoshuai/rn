import { http } from './http';
import { API_CONFIG } from '../constants/config';
import type {
  Article,
  HotKeyword,
  PaginatedResponse,
  ApiResponse,
} from '../types';

// 搜索 API 服务
export const searchApi = {
  // 搜索
  async search(params: {
    keyword: string;
    type?: 'article' | 'moment' | 'user';
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PaginatedResponse<Article>>> {
    return http.get<PaginatedResponse<Article>>(API_CONFIG.ENDPOINTS.SEARCH.SEARCH, params);
  },

  // 获取热门搜索关键词
  async getHotKeywords(limit?: number): Promise<ApiResponse<HotKeyword[]>> {
    return http.get<HotKeyword[]>(API_CONFIG.ENDPOINTS.SEARCH.HOT_KEYWORDS, { limit });
  },

  // 获取搜索建议
  async getSuggestions(keyword: string): Promise<ApiResponse<string[]>> {
    return http.get<string[]>(API_CONFIG.ENDPOINTS.SEARCH.SUGGESTIONS, { keyword });
  },
};

export default searchApi;
