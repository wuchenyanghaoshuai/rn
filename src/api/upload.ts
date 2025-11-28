import { http } from './http';
import { API_CONFIG } from '../constants/config';
import type {
  ImageUploadResponse,
  ApiResponse,
} from '../types';

// 上传 API 服务
export const uploadApi = {
  // 上传图片
  async uploadImage(file: {
    uri: string;
    type: string;
    name: string;
  }, usage?: string): Promise<ApiResponse<ImageUploadResponse>> {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as any);

    if (usage) {
      formData.append('usage', usage);
    }

    return http.upload<ImageUploadResponse>(API_CONFIG.ENDPOINTS.UPLOAD.IMAGE, formData);
  },

  // 上传头像
  async uploadAvatar(file: {
    uri: string;
    type: string;
    name: string;
  }): Promise<ApiResponse<ImageUploadResponse>> {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as any);

    return http.upload<ImageUploadResponse>(API_CONFIG.ENDPOINTS.UPLOAD.AVATAR, formData);
  },

  // 获取我的上传列表
  async getMyUploads(params?: { page?: number; size?: number }): Promise<ApiResponse<ImageUploadResponse[]>> {
    return http.get<ImageUploadResponse[]>(API_CONFIG.ENDPOINTS.UPLOAD.MY_UPLOADS, params);
  },

  // 刷新图片 URL
  async refreshImageUrl(imageId: number): Promise<ApiResponse<{ url: string }>> {
    return http.post<{ url: string }>(API_CONFIG.ENDPOINTS.UPLOAD.REFRESH_IMAGE_URL, {
      image_id: imageId,
    });
  },
};

export default uploadApi;
