import { http } from './http';
import { API_CONFIG } from '../constants/config';
import type {
  Moment,
  MomentCreateRequest,
  MomentListParams,
  MomentReply,
  HotTag,
  PaginatedResponse,
  ApiResponse,
} from '../types';

// 广场/瞬间 API 服务
export const momentApi = {
  // 获取瞬间列表
  async getList(params?: MomentListParams): Promise<ApiResponse<PaginatedResponse<Moment>>> {
    return http.get<PaginatedResponse<Moment>>(API_CONFIG.ENDPOINTS.MOMENT.LIST, params);
  },

  // 获取瞬间详情
  async getDetail(id: number): Promise<ApiResponse<Moment>> {
    return http.get<Moment>(`${API_CONFIG.ENDPOINTS.MOMENT.DETAIL}/${id}`);
  },

  // 创建瞬间
  async create(data: MomentCreateRequest): Promise<ApiResponse<Moment>> {
    return http.post<Moment>(API_CONFIG.ENDPOINTS.MOMENT.CREATE, data);
  },

  // 删除瞬间
  async delete(id: number): Promise<ApiResponse<null>> {
    return http.delete<null>(`${API_CONFIG.ENDPOINTS.MOMENT.DELETE}/${id}`);
  },

  // 点赞瞬间
  async like(id: number): Promise<ApiResponse<null>> {
    return http.post<null>(`${API_CONFIG.ENDPOINTS.MOMENT.LIKE}/${id}/like`);
  },

  // 取消点赞瞬间
  async unlike(id: number): Promise<ApiResponse<null>> {
    return http.delete<null>(`${API_CONFIG.ENDPOINTS.MOMENT.UNLIKE}/${id}/like`);
  },

  // 获取热门标签
  async getHotTags(limit?: number): Promise<ApiResponse<HotTag[]>> {
    return http.get<HotTag[]>(API_CONFIG.ENDPOINTS.MOMENT.HOT_TAGS, { limit });
  },

  // 获取瞬间回复列表
  async getReplies(momentId: number, params?: { page?: number; size?: number }): Promise<ApiResponse<PaginatedResponse<MomentReply>>> {
    return http.get<PaginatedResponse<MomentReply>>(
      `${API_CONFIG.ENDPOINTS.MOMENT.REPLIES}/${momentId}/replies`,
      params
    );
  },

  // 创建瞬间回复
  async createReply(momentId: number, data: { content: string; parent_reply_id?: number }): Promise<ApiResponse<MomentReply>> {
    return http.post<MomentReply>(
      `${API_CONFIG.ENDPOINTS.MOMENT.CREATE_REPLY}/${momentId}/replies`,
      data
    );
  },

  // 删除瞬间回复
  async deleteReply(momentId: number, replyId: number): Promise<ApiResponse<null>> {
    return http.delete<null>(
      `${API_CONFIG.ENDPOINTS.MOMENT.DELETE_REPLY}/${momentId}/replies/${replyId}`
    );
  },

  // 按标签获取瞬间
  async getByTag(tag: string, params?: MomentListParams): Promise<ApiResponse<PaginatedResponse<Moment>>> {
    return http.get<PaginatedResponse<Moment>>(API_CONFIG.ENDPOINTS.MOMENT.LIST, {
      ...params,
      tag,
    });
  },
};

export default momentApi;
