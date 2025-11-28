import { http } from './http';
import { API_CONFIG } from '../constants/config';
import type {
  User,
  UserUpdateRequest,
  ChangePasswordRequest,
  UpdateEmailRequest,
  FollowStats,
  FollowListResponse,
  ApiResponse,
} from '../types';

// 用户 API 服务
export const userApi = {
  // 获取当前用户信息
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await http.get<{ user: User } | User>(API_CONFIG.ENDPOINTS.USER.PROFILE);
    const user = (response.data as any).user || response.data;
    return { ...response, data: user };
  },

  // 更新用户信息
  async updateProfile(data: UserUpdateRequest): Promise<ApiResponse<User>> {
    const response = await http.put<{ user: User } | User>(API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE, data);
    const user = (response.data as any).user || response.data;
    return { ...response, data: user };
  },

  // 修改密码
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<null>> {
    return http.put<null>(API_CONFIG.ENDPOINTS.USER.CHANGE_PASSWORD, data);
  },

  // 修改邮箱
  async updateEmail(data: UpdateEmailRequest): Promise<ApiResponse<null>> {
    return http.put<null>(API_CONFIG.ENDPOINTS.USER.UPDATE_EMAIL, data);
  },

  // 获取用户公开信息
  async getPublicInfo(userId: number): Promise<ApiResponse<User>> {
    return http.get<User>(`${API_CONFIG.ENDPOINTS.USER.PUBLIC_INFO}/${userId}`);
  },

  // 通过用户名获取用户信息
  async getByUsername(username: string): Promise<ApiResponse<User>> {
    return http.get<User>(`${API_CONFIG.ENDPOINTS.USER.BY_USERNAME}/${username}`);
  },

  // 检查昵称是否可用
  async checkNickname(nickname: string): Promise<ApiResponse<{ available: boolean }>> {
    return http.get<{ available: boolean }>(API_CONFIG.ENDPOINTS.USER.CHECK_NICKNAME, { nickname });
  },

  // 生成随机昵称
  async generateNickname(): Promise<ApiResponse<{ nickname: string }>> {
    return http.get<{ nickname: string }>(API_CONFIG.ENDPOINTS.USER.GENERATE_NICKNAME);
  },

  // 获取用户关注统计
  async getFollowStats(userId: number): Promise<ApiResponse<FollowStats>> {
    return http.get<FollowStats>(`${API_CONFIG.ENDPOINTS.FOLLOW.USER_STATS}/${userId}/follow-stats`);
  },

  // 获取用户关注列表
  async getFollowing(userId: number, params?: { page?: number; size?: number }): Promise<ApiResponse<FollowListResponse>> {
    return http.get<FollowListResponse>(`${API_CONFIG.ENDPOINTS.FOLLOW.USER_FOLLOWING}/${userId}/following`, params);
  },

  // 获取用户粉丝列表
  async getFollowers(userId: number, params?: { page?: number; size?: number }): Promise<ApiResponse<FollowListResponse>> {
    return http.get<FollowListResponse>(`${API_CONFIG.ENDPOINTS.FOLLOW.USER_FOLLOWERS}/${userId}/followers`, params);
  },

  // 关注用户
  async follow(userId: number): Promise<ApiResponse<null>> {
    return http.post<null>(`${API_CONFIG.ENDPOINTS.FOLLOW.FOLLOW_USER}/${userId}/follow`);
  },

  // 取消关注
  async unfollow(userId: number): Promise<ApiResponse<null>> {
    return http.delete<null>(`${API_CONFIG.ENDPOINTS.FOLLOW.UNFOLLOW_USER}/${userId}/follow`);
  },

  // 检查关注状态
  async checkFollowStatus(userId: number): Promise<ApiResponse<{ is_following: boolean; is_follower: boolean }>> {
    return http.get<{ is_following: boolean; is_follower: boolean }>(
      `${API_CONFIG.ENDPOINTS.FOLLOW.FOLLOW_STATUS}/${userId}/follow-status`
    );
  },
};

export default userApi;
