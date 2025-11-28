import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { momentApi } from '../../src/api/moment';
import { uploadApi } from '../../src/api/upload';
import { useAuthStore } from '../../src/stores/auth';

export default function MomentCreateScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // 创建动态
  const createMutation = useMutation({
    mutationFn: () =>
      momentApi.create({
        content,
        media_urls: images,
        tags: tags.split(/[,，\s]+/).filter(Boolean),
      }),
    onSuccess: (data) => {
      Alert.alert('发布成功', '', [
        { text: '确定', onPress: () => router.replace(`/moment/${data.data.id}`) },
      ]);
    },
    onError: (error: any) => {
      Alert.alert('发布失败', error.message || '请稍后重试');
    },
  });

  // 选择图片
  const handleSelectImages = async () => {
    if (images.length >= 9) {
      Alert.alert('提示', '最多只能添加9张图片');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 9 - images.length,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setIsUploading(true);
      try {
        const uploadedUrls: string[] = [];
        for (const asset of result.assets) {
          const response = await uploadApi.uploadImage({
            uri: asset.uri,
            type: asset.mimeType || 'image/jpeg',
            name: asset.fileName || `image_${Date.now()}.jpg`,
          }, 'moment');

          const imageUrl = response.data.public_url || response.data.url;
          if (imageUrl) {
            uploadedUrls.push(imageUrl);
          }
        }
        setImages([...images, ...uploadedUrls]);
      } catch (error: any) {
        Alert.alert('上传失败', error.message || '请稍后重试');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }

    if (!content.trim()) {
      Alert.alert('提示', '请输入内容');
      return;
    }

    createMutation.mutate();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '发布动态',
          headerRight: () => (
            <TouchableOpacity
              onPress={handlePublish}
              disabled={createMutation.isPending || !content.trim()}
            >
              {createMutation.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text
                  className={`font-medium text-base ${
                    content.trim() ? 'text-white' : 'text-white/50'
                  }`}
                >
                  发布
                </Text>
              )}
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className="flex-1 bg-white" keyboardShouldPersistTaps="handled">
        <View className="p-4">
          {/* 内容输入 */}
          <TextInput
            className="text-gray-800 text-base leading-7 min-h-[150px]"
            placeholder="分享你的育儿心得..."
            placeholderTextColor="#9ca3af"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            maxLength={1000}
          />

          {/* 字数统计 */}
          <Text className="text-right text-gray-400 text-sm mt-2">
            {content.length}/1000
          </Text>

          {/* 已选图片 */}
          {images.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mt-4">
              {images.map((uri, index) => (
                <View key={index} className="relative">
                  <Image
                    source={{ uri }}
                    className="w-24 h-24 rounded-lg"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    className="absolute -top-2 -right-2 w-6 h-6 bg-black/60 rounded-full items-center justify-center"
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* 添加图片按钮 */}
          <TouchableOpacity
            className="flex-row items-center py-4 border-t border-gray-100 mt-4"
            onPress={handleSelectImages}
            disabled={isUploading || images.length >= 9}
          >
            {isUploading ? (
              <ActivityIndicator color="#e76f51" size="small" />
            ) : (
              <>
                <Ionicons name="image-outline" size={24} color="#e76f51" />
                <Text className="text-primary-500 ml-2">
                  添加图片 ({images.length}/9)
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* 标签输入 */}
          <View className="py-4 border-t border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="pricetag-outline" size={20} color="#9ca3af" />
              <TextInput
                className="flex-1 ml-2 text-gray-700"
                placeholder="添加标签，用空格或逗号分隔"
                placeholderTextColor="#9ca3af"
                value={tags}
                onChangeText={setTags}
              />
            </View>

            {/* 标签预览 */}
            {tags.trim() && (
              <View className="flex-row flex-wrap gap-2 mt-3">
                {tags
                  .split(/[,，\s]+/)
                  .filter(Boolean)
                  .map((tag, index) => (
                    <View
                      key={index}
                      className="bg-secondary-50 px-3 py-1 rounded-full"
                    >
                      <Text className="text-secondary-600">#{tag}</Text>
                    </View>
                  ))}
              </View>
            )}
          </View>

          {/* 发布提示 */}
          <View className="mt-6 bg-gray-50 rounded-xl p-4">
            <View className="flex-row items-center">
              <Ionicons name="information-circle-outline" size={20} color="#9ca3af" />
              <Text className="text-gray-500 ml-2">发布须知</Text>
            </View>
            <Text className="text-gray-400 text-sm mt-2 leading-5">
              请文明发言，遵守社区规范。禁止发布违法违规、广告推销等内容。
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
