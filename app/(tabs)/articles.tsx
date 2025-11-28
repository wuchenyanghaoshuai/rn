import { View, Text, FlatList, RefreshControl, StyleSheet, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { articleApi } from '../../src/api/article';
import { categoryApi } from '../../src/api/category';
import ArticleCard from '../../src/components/ArticleCard';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import EmptyState from '../../src/components/EmptyState';
import { SkeletonLoader } from '../../src/components/ui';
import type { Article } from '../../src/types';

export default function ArticlesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    params.category ? Number(params.category) : null
  );
  const [refreshing, setRefreshing] = useState(false);

  // 获取分类列表
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getWithCount(),
    select: (data) => data.data?.categories || data.data || [],
  });

  // 获取文章列表
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['articles', selectedCategory],
    queryFn: ({ pageParam = 1 }) =>
      articleApi.getList({
        page: pageParam,
        size: 20,
        category_id: selectedCategory || undefined,
        status: 1,
      }),
    getNextPageParam: (lastPage) => {
      const { page = 1, total_pages = 1 } = (lastPage as any).pagination || (lastPage as any).data || {};
      return page < total_pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const articles =
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

  const renderItem = ({ item }: { item: Article }) => (
    <ArticleCard article={item} style={{ marginHorizontal: 16, marginBottom: 16 }} />
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* 分类筛选 */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[{ id: null, name: '全部' }, ...(Array.isArray(categories) ? categories : [])]}
        keyExtractor={(item) => String(item.id || 'all')}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item, index }) => (
          <CategoryChip
            item={item}
            isSelected={selectedCategory === item.id}
            onSelect={() => setSelectedCategory(item.id)}
            index={index}
          />
        )}
      />
    </View>
  );

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return <LoadingSpinner size="small" />;
    }
    if (!hasNextPage && articles.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <View style={styles.footerLine} />
          <Text style={styles.footerText}>没有更多文章了</Text>
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
          <SkeletonLoader type="article-card" count={3} />
        </View>
      );
    }
    return (
      <EmptyState
        icon="document-text-outline"
        title="暂无文章"
        description="该分类下还没有文章"
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
      <LinearGradient colors={['#fdf2f8', '#ffffff']} style={styles.headerGradient} />

      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ec4899']} tintColor="#ec4899" />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* 发布按钮 */}
      <Animated.View style={[styles.fabContainer, fabAnimatedStyle]}>
        <Pressable
          onPress={() => router.push('/article/create')}
          onPressIn={() => {
            fabScale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
          }}
          onPressOut={() => {
            fabScale.value = withSpring(1, { damping: 15, stiffness: 400 });
          }}
        >
          <LinearGradient colors={['#ec4899', '#db2777']} style={styles.fab}>
            <Ionicons name="add" size={28} color="#fff" />
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}

// 分类筛选组件
function CategoryChip({
  item,
  isSelected,
  onSelect,
  index,
}: {
  item: any;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onSelect}
        onPressIn={() => {
          scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 400 });
        }}
      >
        {isSelected ? (
          <LinearGradient colors={['#ec4899', '#db2777']} style={styles.categoryChipSelected}>
            <Text style={styles.categoryTextSelected}>{item.name}</Text>
          </LinearGradient>
        ) : (
          <View style={styles.categoryChip}>
            <Text style={styles.categoryText}>{item.name}</Text>
          </View>
        )}
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
    height: 120,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 100,
  },
  headerContainer: {
    marginBottom: 16,
  },
  categoryList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fce7f3',
    shadowColor: 'rgba(236, 72, 153, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryChipSelected: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: 'rgba(236, 72, 153, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  categoryTextSelected: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
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
    backgroundColor: '#fce7f3',
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
    shadowColor: 'rgba(236, 72, 153, 0.4)',
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
