import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { articleApi } from '../../src/api/article';
import { categoryApi } from '../../src/api/category';
import { uploadApi } from '../../src/api/upload';
import { useAuthStore } from '../../src/stores/auth';
import { Image } from 'react-native';

export default function ArticleCreateScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [coverImage, setCoverImage] = useState<string>('');
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // 获取分类列表
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll(),
    select: (data) => data.data || [],
  });

  // 创建文章
  const createMutation = useMutation({
    mutationFn: () =>
      articleApi.create({
        title,
        content,
        summary,
        category_id: categoryId!,
        cover_image: coverImage,
        tags,
        status: 1, // 直接发布
      }),
    onSuccess: (data) => {
      Alert.alert('发布成功', '您的文章已成功发布', [
        { text: '确定', onPress: () => router.replace(`/article/${data.data.id}`) },
      ]);
    },
    onError: (error: any) => {
      Alert.alert('发布失败', error.message || '请稍后重试');
    },
  });

  // 选择封面图
  const handleSelectCover = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setIsUploading(true);
      try {
        const asset = result.assets[0];
        const response = await uploadApi.uploadImage({
          uri: asset.uri,
          type: asset.mimeType || 'image/jpeg',
          name: asset.fileName || 'cover.jpg',
        }, 'article_cover');

        const imageUrl = response.data.public_url || response.data.url;
        if (imageUrl) {
          setCoverImage(imageUrl);
        }
      } catch (error: any) {
        Alert.alert('上传失败', error.message || '请稍后重试');
      } finally {
        setIsUploading(false);
      }
    }
  };

  // 验证并发布
  const handlePublish = () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }

    if (!title.trim()) {
      Alert.alert('提示', '请输入文章标题');
      return;
    }
    if (!content.trim()) {
      Alert.alert('提示', '请输入文章内容');
      return;
    }
    if (!categoryId) {
      Alert.alert('提示', '请选择文章分类');
      return;
    }

    createMutation.mutate();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '发布文章',
          headerRight: () => (
            <TouchableOpacity
              onPress={handlePublish}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="text-white font-medium text-base">发布</Text>
              )}
            </TouchableOpacity>
          ),
        }}
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView className="flex-1 bg-white" keyboardShouldPersistTaps="handled">
          <View className="p-4">
            {/* 封面图 */}
            <TouchableOpacity
              className="w-full h-44 bg-gray-100 rounded-xl items-center justify-center mb-4 overflow-hidden"
              onPress={handleSelectCover}
              disabled={isUploading}
            >
              {coverImage ? (
                <Image
                  source={{ uri: coverImage }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : isUploading ? (
                <ActivityIndicator color="#e76f51" />
              ) : (
                <>
                  <Ionicons name="image-outline" size={40} color="#9ca3af" />
                  <Text className="text-gray-400 mt-2">添加封面图</Text>
                </>
              )}
            </TouchableOpacity>

            {/* 标题 */}
            <TextInput
              className="text-xl font-bold text-gray-800 py-3 border-b border-gray-100"
              placeholder="请输入标题"
              placeholderTextColor="#9ca3af"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />

            {/* 分类选择 */}
            <View className="py-4 border-b border-gray-100">
              <Text className="text-gray-600 mb-2">选择分类 *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {categories?.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      className={`px-4 py-2 rounded-full ${
                        categoryId === category.id
                          ? 'bg-primary-500'
                          : 'bg-gray-100'
                      }`}
                      onPress={() => setCategoryId(category.id)}
                    >
                      <Text
                        className={
                          categoryId === category.id ? 'text-white' : 'text-gray-600'
                        }
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* 摘要 */}
            <View className="py-4 border-b border-gray-100">
              <Text className="text-gray-600 mb-2">文章摘要（可选）</Text>
              <TextInput
                className="text-gray-700 leading-6"
                placeholder="输入文章摘要..."
                placeholderTextColor="#9ca3af"
                value={summary}
                onChangeText={setSummary}
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            </View>

            {/* 正文 */}
            <View className="py-4">
              <Text className="text-gray-600 mb-2">文章内容 *</Text>
              <TextInput
                className="text-gray-700 leading-7 min-h-[300px]"
                placeholder="开始写作..."
                placeholderTextColor="#9ca3af"
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* 标签 */}
            <View className="py-4 border-t border-gray-100">
              <Text className="text-gray-600 mb-2">标签（用逗号分隔）</Text>
              <TextInput
                className="bg-gray-50 rounded-xl px-4 py-3 text-gray-700"
                placeholder="育儿,宝宝,健康"
                placeholderTextColor="#9ca3af"
                value={tags}
                onChangeText={setTags}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
