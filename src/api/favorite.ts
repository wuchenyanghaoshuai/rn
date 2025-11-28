import { http } from './http';
import { API_CONFIG } from '../constants/config';
import type {
  Favorite,
  Article,
  PaginatedResponse,
  ApiResponse,
} from '../types';

// 收藏 API 服务
export const favoriteApi = {
  // 获取我的收藏列表
  async getMyFavorites(params?: { page?: number; size?: number }): Promise<ApiResponse<PaginatedResponse<Favorite>>> {
    return http.get<PaginatedResponse<Favorite>>(API_CONFIG.ENDPOINTS.FAVORITE.MY, params);
  },

  // 收藏文章
  async favoriteArticle(articleId: number): Promise<ApiResponse<null>> {
    return http.post<null>(`${API_CONFIG.ENDPOINTS.FAVORITE.FAVORITE_ARTICLE}/${articleId}/favorite`);
  },

  // 取消收藏文章
  async unfavoriteArticle(articleId: number): Promise<ApiResponse<null>> {
    return http.delete<null>(`${API_CONFIG.ENDPOINTS.FAVORITE.UNFAVORITE_ARTICLE}/${articleId}/favorite`);
  },

  // 切换收藏状态
  async toggle(articleId: number): Promise<ApiResponse<{ is_favorited: boolean }>> {
    return http.post<{ is_favorited: boolean }>(API_CONFIG.ENDPOINTS.FAVORITE.TOGGLE, {
      article_id: articleId,
    });
  },

  // 获取文章收藏状态
  async getStatus(articleId: number): Promise<ApiResponse<{ is_favorited: boolean }>> {
    return http.get<{ is_favorited: boolean }>(
      `${API_CONFIG.ENDPOINTS.FAVORITE.ARTICLE_STATUS}/${articleId}/favorite-status`
    );
  },

  // 批量获取收藏状态
  async batchGetStatus(articleIds: number[]): Promise<ApiResponse<Record<number, boolean>>> {
    return http.post<Record<number, boolean>>(API_CONFIG.ENDPOINTS.FAVORITE.BATCH_STATUS, {
      article_ids: articleIds,
    });
  },

  // 获取热门收藏
  async getPopular(limit?: number): Promise<ApiResponse<Article[]>> {
    return http.get<Article[]>(API_CONFIG.ENDPOINTS.FAVORITE.POPULAR, { limit });
  },
};

export default favoriteApi;
