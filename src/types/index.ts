// API数据类型定义

// 用户相关类型
export interface User {
  id: number;
  handle: string;        // 永久唯一标识，用于URL
  nickname: string;      // 显示昵称
  username: string;      // 保留用于兼容
  email: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin' | 'content_manager';
  phone?: string;
  gender?: string;
  birthday?: string;
  location?: string;
  website?: string;
  expert_level?: number;
  expert_type?: string;
  favorite_count?: number;
  article_count?: number;
  moment_count?: number;
  created_at: string;
  updated_at: string;
}

// 关注相关类型
export interface FollowStats {
  following_count: number;
  followers_count: number;
}

export interface FollowUser extends User {
  is_mutual_follow?: boolean;
  is_following?: boolean;
}

export interface FollowListResponse {
  users: FollowUser[];
  items?: FollowUser[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// 用户注册请求
export interface UserRegisterRequest {
  username: string;
  email?: string;
  password: string;
  nickname?: string;
  phone?: string;
  code?: string;
}

// 用户登录请求
export interface UserLoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

// 用户登录响应
export interface UserLoginResponse {
  user: User;
  token: string;
  refresh_token: string;
}

// 用户更新请求
export interface UserUpdateRequest {
  nickname?: string;
  avatar?: string;
  bio?: string;
}

// 修改密码请求
export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

// 修改邮箱请求
export interface UpdateEmailRequest {
  email: string;
  password: string;
}

// 分类相关类型
export interface Category {
  id: number;
  name: string;
  description?: string;
  article_count?: number;
  created_at: string;
  updated_at: string;
}

// 分类创建/更新请求
export interface CategoryRequest {
  name: string;
  description?: string;
}

// 文章相关类型
export interface Article {
  id: number;
  title: string;
  slug?: string;
  content?: string;
  summary?: string;
  cover_image?: string;
  category_id: number;
  category?: Category;
  author_id: number;
  author?: User;
  location_display?: string;
  status: number | 'draft' | 'published';
  view_count: number;
  like_count: number;
  comment_count: number;
  favorite_count?: number;
  is_top?: boolean;
  is_recommend?: boolean;
  is_liked?: boolean;
  is_favorited?: boolean;
  tags?: string[] | string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

// 文章创建请求
export interface ArticleCreateRequest {
  title: string;
  slug?: string;
  content: string;
  summary?: string;
  cover_image?: string;
  category_id: number;
  tags?: string;
  status?: number;
  is_recommend?: boolean;
}

// 文章更新请求
export interface ArticleUpdateRequest {
  title?: string;
  slug?: string;
  content?: string;
  summary?: string;
  cover_image?: string;
  category_id?: number;
  tags?: string;
  is_top?: boolean;
  is_recommend?: boolean;
  status?: number;
}

// 文章列表查询参数
export interface ArticleListParams {
  page?: number;
  size?: number;
  category_id?: number;
  author_id?: number;
  status?: number;
  keyword?: string;
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
}

// 评论相关类型
export interface Comment {
  id: number;
  article_id: number;
  user_id: number;
  parent_id?: number;
  content: string;
  like_count: number;
  location_display?: string;
  is_liked?: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    username: string;
    nickname?: string;
    avatar?: string;
    role?: 'user' | 'admin' | 'content_manager';
    expert_level?: number;
  };
  replies?: Comment[];
  reply_count?: number;
  reply_to_id?: number;
}

// 评论列表查询参数
export interface CommentListParams {
  article_id: number;
  page?: number;
  size?: number;
}

export interface CommentCreateRequest {
  content: string;
  article_id: number;
  parent_id?: number;
  mentions?: number[];
}

export interface CommentUpdateRequest {
  content: string;
  mentions?: number[];
}

// 图片上传响应
export interface ImageUploadResponse {
  id: number;
  file_name: string;
  system_name: string;
  file_size: number;
  file_type: string;
  mime_type: string;
  file_hash: string;
  storage_path: string;
  public_url: string;
  user_id: number;
  usage: string;
  status: number;
  created_at: string;
  updated_at: string;
  url?: string;
  upload?: {
    public_url?: string;
    url?: string;
    [key: string]: any;
  };
}

// 通用列表查询参数
export interface ListParams {
  page?: number;
  size?: number;
  keyword?: string;
}

// API错误响应
export interface ApiError {
  code: number;
  message: string;
  details?: any;
}

// API通用响应
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  code?: number;
  [key: string]: any;
}

// ======================== 瞬间广场相关类型 ========================

// 瞬间媒体
export interface MomentMedia {
  id: number;
  moment_id: number;
  media_type: 'image' | 'video';
  url: string;
  created_at: string;
}

// 瞬间回复
export interface MomentReply {
  id: number;
  moment_id: number;
  user_id: number;
  parent_reply_id?: number;
  reply_to_user_id?: number;
  content: string;
  like_count: number;
  location_display?: string;
  is_liked?: boolean;
  author?: User;
  reply_to_user?: User;
  replies?: MomentReply[];
  media?: MomentMedia[];
  created_at: string;
  updated_at: string;
}

// 瞬间标签
export interface MomentTag {
  id: number;
  moment_id: number;
  tag_name: string;
  created_at: string;
}

// 瞬间主体
export interface Moment {
  id: number;
  user_id: number;
  content: string;
  location_display?: string;
  status: string;
  like_count: number;
  reply_count: number;
  share_count: number;
  view_count: number;
  is_liked?: boolean;
  author?: User;
  media?: MomentMedia[];
  replies?: MomentReply[];
  tags?: MomentTag[];
  created_at: string;
  updated_at: string;
}

// 瞬间创建请求
export interface MomentCreateRequest {
  content: string;
  media_urls?: string[];
  tags?: string[];
}

// 瞬间列表响应
export interface MomentListResponse {
  data: Moment[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
}

// 瞬间列表查询参数
export interface MomentListParams {
  page?: number;
  size?: number;
  sort?: 'hot' | 'latest';
  user_id?: number;
}

// 热门标签
export interface HotTag {
  name: string;
  count: number;
}

// 瞬间搜索参数
export interface MomentSearchParams {
  q: string;
  type?: 'content' | 'tag' | 'user';
  page?: number;
  size?: number;
}

// ======================== 通知相关类型 ========================

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  content: string;
  is_read: boolean;
  related_id?: number;
  related_type?: string;
  sender?: User;
  created_at: string;
  updated_at: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
}

// ======================== 积分相关类型 ========================

export interface PointsInfo {
  user_id: number;
  total_points: number;
  level: number;
  level_name: string;
  next_level_points?: number;
}

export interface PointsHistory {
  id: number;
  user_id: number;
  points: number;
  type: string;
  description: string;
  created_at: string;
}

// ======================== 收藏相关类型 ========================

export interface Favorite {
  id: number;
  user_id: number;
  article_id: number;
  article?: Article;
  created_at: string;
}

// ======================== 搜索相关类型 ========================

export interface SearchResult {
  articles: Article[];
  total: number;
  page: number;
  size: number;
}

export interface HotKeyword {
  keyword: string;
  count: number;
}
