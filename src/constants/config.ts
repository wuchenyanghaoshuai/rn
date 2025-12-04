import Constants from 'expo-constants';
import { Platform } from 'react-native';

// 获取环境变量或使用默认值
const getApiBaseUrl = (): string => {
  // Expo 常量中的额外配置
  const expoConfig = Constants.expoConfig?.extra;

  if (expoConfig?.apiBaseUrl) {
    return expoConfig.apiBaseUrl;
  }

  // 开发环境默认值
  if (__DEV__) {
    // 使用用户指定的局域网IP地址
    return 'http://192.168.140.229:8888';
  }

  // 生产环境
  return 'https://api.godad.com';
};

export const API_CONFIG = {
  // 后端API基础URL
  BASE_URL: getApiBaseUrl(),

  // API版本
  API_VERSION: '/api/v2',

  // 请求超时时间（毫秒）
  TIMEOUT: 15000,

  // 认证相关
  AUTH: {
    TOKEN_KEY: 'godad_access_token',
    REFRESH_TOKEN_KEY: 'godad_refresh_token',
    USER_INFO_KEY: 'godad_user_info',
  },

  // API端点
  ENDPOINTS: {
    // 认证相关
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      LOGIN_SMS: '/auth/login/sms',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      SEND_SMS: '/sms/send',
    },

    // 用户相关
    USER: {
      PROFILE: '/users/me',
      UPDATE_PROFILE: '/users/me',
      CHANGE_PASSWORD: '/users/me/password',
      UPDATE_EMAIL: '/users/me/email',
      PUBLIC_INFO: '/users',
      CHECK_NICKNAME: '/users/check-nickname',
      GENERATE_NICKNAME: '/users/generate-nickname',
      BY_USERNAME: '/users',
      ARTICLES_BY_USERNAME: '/users',
      STATS: '/users',
    },

    // 文章相关
    ARTICLE: {
      LIST: '/articles',
      DETAIL: '/articles',
      CREATE: '/articles',
      UPDATE: '/articles',
      DELETE: '/articles',
      SEARCH: '/articles/search',
      HOT: '/articles/hot',
      LIKE: '/articles',
      UNLIKE: '/articles',
      PUBLISH: '/articles',
      UNPUBLISH: '/articles',
      MY: '/articles',
    },

    // 评论相关
    COMMENT: {
      LIST: '/comments',
      ARTICLE_COMMENTS: '/articles',
      CREATE: '/comments',
      UPDATE: '/comments',
      DELETE: '/comments',
      LIKE: '/comments',
      UNLIKE: '/comments',
      REPLIES: '/comments',
      MY: '/comments/me',
    },

    // 分类相关
    CATEGORY: {
      LIST: '/categories',
      ALL: '/categories',
      WITH_COUNT: '/categories/with-count',
      DETAIL: '/categories',
      BY_SLUG: '/categories/slug',
      ARTICLES: '/categories',
    },

    // 收藏相关
    FAVORITE: {
      MY: '/favorites/me',
      POPULAR: '/favorites/popular',
      BATCH_STATUS: '/favorites/batch-status',
      DELETE: '/favorites',
      FAVORITE_ARTICLE: '/articles',
      UNFAVORITE_ARTICLE: '/articles',
      ARTICLE_STATUS: '/articles',
      TOGGLE: '/favorites/toggle',
      STATUS: '/favorites/status',
    },

    // 通知相关
    NOTIFICATION: {
      BASE: '/notifications',
      LIST: '/notifications',
      STATS: '/notifications/stats',
      STATS_BY_TYPE: '/notifications/stats/by-type',
      MARK_ONE_READ: '/notifications',
      MARK_READ: '/notifications/read',
      MARK_ALL_READ: '/notifications/read-all',
      BATCH_MARK_READ: '/notifications/read-batch',
      DELETE: '/notifications',
      DELETE_ALL: '/notifications',
    },

    // 关注相关
    FOLLOW: {
      BASE: '/follows',
      MY_FOLLOWING: '/follows/following',
      MY_FOLLOWERS: '/follows/followers',
      MY_STATS: '/follows/stats',
      MUTUAL: '/follows/mutual',
      USER_STATS: '/users',
      USER_FOLLOWING: '/users',
      USER_FOLLOWERS: '/users',
      FOLLOW_USER: '/users',
      UNFOLLOW_USER: '/users',
      FOLLOW_STATUS: '/users',
    },

    // 广场相关
    MOMENT: {
      LIST: '/moments',
      DETAIL: '/moments',
      CREATE: '/moments',
      DELETE: '/moments',
      LIKE: '/moments',
      UNLIKE: '/moments',
      HOT_TAGS: '/moments/hot-tags',
      REPLIES: '/moments',
      CREATE_REPLY: '/moments',
      DELETE_REPLY: '/moments',
    },

    // 话题管理
    TOPIC: {
      ACTIVE: '/topics/active',
      LIST: '/topics',
      DETAIL: '/topics',
    },

    // 专家认证
    EXPERT: {
      PROFILE: '/experts/profile',
      SUBMIT: '/experts/profile/submit',
      CANCEL: '/experts/profile/cancel',
      STATUS: '/experts/status',
      LIST: '/experts',
      DETAIL: '/experts',
      RECOMMENDATIONS: '/experts/recommendations',
    },

    // 搜索相关
    SEARCH: {
      SEARCH: '/search',
      HOT_KEYWORDS: '/search/hot-keywords',
      SUGGESTIONS: '/search/suggestions',
    },

    // 积分相关
    POINTS: {
      MY: '/points/me',
      HISTORY: '/points/history',
      STATS: '/points/stats',
      LEVELS: '/points/levels',
      RULES: '/points/rules',
    },

    // 通用点赞相关
    LIKE: {
      TOGGLE: '/likes/toggle',
      STATUS: '/likes/status',
      LIST: '/likes',
      USER: '/likes/user',
      POPULAR: '/likes/popular',
      BATCH_STATUS: '/likes/batch-status',
    },

    // 上传相关
    UPLOAD: {
      IMAGE: '/uploads/image',
      AVATAR: '/uploads/avatar',
      MY_UPLOADS: '/uploads/me',
      REFRESH_IMAGE_URL: '/uploads/refresh-image-url',
    },

    // 标签相关
    TAG: {
      LIST: '/tags',
      POPULAR: '/tags/popular',
    },

    // 举报相关
    REPORT: {
      CREATE: '/reports',
      MY: '/reports/me',
    },
  },
};

// 构建完整的API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${endpoint}`;
};

// 应用配置
export const APP_CONFIG = {
  // 应用名称
  APP_NAME: 'GoDad',

  // 版本
  VERSION: '1.0.0',

  // 分页默认值
  DEFAULT_PAGE_SIZE: 20,

  // 图片配置
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    COMPRESS_QUALITY: 0.8,
  },

  // 缓存配置
  CACHE: {
    USER_INFO_TTL: 6 * 60 * 60 * 1000, // 6小时
    ARTICLE_LIST_TTL: 5 * 60 * 1000, // 5分钟
  },
};
