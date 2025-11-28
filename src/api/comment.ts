import { http } from './http';
import { API_CONFIG } from '../constants/config';
import type {
  Comment,
  CommentCreateRequest,
  CommentUpdateRequest,
  CommentListParams,
  PaginatedResponse,
  ApiResponse,
} from '../types';

// 评论 API 服务
export const commentApi = {
  // 获取文章评论列表
  async getArticleComments(articleId: number, params?: { page?: number; size?: number }): Promise<ApiResponse<PaginatedResponse<Comment>>> {
    return http.get<PaginatedResponse<Comment>>(
      `${API_CONFIG.ENDPOINTS.COMMENT.ARTICLE_COMMENTS}/${articleId}/comments`,
      params
    );
  },

  // 创建评论
  async create(data: CommentCreateRequest): Promise<ApiResponse<Comment>> {
    return http.post<Comment>(API_CONFIG.ENDPOINTS.COMMENT.CREATE, data);
  },

  // 更新评论
  async update(id: number, data: CommentUpdateRequest): Promise<ApiResponse<Comment>> {
    return http.put<Comment>(`${API_CONFIG.ENDPOINTS.COMMENT.UPDATE}/${id}`, data);
  },

  // 删除评论
  async delete(id: number): Promise<ApiResponse<null>> {
    return http.delete<null>(`${API_CONFIG.ENDPOINTS.COMMENT.DELETE}/${id}`);
  },

  // 点赞评论
  async like(id: number): Promise<ApiResponse<null>> {
    return http.post<null>(`${API_CONFIG.ENDPOINTS.COMMENT.LIKE}/${id}/like`);
  },

  // 取消点赞评论
  async unlike(id: number): Promise<ApiResponse<null>> {
    return http.delete<null>(`${API_CONFIG.ENDPOINTS.COMMENT.UNLIKE}/${id}/like`);
  },

  // 获取评论回复列表
  async getReplies(commentId: number, params?: { page?: number; size?: number }): Promise<ApiResponse<PaginatedResponse<Comment>>> {
    return http.get<PaginatedResponse<Comment>>(
      `${API_CONFIG.ENDPOINTS.COMMENT.REPLIES}/${commentId}/replies`,
      params
    );
  },
};

export default commentApi;
