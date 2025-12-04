import { http } from './http';
import { API_CONFIG } from '../constants/config';
import type {
  Article,
  ArticleCreateRequest,
  ArticleUpdateRequest,
  ArticleListParams,
  PaginatedResponse,
  ApiResponse,
} from '../types';

// 文章 API 服务
export const articleApi = {
  // 获取文章列表
  async getList(params?: ArticleListParams): Promise<ApiResponse<PaginatedResponse<Article>>> {
    return http.get<PaginatedResponse<Article>>(API_CONFIG.ENDPOINTS.ARTICLE.LIST, params);
  },

  // 获取文章详情
  async getDetail(id: number): Promise<ApiResponse<Article>> {
    return http.get<Article>(`${API_CONFIG.ENDPOINTS.ARTICLE.DETAIL}/${id}`);
  },

  // 创建文章
  async create(data: ArticleCreateRequest): Promise<ApiResponse<Article>> {
    return http.post<Article>(API_CONFIG.ENDPOINTS.ARTICLE.CREATE, data);
  },

  // 更新文章
  async update(id: number, data: ArticleUpdateRequest): Promise<ApiResponse<Article>> {
    return http.put<Article>(`${API_CONFIG.ENDPOINTS.ARTICLE.UPDATE}/${id}`, data);
  },

  // 删除文章
  async delete(id: number): Promise<ApiResponse<null>> {
    return http.delete<null>(`${API_CONFIG.ENDPOINTS.ARTICLE.DELETE}/${id}`);
  },

  // 搜索文章
  async search(keyword: string, params?: { page?: number; size?: number }): Promise<ApiResponse<PaginatedResponse<Article>>> {
    return http.get<PaginatedResponse<Article>>(API_CONFIG.ENDPOINTS.ARTICLE.SEARCH, {
      keyword,
      ...params,
    });
  },

  // 获取热门文章
  async getHot(
    limit?: number
  ): Promise<ApiResponse<{ articles: Article[]; period?: string; limit?: number }>> {
    return http.get<{ articles: Article[]; period?: string; limit?: number }>(
      API_CONFIG.ENDPOINTS.ARTICLE.HOT,
      { limit }
    );
  },

  // 点赞文章
  async like(id: number): Promise<ApiResponse<null>> {
    return http.post<null>(`${API_CONFIG.ENDPOINTS.ARTICLE.LIKE}/${id}/like`);
  },

  // 取消点赞
  async unlike(id: number): Promise<ApiResponse<null>> {
    return http.delete<null>(`${API_CONFIG.ENDPOINTS.ARTICLE.UNLIKE}/${id}/like`);
  },

  // 获取我的文章列表
  async getMyArticles(params?: ArticleListParams): Promise<ApiResponse<PaginatedResponse<Article>>> {
    return http.get<PaginatedResponse<Article>>(API_CONFIG.ENDPOINTS.ARTICLE.MY, {
      ...params,
      scope: 'me',
    });
  },

  // 获取用户的文章列表
  async getUserArticles(userId: number, params?: ArticleListParams): Promise<ApiResponse<PaginatedResponse<Article>>> {
    return http.get<PaginatedResponse<Article>>(API_CONFIG.ENDPOINTS.ARTICLE.LIST, {
      ...params,
      author_id: userId,
    });
  },

  // 获取分类文章列表
  async getByCategory(categoryId: number, params?: ArticleListParams): Promise<ApiResponse<PaginatedResponse<Article>>> {
    return http.get<PaginatedResponse<Article>>(`${API_CONFIG.ENDPOINTS.CATEGORY.ARTICLES}/${categoryId}/articles`, params);
  },
};

export default articleApi;
