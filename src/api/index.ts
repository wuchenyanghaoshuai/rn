// API 模块统一导出
export { http, tokenStorage } from './http';
export { authApi, authUtils } from './auth';
export { articleApi } from './article';
export { userApi } from './user';
export { commentApi } from './comment';
export { momentApi } from './moment';
export { notificationApi } from './notification';
export { favoriteApi } from './favorite';
export { categoryApi } from './category';
export { searchApi } from './search';
export { uploadApi } from './upload';
export { pointsApi } from './points';

// 默认导出所有 API
export default {
  auth: require('./auth').authApi,
  article: require('./article').articleApi,
  user: require('./user').userApi,
  comment: require('./comment').commentApi,
  moment: require('./moment').momentApi,
  notification: require('./notification').notificationApi,
  favorite: require('./favorite').favoriteApi,
  category: require('./category').categoryApi,
  search: require('./search').searchApi,
  upload: require('./upload').uploadApi,
  points: require('./points').pointsApi,
};
