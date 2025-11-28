import { http, tokenStorage } from './http';
import { API_CONFIG } from '../constants/config';
import * as SecureStore from 'expo-secure-store';
import type {
  User,
  UserRegisterRequest,
  UserLoginRequest,
  UserLoginResponse,
  ApiResponse,
} from '../types';

// 认证 API 服务
export const authApi = {
  // 用户注册
  async register(data: UserRegisterRequest): Promise<ApiResponse<User>> {
    return http.post<User>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data);
  },

  // 用户登录
  async login(data: UserLoginRequest): Promise<ApiResponse<UserLoginResponse>> {
    const response = await http.post<UserLoginResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, data);

    // 保存 token
    if (response.data?.token) {
      await tokenStorage.setTokens(
        response.data.token,
        response.data.refresh_token || ''
      );
    }

    return response;
  },

  // 短信验证码登录
  async loginWithSms(phone: string, code: string): Promise<ApiResponse<{ user: User; token: string; refresh_token: string }>> {
    const response = await http.post<{ user: User; token: string; refresh_token: string }>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN_SMS,
      { phone, code }
    );

    // 保存 token
    if (response.data?.token) {
      await tokenStorage.setTokens(
        response.data.token,
        response.data.refresh_token || ''
      );
    }

    return response;
  },

  // 用户登出
  async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await http.post<null>(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
      return response;
    } finally {
      // 无论请求成功与否都清除本地 token
      await tokenStorage.clearTokens();
      await SecureStore.deleteItemAsync(API_CONFIG.AUTH.USER_INFO_KEY);
    }
  },

  // 刷新 token
  async refreshToken(): Promise<ApiResponse<{ token: string; refresh_token: string }>> {
    const refreshToken = await tokenStorage.getRefreshToken();
    const response = await http.post<{ token: string; refresh_token: string }>(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH,
      { refresh_token: refreshToken }
    );

    if (response.data?.token) {
      await tokenStorage.setTokens(
        response.data.token,
        response.data.refresh_token || refreshToken || ''
      );
    }

    return response;
  },

  // 获取当前用户信息
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await http.get<{ user: User } | User>(API_CONFIG.ENDPOINTS.USER.PROFILE);

    // 规范化响应
    const user = (response.data as any).user || response.data;
    return { ...response, data: user };
  },

  // 忘记密码
  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    return http.post<null>(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email_or_username: email,
    });
  },

  // 重置密码
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<null>> {
    return http.post<null>(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      new_password: newPassword,
    });
  },
};

// 认证工具函数
export const authUtils = {
  // 检查是否已登录
  async isLoggedIn(): Promise<boolean> {
    const token = await tokenStorage.getAccessToken();
    return !!token;
  },

  // 保存用户信息到本地
  async saveUser(user: User): Promise<void> {
    try {
      await SecureStore.setItemAsync(
        API_CONFIG.AUTH.USER_INFO_KEY,
        JSON.stringify(user)
      );
    } catch (error) {
      console.error('Failed to save user info:', error);
    }
  },

  // 获取本地存储的用户信息
  async getStoredUser(): Promise<User | null> {
    try {
      const userStr = await SecureStore.getItemAsync(API_CONFIG.AUTH.USER_INFO_KEY);
      if (userStr) {
        return JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Failed to get stored user:', error);
    }
    return null;
  },

  // 清除本地认证数据
  async clearAuthData(): Promise<void> {
    await tokenStorage.clearTokens();
    try {
      await SecureStore.deleteItemAsync(API_CONFIG.AUTH.USER_INFO_KEY);
    } catch (error) {
      console.error('Failed to clear user info:', error);
    }
  },
};

export default authApi;
