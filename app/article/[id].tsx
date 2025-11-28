import { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Share,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { articleApi } from '../../src/api/article';
import { favoriteApi } from '../../src/api/favorite';
import { useAuthStore } from '../../src/stores/auth';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import EmptyState from '../../src/components/EmptyState';
import CommentSection from '../../src/components/CommentSection';

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const articleId = Number(id);

  // 获取文章详情
  const {
    data: article,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['article', articleId],
    queryFn: () => articleApi.getDetail(articleId),
    select: (data) => data.data,
    enabled: !!articleId,
  });

  // 获取收藏状态
  const { data: favoriteStatus } = useQuery({
    queryKey: ['favoriteStatus', articleId],
    queryFn: () => favoriteApi.getStatus(articleId),
    select: (data) => data.data?.is_favorited,
    enabled: !!articleId && isAuthenticated,
  });

  // 点赞
  const likeMutation = useMutation({
    mutationFn: () => articleApi.like(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article', articleId] });
    },
  });

  // 取消点赞
  const unlikeMutation = useMutation({
    mutationFn: () => articleApi.unlike(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article', articleId] });
    },
  });

  // 收藏/取消收藏
  const favoriteMutation = useMutation({
    mutationFn: () => {
      if (favoriteStatus) {
        return favoriteApi.unfavoriteArticle(articleId);
      }
      return favoriteApi.favoriteArticle(articleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteStatus', articleId] });
    },
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleLike = () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }
    // 简单的乐观更新逻辑
    if (article?.is_liked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  const handleFavorite = () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }
    favoriteMutation.mutate();
  };

  const handleShare = async () => {
    if (!article) return;
    try {
      await Share.share({
        message: `${article.title} - GoDad育儿社区`,
        title: article.title,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const decodeEntities = (str: string) =>
    str
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'");

  const contentBlocks = useMemo(() => {
    const html = article?.content || '';
    if (!html) return [];

    const blocks: Array<{ type: 'text' | 'image'; content: string }> = [];

    const cleanText = (str: string) => {
      const withBreaks = str
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<\/div>/gi, '\n');
      const noTags = withBreaks.replace(/<[^>]+>/g, '');
      return decodeEntities(noTags)
        .replace(/\s+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    };

    const imgRegex = /<img[\s\S]*?src=["']?([^"' >\s]+)[\s\S]*?>/gi;

    let lastIndex = 0;
    let match;

    while ((match = imgRegex.exec(html))) {
      const textChunk = html.slice(lastIndex, match.index);
      const cleaned = cleanText(textChunk);
      if (cleaned) {
        blocks.push({ type: 'text', content: cleaned });
      }
      if (match[1]) {
        blocks.push({ type: 'image', content: decodeEntities(match[1]) });
      }
      lastIndex = match.index + match[0].length;
    }

    const tailText = cleanText(html.slice(lastIndex));
    if (tailText) {
      blocks.push({ type: 'text', content: tailText });
    }

    return blocks;
  }, [article?.content]);

  if (isLoading) {
    return <LoadingSpinner fullScreen text="加载中..." />;
  }

  if (error || !article) {
    return (
      <EmptyState
        icon="document-text-outline"
        title="文章不存在"
        description="该文章可能已被删除或不存在"
        actionText="返回首页"
        onAction={() => router.back()}
      />
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () => (
            <TouchableOpacity onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      <View className="flex-1 bg-white">
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#e76f51']} />
          }
        >
          {/* 封面图 */}
          {article.cover_image && (
            <Image
              source={{ uri: article.cover_image }}
              className="w-full h-56"
              resizeMode="cover"
            />
          )}

          <View className="p-4">
            {/* 分类标签 */}
            {article.category && (
              <TouchableOpacity
                className="self-start bg-primary-50 px-3 py-1 rounded-full mb-3"
                onPress={() => router.push(`/articles?category=${article.category?.id}`)}
              >
                <Text className="text-primary-600 text-sm">{article.category.name}</Text>
              </TouchableOpacity>
            )}

            {/* 标题 */}
            <Text className="text-2xl font-bold text-gray-800 leading-8">{article.title}</Text>

            {/* 作者信息 */}
            <TouchableOpacity
              className="flex-row items-center mt-4 py-3 border-b border-gray-100"
              onPress={() => {
                if (article.author?.id) {
                  router.push(`/user/${article.author.id}`);
                }
              }}
            >
              <Image
                source={
                  article.author?.avatar
                    ? { uri: article.author.avatar }
                    : require('../../assets/default-avatar.png')
                }
                className="w-12 h-12 rounded-full bg-gray-100"
              />
              <View className="ml-3 flex-1">
                <Text className="text-gray-800 font-medium">
                  {article.author?.nickname || article.author?.username}
                </Text>
                <Text className="text-gray-400 text-sm mt-0.5">
                  {formatDate(article.published_at || article.created_at)}
                </Text>
              </View>
              <TouchableOpacity className="bg-primary-500 px-4 py-1.5 rounded-full">
                <Text className="text-white text-sm">关注</Text>
              </TouchableOpacity>
            </TouchableOpacity>

            {/* 内容 */}
            <View className="mt-4">
              {contentBlocks.length > 0 ? (
                contentBlocks.map((block, idx) =>
                  block.type === 'image' ? (
                    <Image
                      key={`img-${idx}`}
                      source={{ uri: block.content }}
                      className="w-full h-52 rounded-lg bg-gray-100 mb-3"
                      resizeMode="cover"
                    />
                  ) : (
                    <Text
                      key={`txt-${idx}`}
                      className="text-gray-700 text-base leading-7 mb-3"
                    >
                      {block.content}
                    </Text>
                  )
                )
              ) : (
                <Text className="text-gray-700 text-base leading-7">
                  {decodeEntities(article.content || '') || '暂无内容'}
                </Text>
              )}
            </View>

            {/* 标签 */}
            {article.tags && (
              <View className="flex-row flex-wrap gap-2 mt-6">
                {(typeof article.tags === 'string'
                  ? article.tags.split(',')
                  : article.tags
                ).map((tag: string, index: number) => (
                  <TouchableOpacity
                    key={index}
                    className="bg-gray-100 px-3 py-1.5 rounded-full"
                  >
                    <Text className="text-gray-600 text-sm">#{tag.trim()}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* 统计数据 */}
            <View className="flex-row items-center justify-around py-4 mt-6 border-t border-b border-gray-100">
              <View className="items-center">
                <Text className="text-gray-800 font-bold text-lg">{article.view_count}</Text>
                <Text className="text-gray-400 text-sm">阅读</Text>
              </View>
              <View className="items-center">
                <Text className="text-gray-800 font-bold text-lg">{article.like_count}</Text>
                <Text className="text-gray-400 text-sm">点赞</Text>
              </View>
              <View className="items-center">
                <Text className="text-gray-800 font-bold text-lg">{article.comment_count}</Text>
                <Text className="text-gray-400 text-sm">评论</Text>
              </View>
              <View className="items-center">
                <Text className="text-gray-800 font-bold text-lg">{article.favorite_count || 0}</Text>
                <Text className="text-gray-400 text-sm">收藏</Text>
              </View>
            </View>

            {/* 评论区 */}
            <View className="mt-6">
              <Text className="text-lg font-bold text-gray-800 mb-4">
                评论 ({article.comment_count})
              </Text>
              <CommentSection articleId={articleId} />
            </View>
          </View>
        </ScrollView>

        {/* 底部操作栏 */}
        <View className="flex-row items-center px-4 py-3 bg-white border-t border-gray-100">
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center py-2"
            onPress={handleLike}
          >
            <Ionicons
              name={article.is_liked ? 'heart' : 'heart-outline'}
              size={24}
              color={article.is_liked ? '#ef4444' : '#6b7280'}
            />
            <Text className={`ml-1 ${article.is_liked ? 'text-red-500' : 'text-gray-500'}`}>
              {article.like_count || '点赞'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center py-2"
            onPress={handleFavorite}
          >
            <Ionicons
              name={favoriteStatus ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={favoriteStatus ? '#f59e0b' : '#6b7280'}
            />
            <Text className={`ml-1 ${favoriteStatus ? 'text-amber-500' : 'text-gray-500'}`}>
              {favoriteStatus ? '已收藏' : '收藏'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center py-2"
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={24} color="#6b7280" />
            <Text className="ml-1 text-gray-500">分享</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
