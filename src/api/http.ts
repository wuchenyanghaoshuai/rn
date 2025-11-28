import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../constants/config';
import type { ApiResponse } from '../types';

// Token 存储工具
export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(API_CONFIG.AUTH.TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(API_CONFIG.AUTH.REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(API_CONFIG.AUTH.TOKEN_KEY, accessToken);
      await SecureStore.setItemAsync(API_CONFIG.AUTH.REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.error('Failed to save tokens:', error);
    }
  },

  async clearTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(API_CONFIG.AUTH.TOKEN_KEY);
      await SecureStore.deleteItemAsync(API_CONFIG.AUTH.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  },
};

// 创建 axios 实例
const createHttpClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}`,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    async (config) => {
      const token = await tokenStorage.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response) => {
      const data = response.data;
      // 检查业务状态码
      if (data && typeof data === 'object') {
        const code = data.code ?? 200;
        if (code !== 200 && code !== 0) {
          return Promise.reject({
            code,
            message: data.message || '请求失败',
            data: data.data,
          });
        }
      }
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      // 401 错误尝试刷新 token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = await tokenStorage.getRefreshToken();
          if (refreshToken) {
            const response = await axios.post(
              `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
              { refresh_token: refreshToken }
            );

            const { token, refresh_token } = response.data.data || response.data;
            if (token) {
              await tokenStorage.setTokens(token, refresh_token || refreshToken);

              // 重试原请求
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return instance(originalRequest);
            }
          }
        } catch (refreshError) {
          // 刷新失败，清除 token
          await tokenStorage.clearTokens();
        }
      }

      // 格式化错误
      const errorResponse = {
        code: error.response?.status || 500,
        message: (error.response?.data as any)?.message || error.message || '网络错误',
        data: (error.response?.data as any)?.data,
      };

      return Promise.reject(errorResponse);
    }
  );

  return instance;
};

// HTTP 客户端实例
const httpClient = createHttpClient();

// 封装的 HTTP 方法
export const http = {
  async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const response = await httpClient.get<ApiResponse<T>>(url, { params });
    return response.data;
  },

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await httpClient.post<ApiResponse<T>>(url, data);
    return response.data;
  },

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await httpClient.put<ApiResponse<T>>(url, data);
    return response.data;
  },

  async delete<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const response = await httpClient.delete<ApiResponse<T>>(url, { params });
    return response.data;
  },

  // 上传文件
  async upload<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    const token = await tokenStorage.getAccessToken();
    const response = await httpClient.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return response.data;
  },
};

export default http;
