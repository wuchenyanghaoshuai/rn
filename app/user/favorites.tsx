import { View, FlatList, RefreshControl, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { favoriteApi } from '../../src/api/favorite';
import ArticleCard from '../../src/components/ArticleCard';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import EmptyState from '../../src/components/EmptyState';
import type { Favorite } from '../../src/types';

export default function UserFavoritesScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // 获取收藏列表
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['userFavorites'],
    queryFn: ({ pageParam = 1 }) =>
      favoriteApi.getMyFavorites({
        page: pageParam,
        size: 20,
      }),
    getNextPageParam: (lastPage) => {
      const { page = 1, total_pages = 1 } = (lastPage as any).pagination || (lastPage as any).data || {};
      return page < total_pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const favorites =
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

  const renderItem = ({ item }: { item: Favorite }) => {
    if (!item.article) return null;
    return (
      <ArticleCard 
        article={item.article} 
        style={{ marginHorizontal: 16, marginBottom: 12 }} 
      />
    );
  };

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return <LoadingSpinner size="small" />;
    }
    if (!hasNextPage && favorites.length > 0) {
      return (
        <Text className="text-center text-gray-400 py-4">没有更多收藏了</Text>
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
        icon="bookmark-outline"
        title="暂无收藏"
        description="快去收藏一些感兴趣的内容吧"
        actionText="去浏览"
        onAction={() => router.push('/articles')}
      />
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: '我的收藏' }} />
      
      <View className="flex-1 bg-background">
        <FlatList
          data={favorites}
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
      </View>
    </>
  );
}