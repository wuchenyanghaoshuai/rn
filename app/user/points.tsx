import { View, Text, ScrollView, RefreshControl, TouchableOpacity, FlatList } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { pointsApi } from '../../src/api/points';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import EmptyState from '../../src/components/EmptyState';
import type { PointsHistory } from '../../src/types';

export default function UserPointsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // 获取积分概览
  const { data: pointsInfo, refetch: refetchInfo } = useQuery({
    queryKey: ['userPoints'],
    queryFn: () => pointsApi.getMyPoints(),
    select: (data) => data.data,
  });

  // 获取积分历史
  const {
    data: historyData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchHistory,
  } = useInfiniteQuery({
    queryKey: ['pointsHistory'],
    queryFn: ({ pageParam = 1 }) =>
      pointsApi.getHistory({
        page: pageParam,
        size: 20,
      }),
    getNextPageParam: (lastPage) => {
      const { page = 1, total_pages = 1 } = (lastPage as any).pagination || (lastPage as any).data || {};
      return page < total_pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const historyList =
    historyData?.pages.flatMap((page) => {
      if (Array.isArray((page as any).data)) {
        return (page as any).data;
      }
      const items = (page as any).data?.items || [];
      return Array.isArray(items) ? items : [];
    }) || [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchInfo(), refetchHistory()]);
    setRefreshing(false);
  }, [refetchInfo, refetchHistory]);

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderHeader = () => (
    <View className="bg-primary-500 px-4 pt-6 pb-8 rounded-b-[32px] shadow-sm mb-4">
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-white/80 text-sm mb-1">当前积分</Text>
          <Text className="text-white text-4xl font-bold">{pointsInfo?.total_points || 0}</Text>
        </View>
        <View className="bg-white/20 px-3 py-1.5 rounded-full">
          <Text className="text-white font-medium text-sm">
            Lv.{pointsInfo?.level || 0} {pointsInfo?.level_name || '新手'}
          </Text>
        </View>
      </View>

      <View className="bg-white/10 rounded-xl p-4 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-white/90 font-medium mb-1">距离下一等级</Text>
          <View className="h-2 bg-white/20 rounded-full overflow-hidden">
            <View 
              className="h-full bg-white" 
              style={{ width: `${Math.min(((pointsInfo?.total_points || 0) / (pointsInfo?.next_level_points || 100)) * 100, 100)}%` }} 
            />
          </View>
        </View>
        <Text className="text-white text-sm ml-4 font-medium">
          {pointsInfo?.next_level_points ? `${pointsInfo.total_points}/${pointsInfo.next_level_points}` : 'MAX'}
        </Text>
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: PointsHistory }) => {
    const isPositive = item.points > 0;
    return (
      <View className="flex-row items-center bg-white p-4 mx-4 mb-3 rounded-xl shadow-sm">
        <View className={`w-10 h-10 rounded-full items-center justify-center ${isPositive ? 'bg-orange-50' : 'bg-gray-50'}`}>
          <Ionicons 
            name={isPositive ? 'add-circle-outline' : 'remove-circle-outline'} 
            size={24} 
            color={isPositive ? '#f97316' : '#6b7280'} 
          />
        </View>
        <View className="flex-1 ml-3">
          <Text className="text-gray-800 font-medium text-base">{item.description}</Text>
          <Text className="text-gray-400 text-xs mt-1">
            {new Date(item.created_at).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <Text className={`font-bold text-lg ${isPositive ? 'text-orange-500' : 'text-gray-800'}`}>
          {isPositive ? '+' : ''}{item.points}
        </Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    return (
      <EmptyState
        icon="receipt-outline"
        title="暂无记录"
        description="还没有积分变动记录"
      />
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: '我的积分',
          headerStyle: { backgroundColor: '#e76f51' },
          headerTintColor: '#fff',
          headerShadowVisible: false,
        }} 
      />
      
      <View className="flex-1 bg-background">
        <FlatList
          data={historyList}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#e76f51']} tintColor="#fff" />
          }
        />
      </View>
    </>
  );
}