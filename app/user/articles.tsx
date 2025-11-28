import { View, FlatList, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { articleApi } from '../../src/api/article';
import { useAuthStore } from '../../src/stores/auth';
import ArticleCard from '../../src/components/ArticleCard';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import EmptyState from '../../src/components/EmptyState';
import type { Article } from '../../src/types';

export default function UserArticlesScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId?: string }>();
  const { user: currentUser } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  // 如果 URL 中有 userId 参数则使用，否则使用当前登录用户 ID
  // 注意：如果是查看他人文章，通常会跳转到 /user/[id] 页面，这里主要是“我的文章”
  // 但为了兼容性，如果传了 userId 就查 userId 的
  const targetUserId = userId ? Number(userId) : currentUser?.id;

  // 获取文章列表
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['userArticles', targetUserId],
    queryFn: ({ pageParam = 1 }) => {
      if (!targetUserId) return Promise.reject('User ID required');
      return articleApi.getUserArticles(targetUserId, {
        page: pageParam,
        size: 20,
      });
    },
    getNextPageParam: (lastPage) => {
      const { page = 1, total_pages = 1 } = (lastPage as any).pagination || (lastPage as any).data || {};
      return page < total_pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!targetUserId,
  });

  const articles =
    data?.pages.flatMap((page) => {
      if (Array.isArray((page as any).data)) {
        return (page as any).data;
      }
      const items = (page as any).data?.items || [];
      return Array.isArray(items) ? items : [];
    }) || [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderItem = ({ item }: { item: Article }) => (
    <ArticleCard article={item} style={{ marginHorizontal: 16, marginBottom: 12 }} />
  );

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return <LoadingSpinner size="small" />;
    }
    if (!hasNextPage && articles.length > 0) {
      return (
        <Text className="text-center text-gray-400 py-4">没有更多文章了</Text>
      );
    }
    return null;
  };

  const renderEmpty = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    return (
      <EmptyState
        icon="document-text-outline"
        title="暂无文章"
        description="还没有发布过文章"
        actionText="去发布"
        onAction={() => router.push('/article/create')}
      />
    );
  };

  if (!targetUserId) {
    return (
      <EmptyState
        icon="alert-circle-outline"
        title="未登录"
        description="请先登录后查看"
        actionText="去登录"
        onAction={() => router.push('/(auth)/login')}
      />
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: userId ? 'TA的文章' : '我的文章' }} />
      
      <View className="flex-1 bg-background">
        <FlatList
          data={articles}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#e76f51']} />
          }
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
        />

        {/* 发布按钮 - 仅在查看自己的文章时显示 */}
        {(!userId || Number(userId) === currentUser?.id) && (
          <TouchableOpacity
            className="absolute right-4 bottom-6 w-14 h-14 bg-primary-500 rounded-full items-center justify-center shadow-lg"
            onPress={() => router.push('/article/create')}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}