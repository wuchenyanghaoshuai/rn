import { View, Text, FlatList, RefreshControl, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { momentApi } from '../../src/api/moment';
import MomentCard from '../../src/components/MomentCard';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import EmptyState from '../../src/components/EmptyState';
import { SkeletonLoader } from '../../src/components/ui';
import type { Moment } from '../../src/types';

export default function SquareScreen() {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<'latest' | 'hot'>('latest');
  const [refreshing, setRefreshing] = useState(false);

  // 获取热门标签
  const { data: hotTags } = useQuery({
    queryKey: ['hotTags'],
    queryFn: () => momentApi.getHotTags(10),
    select: (data) => data.data || [],
  });

  // 获取瞬间列表
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['moments', sortBy],
    queryFn: ({ pageParam = 1 }) =>
      momentApi.getList({
        page: pageParam,
        size: 20,
        sort: sortBy,
      }),
    getNextPageParam: (lastPage) => {
      const { page = 1, total_pages = 1 } = (lastPage as any).pagination || (lastPage as any).data || {};
      return page < total_pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const moments =
    data?.pages.flatMap((page) => {
      if (Array.isArray((page as any)?.data)) {
        return (page as any).data;
      }
      const items = (page as any)?.data?.items || [];
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
    <MomentCard moment={item} style={{ marginHorizontal: 16, marginBottom: 16 }} />
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* 排序切换 */}
      <View style={styles.sortContainer}>
        <View style={styles.sortWrapper}>
          <Pressable
            style={[styles.sortButton, sortBy === 'latest' && styles.sortButtonActive]}
            onPress={() => setSortBy('latest')}
          >
            {sortBy === 'latest' ? (
              <LinearGradient colors={['#ec4899', '#db2777']} style={styles.sortButtonGradient}>
                <Text style={styles.sortTextActive}>最新</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.sortText}>最新</Text>
            )}
          </Pressable>
          <Pressable
            style={[styles.sortButton, sortBy === 'hot' && styles.sortButtonActive]}
            onPress={() => setSortBy('hot')}
          >
            {sortBy === 'hot' ? (
              <LinearGradient colors={['#ec4899', '#db2777']} style={styles.sortButtonGradient}>
                <Text style={styles.sortTextActive}>热门</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.sortText}>热门</Text>
            )}
          </Pressable>
        </View>
      </View>

      {/* 热门标签 */}
      {hotTags && hotTags.length > 0 && (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={hotTags}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.tagList}
          renderItem={({ item }) => (
            <TagChip item={item} router={router} />
          )}
        />
      )}
    </View>
  );

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return <LoadingSpinner size="small" />;
    }
    if (!hasNextPage && moments.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <View style={styles.footerLine} />
          <Text style={styles.footerText}>没有更多动态了</Text>
          <View style={styles.footerLine} />
        </View>
      );
    }
    return null;
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <SkeletonLoader type="moment-card" count={3} />
        </View>
      );
    }
    return (
      <EmptyState
        icon="chatbubbles-outline"
        title="暂无动态"
        description="快来发布第一条动态吧"
      />
    );
  };

  // 发布按钮动画
  const fabScale = useSharedValue(1);
  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* 顶部渐变背景 */}
      <LinearGradient colors={['#f0fdf4', '#ffffff']} style={styles.headerGradient} />

      <FlatList
        data={moments}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#22c55e']} tintColor="#22c55e" />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* 发布按钮 */}
      <Animated.View style={[styles.fabContainer, fabAnimatedStyle]}>
        <Pressable
          onPress={() => router.push('/moment/create')}
          onPressIn={() => {
            fabScale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
          }}
          onPressOut={() => {
            fabScale.value = withSpring(1, { damping: 15, stiffness: 400 });
          }}
        >
          <LinearGradient colors={['#22c55e', '#16a34a']} style={styles.fab}>
            <Ionicons name="add" size={28} color="#fff" />
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}

// 标签组件
function TagChip({ item, router }: { item: any; router: any }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={() => router.push(`/square/tag/${item.name}`)}
        onPressIn={() => {
          scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 400 });
        }}
      >
        <LinearGradient colors={['#f0fdf4', '#dcfce7']} style={styles.tagChip}>
          <Text style={styles.tagHash}>#</Text>
          <Text style={styles.tagName}>{item.name}</Text>
          <Text style={styles.tagCount}>({item.count})</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 100,
  },
  headerContainer: {
    marginBottom: 8,
  },
  sortContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sortWrapper: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    padding: 4,
    alignSelf: 'flex-start',
  },
  sortButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sortButtonActive: {
    padding: 0,
  },
  sortButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sortText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  sortTextActive: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  tagList: {
    paddingHorizontal: 16,
    gap: 10,
    paddingBottom: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: 'rgba(34, 197, 94, 0.15)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  tagHash: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '600',
  },
  tagName: {
    fontSize: 14,
    color: '#15803d',
    fontWeight: '500',
    marginLeft: 2,
  },
  tagCount: {
    fontSize: 12,
    color: '#86efac',
    marginLeft: 4,
  },
  loadingContainer: {
    paddingHorizontal: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  footerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#dcfce7',
  },
  footerText: {
    fontSize: 13,
    color: '#9ca3af',
    marginHorizontal: 12,
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    borderRadius: 28,
    shadowColor: 'rgba(34, 197, 94, 0.4)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
