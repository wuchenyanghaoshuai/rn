import { View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { momentApi } from '../../../src/api/moment';
import MomentCard from '../../../src/components/MomentCard';
import LoadingSpinner from '../../../src/components/LoadingSpinner';
import EmptyState from '../../../src/components/EmptyState';
import type { Moment } from '../../../src/types';

export default function TagMomentsScreen() {
  const router = useRouter();
  const { tag } = useLocalSearchParams<{ tag: string }>();
  const [refreshing, setRefreshing] = useState(false);

  const tagName = decodeURIComponent(tag || '');

  // 获取瞬间列表
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['moments', 'tag', tagName],
    queryFn: ({ pageParam = 1 }) =>
      momentApi.getByTag(tagName, {
        page: pageParam,
        size: 20,
      }),
    getNextPageParam: (lastPage) => {
      const { page = 1, total_pages = 1 } = (lastPage as any).pagination || (lastPage as any).data || {};
      return page < total_pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!tagName,
  });

  const moments =
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

  const renderItem = ({ item }: { item: Moment }) => (
    <MomentCard moment={item} style={{ marginHorizontal: 16, marginBottom: 12 }} />
  );

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return <LoadingSpinner size="small" />;
    }
    if (!hasNextPage && moments.length > 0) {
      return (
        <Text className="text-center text-gray-400 py-4">没有更多动态了</Text>
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
        icon="pricetag-outline"
        title={`#${tagName}`}
        description="该话题下还没有相关动态"
      />
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: `#${tagName}` }} />
      
      <View className="flex-1 bg-background">
        <FlatList
          data={moments}
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
