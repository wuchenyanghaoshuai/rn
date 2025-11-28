import { create } from 'zustand';
import { authApi, authUtils } from '../api/auth';
import type { User, UserLoginRequest, UserRegisterRequest } from '../types';

interface AuthState {
  // 状态
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // 计算属性
  isAdmin: boolean;

  // 方法
  initialize: () => Promise<void>;
  login: (data: UserLoginRequest) => Promise<void>;
  register: (data: UserRegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // 初始状态
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  // 计算属性
  get isAdmin() {
    return get().user?.role === 'admin';
  },

  // 初始化认证状态
  initialize: async () => {
    if (get().isInitialized) return;

    set({ isLoading: true });

    try {
      // 先尝试从本地存储获取用户信息
      const storedUser = await authUtils.getStoredUser();
      if (storedUser) {
        set({ user: storedUser, isAuthenticated: true });
      }

      // 然后尝试从服务器获取最新用户信息
      const isLoggedIn = await authUtils.isLoggedIn();
      if (isLoggedIn) {
        try {
          const response = await authApi.getCurrentUser();
          if (response.data) {
            await authUtils.saveUser(response.data);
            set({
              user: response.data,
              isAuthenticated: true,
            });
          }
        } catch {
          // token 可能已过期，清除认证数据
          await authUtils.clearAuthData();
          set({ user: null, isAuthenticated: false });
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  // 登录
  login: async (data: UserLoginRequest) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authApi.login(data);
      const user = response.data.user;

      await authUtils.saveUser(user);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || '登录失败',
      });
      throw error;
    }
  },

  // 注册
  register: async (data: UserRegisterRequest) => {
    set({ isLoading: true, error: null });

    try {
      await authApi.register(data);
      set({ isLoading: false });

      // 注册成功后自动登录
      await get().login({
        username: data.username,
        password: data.password,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || '注册失败',
      });
      throw error;
    }
  },

  // 登出
  logout: async () => {
    set({ isLoading: true });

    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      await authUtils.clearAuthData();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  // 更新用户信息
  updateUser: (userData: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      set({ user: updatedUser });
      authUtils.saveUser(updatedUser);
    }
  },

  // 刷新用户信息
  refreshUser: async () => {
    try {
      const response = await authApi.getCurrentUser();
      if (response.data) {
        await authUtils.saveUser(response.data);
        set({ user: response.data });
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  },

  // 清除错误
  clearError: () => {
    set({ error: null });
  },
}));

export default useAuthStore;
