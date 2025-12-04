/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 首页 - 方案A设计系统重构版
 */

import { View, Text, ScrollView, RefreshControl, Image, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { articleApi } from '../../src/api/article';
import { categoryApi } from '../../src/api/category';
import { useAuthStore } from '../../src/stores/auth';
import ArticleCard from '../../src/components/ArticleCard';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import { SkeletonLoader } from '../../src/components/ui';
import { Gradients, Colors } from '@/constants/colors';

type IconName = keyof typeof Ionicons.glyphMap;

// 排名颜色配置
const RANK_COLORS = [
  ['#fbbf24', '#f59e0b'], // 金色 1st
  ['#9ca3af', '#6b7280'], // 银色 2nd
  ['#fb923c', '#ea580c'], // 铜色 3rd
];

// 工具快捷入口配置
interface QuickTool {
  id: string;
  name: string;
  icon: IconName;
  color: string;
  route: string;
}

const QUICK_TOOLS: QuickTool[] = [
  { id: 'baby-naming', name: '宝宝起名', icon: 'sparkles-outline', color: Colors.primary[400], route: '/tools/baby-naming' },
  { id: 'height-prediction', name: '身高预测', icon: 'trending-up-outline', color: Colors.mint.DEFAULT, route: '/tools/height-prediction' },
  { id: 'vaccine-schedule', name: '疫苗日程', icon: 'medkit-outline', color: Colors.rose.DEFAULT, route: '/tools/vaccine-schedule' },
  { id: 'more', name: '更多工具', icon: 'grid-outline', color: Colors.lavender.DEFAULT, route: '/tools' },
];

// 工具快捷入口卡片组件 (需要在 HomeScreen 之前定义以避免 Hermes 提升问题)
function ToolQuickCard({ tool, router }: { tool: QuickTool; router: any }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={() => router.push(tool.route as any)}
        onPressIn={() => { scale.value = withSpring(0.95, { damping: 15, stiffness: 400 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 400 }); }}
        style={styles.toolCard}
      >
        <View style={[styles.toolIconWrapper, { backgroundColor: `${tool.color}15` }]}>
          <Ionicons name={tool.icon} size={24} color={tool.color} />
        </View>
        <Text style={styles.toolName}>{tool.name}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [refreshing, setRefreshing] = useState(false);

  // 获取热门文章
  const {
    data: hotArticles,
    isLoading: hotLoading,
    refetch: refetchHot,
  } = useQuery({
    queryKey: ['hotArticles'],
    queryFn: () => articleApi.getHot(5),
    select: (data) => data.data?.articles || [],
  });

  // 获取最新文章
  const {
    data: latestArticles,
    isLoading: latestLoading,
    refetch: refetchLatest,
  } = useQuery({
    queryKey: ['latestArticles'],
    queryFn: () => articleApi.getList({ page: 1, size: 10 }),
    select: (data) => {
      if (Array.isArray(data.data)) {
        return data.data;
      }
      return data.data?.items || [];
    },
  });

  // 获取分类列表
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getWithCount(),
    select: (data) => data.data || [],
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchHot(), refetchLatest()]);
    setRefreshing(false);
  }, [refetchHot, refetchLatest]);

  const isLoading = hotLoading || latestLoading;
  const hotList = Array.isArray(hotArticles) ? hotArticles : [];

  // 搜索栏动画
  const searchScale = useSharedValue(1);
  const searchAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: searchScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* 顶部渐变背景 - 方案A柔和粉彩 */}
      <LinearGradient
        colors={Gradients.pageBackground}
        style={styles.headerGradient}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary[400]]}
            tintColor={Colors.primary[400]}
          />
        }
      >
        {/* 搜索栏 */}
        <Animated.View style={[styles.searchWrapper, searchAnimatedStyle]}>
          <Pressable
            style={styles.searchBar}
            onPress={() => router.push('/search')}
            onPressIn={() => {
              searchScale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
            }}
            onPressOut={() => {
              searchScale.value = withSpring(1, { damping: 15, stiffness: 400 });
            }}
          >
            <LinearGradient colors={Gradients.primary} style={styles.searchIcon}>
              <Search size={16} color="#fff" />
            </LinearGradient>
            <Text style={styles.searchPlaceholder}>搜索文章、用户...</Text>
          </Pressable>
        </Animated.View>

        {/* 分类快捷入口 */}
        {categories && categories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.slice(0, 8).map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} router={router} />
            ))}
          </ScrollView>
        )}

        {/* 工具快捷入口 */}
        <View style={styles.toolsSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <LinearGradient colors={['#f59e0b', '#fbbf24']} style={styles.sectionIconBg}>
                <Ionicons name="construct" size={14} color="#fff" />
              </LinearGradient>
              <Text style={styles.sectionTitle}>育儿工具</Text>
            </View>
            <Pressable onPress={() => router.push('/tools')} style={styles.moreButton}>
              <Text style={styles.moreText}>查看全部</Text>
              <Ionicons name="chevron-forward" size={14} color="#FF9B8A" />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.toolsContent}
          >
            {QUICK_TOOLS.map((tool) => (
              <ToolQuickCard key={tool.id} tool={tool} router={router} />
            ))}
          </ScrollView>
        </View>

        {/* 热门文章 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <LinearGradient colors={['#FF9B8A', '#f472b6']} style={styles.sectionIconBg}>
                <Ionicons name="flame" size={14} color="#fff" />
              </LinearGradient>
              <Text style={styles.sectionTitle}>热门文章</Text>
            </View>
            <Pressable onPress={() => router.push('/articles')} style={styles.moreButton}>
              <Text style={styles.moreText}>查看更多</Text>
              <Ionicons name="chevron-forward" size={14} color="#FF9B8A" />
            </Pressable>
          </View>

          {isLoading ? (
            <SkeletonLoader type="list-item" count={3} />
          ) : (
            <View style={styles.hotList}>
              {hotList.slice(0, 3).map((article, index) => (
                <HotArticleCard key={article.id} article={article} index={index} router={router} />
              ))}
            </View>
          )}
        </View>

        {/* 最新文章 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <LinearGradient colors={['#0ea5e9', '#38bdf8']} style={styles.sectionIconBg}>
                <Ionicons name="time" size={14} color="#fff" />
              </LinearGradient>
              <Text style={styles.sectionTitle}>最新文章</Text>
            </View>
          </View>

          {isLoading ? (
            <SkeletonLoader type="article-card" count={2} />
          ) : (
            <View style={styles.articleList}>
              {latestArticles?.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </View>
          )}
        </View>

        {/* 未登录提示 */}
        {!isAuthenticated && (
          <View style={styles.welcomeCard}>
            <LinearGradient
              colors={['#fdf2f8', '#f0f9ff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.welcomeGradient}
            >
              <View style={styles.welcomeContent}>
                <View style={styles.welcomeTextArea}>
                  <Text style={styles.welcomeTitle}>欢迎来到 GoDad</Text>
                  <Text style={styles.welcomeDesc}>登录后解锁更多育儿知识和社区功能</Text>
                </View>
                <Pressable
                  onPress={() => router.push('/(auth)/login')}
                  style={({ pressed }) => [styles.loginButton, pressed && styles.loginButtonPressed]}
                >
                  <LinearGradient colors={['#FF9B8A', '#db2777']} style={styles.loginButtonGradient}>
                    <Text style={styles.loginButtonText}>立即登录</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* 底部安全区 */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

// 分类卡片组件
function CategoryCard({ category, index, router }: { category: any; index: number; router: any }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // 不同分类使用不同颜色
  const colors = [
    ['#fdf2f8', '#fce7f3'], // pink
    ['#f0f9ff', '#e0f2fe'], // blue
    ['#f0fdf4', '#dcfce7'], // green
    ['#fef7f0', '#fef3c7'], // warm
  ];
  const iconColors = ['#FF9B8A', '#0ea5e9', '#22c55e', '#f59e0b'];
  const colorIndex = index % 4;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={() => router.push(`/articles?category=${category.id}`)}
        onPressIn={() => {
          scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 400 });
        }}
      >
        <LinearGradient colors={colors[colorIndex]} style={styles.categoryCard}>
          <View style={[styles.categoryIcon, { backgroundColor: `${iconColors[colorIndex]}20` }]}>
            <Ionicons name="folder" size={20} color={iconColors[colorIndex]} />
          </View>
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={[styles.categoryCount, { color: iconColors[colorIndex] }]}>
            {category.article_count || 0}篇
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

// 热门文章卡片组件
function HotArticleCard({ article, index, router }: { article: any; index: number; router: any }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.hotCardWrapper, animatedStyle]}>
      <Pressable
        style={styles.hotCard}
        onPress={() => router.push(`/article/${article.id}`)}
        onPressIn={() => { scale.value = withSpring(0.98, { damping: 15, stiffness: 400 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 400 }); }}
      >
        {/* 排名徽章 */}
        <LinearGradient colors={RANK_COLORS[index] || ['#d1d5db', '#9ca3af']} style={styles.rankBadge}>
          <Text style={styles.rankText}>{index + 1}</Text>
        </LinearGradient>

        {/* 文章信息 */}
        <View style={styles.hotCardContent}>
          <Text style={styles.hotTitle} numberOfLines={2}>
            {article.title}
          </Text>
          <View style={styles.hotMeta}>
            <Text style={styles.hotAuthor}>{article.author?.nickname || '匿名'}</Text>
            <View style={styles.hotStatDot} />
            <Ionicons name="eye-outline" size={12} color="#9ca3af" />
            <Text style={styles.hotStat}>{article.view_count}</Text>
            <View style={styles.hotStatDot} />
            <Ionicons name="heart" size={12} color="#f472b6" />
            <Text style={styles.hotStat}>{article.like_count}</Text>
          </View>
        </View>

        {/* 封面图 */}
        {article.cover_image && (
          <Image source={{ uri: article.cover_image }} style={styles.hotImage} resizeMode="cover" />
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
    height: 280,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: 'rgba(236, 72, 153, 0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(251, 207, 232, 0.5)',
  },
  searchIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 15,
    color: '#9ca3af',
  },
  categoriesScroll: {
    marginTop: 8,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    width: 90,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 11,
  },
  toolsSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  toolsContent: {
    gap: 12,
  },
  toolCard: {
    width: 80,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(251, 207, 232, 0.2)',
  },
  toolIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  toolName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIconBg: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreText: {
    fontSize: 14,
    color: '#FF9B8A',
    fontWeight: '500',
  },
  hotList: {
    gap: 12,
  },
  hotCardWrapper: {
    borderRadius: 16,
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  hotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(251, 207, 232, 0.3)',
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  hotCardContent: {
    flex: 1,
    marginRight: 12,
  },
  hotTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    lineHeight: 22,
    marginBottom: 6,
  },
  hotMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hotAuthor: {
    fontSize: 12,
    color: '#9ca3af',
  },
  hotStatDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#d1d5db',
    marginHorizontal: 6,
  },
  hotStat: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 2,
  },
  hotImage: {
    width: 72,
    height: 54,
    borderRadius: 10,
    backgroundColor: '#fce7f3',
  },
  articleList: {
    gap: 16,
  },
  welcomeCard: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: 'rgba(236, 72, 153, 0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  welcomeGradient: {
    padding: 20,
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeTextArea: {
    flex: 1,
    marginRight: 16,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  welcomeDesc: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  loginButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  loginButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  loginButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 24,
  },
});
