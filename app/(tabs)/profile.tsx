import { View, Text, ScrollView, Image, Alert, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useAuthStore } from '../../src/stores/auth';
import { useNotificationStore } from '../../src/stores/notification';
import { userApi } from '../../src/api/user';
import { articleApi } from '../../src/api/article';
import type { FollowStats } from '../../src/types';

type IconName = keyof typeof Ionicons.glyphMap;

interface MenuItem {
  id: string;
  title: string;
  icon: IconName;
  route?: string;
  badge?: number;
  color?: string;
  action?: () => void;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { stats } = useNotificationStore();
  const [followStats, setFollowStats] = useState<FollowStats | null>(null);
  const [articleCount, setArticleCount] = useState<number>(0);

  // 获取用户统计数据 - 每次页面获得焦点时刷新
  useFocusEffect(
    useCallback(() => {
      const fetchUserStats = async () => {
        if (isAuthenticated && user?.id) {
          try {
            // 获取关注统计
            const followResponse = await userApi.getFollowStats(user.id);
            if (followResponse.data) {
              setFollowStats(followResponse.data);
            }

            // 获取文章数量
            const articleResponse = await articleApi.getMyArticles({ page: 1, size: 1 }) as any;
            // 后端返回格式可能是: { data: { articles: [...] }, pagination: { total } }
            // 或: { data: { items: [...], total } }
            // 或: { data: [...], total }
            const total = articleResponse.pagination?.total
              || articleResponse.data?.total
              || articleResponse.total
              || (Array.isArray(articleResponse.data?.articles) ? articleResponse.data.articles.length : 0)
              || (Array.isArray(articleResponse.data?.items) ? articleResponse.data.items.length : 0)
              || 0;
            setArticleCount(total);
          } catch (error) {
            console.error('获取用户统计失败:', error);
          }
        }
      };
      fetchUserStats();
    }, [isAuthenticated, user?.id])
  );

  const handleLogout = () => {
    Alert.alert(
      '退出登录',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const menuItems: MenuItem[] = isAuthenticated
    ? [
        { id: 'notifications', title: '消息通知', icon: 'notifications-outline', route: '/notifications', badge: stats?.unread || 0, color: '#ec4899' },
        { id: 'favorites', title: '我的收藏', icon: 'bookmark-outline', route: '/user/favorites', color: '#f59e0b' },
        { id: 'articles', title: '我的文章', icon: 'document-text-outline', route: '/user/articles', color: '#0ea5e9' },
        { id: 'moments', title: '我的动态', icon: 'chatbubbles-outline', route: '/user/moments', color: '#22c55e' },
        { id: 'points', title: '我的积分', icon: 'diamond-outline', route: '/user/points', color: '#8b5cf6' },
        { id: 'settings', title: '设置', icon: 'settings-outline', route: '/settings', color: '#6b7280' },
      ]
    : [
        { id: 'settings', title: '设置', icon: 'settings-outline', route: '/settings', color: '#6b7280' },
      ];

  // 未登录状态
  if (!isAuthenticated) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#fdf2f8', '#ffffff']} style={styles.headerGradient} />

        {/* 未登录头部 */}
        <View style={styles.guestHeader}>
          <View style={styles.guestAvatarRing}>
            <LinearGradient colors={['#ec4899', '#f472b6', '#0ea5e9']} style={styles.guestAvatarGradient}>
              <View style={styles.guestAvatarInner}>
                <Ionicons name="person-outline" size={40} color="#d1d5db" />
              </View>
            </LinearGradient>
          </View>
          <Text style={styles.guestText}>登录后查看更多内容</Text>
          <Pressable onPress={() => router.push('/(auth)/login')}>
            <LinearGradient colors={['#ec4899', '#db2777']} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>立即登录</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* 菜单列表 */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <MenuItemComponent key={item.id} item={item} isLast={index === menuItems.length - 1} router={router} />
          ))}
        </View>
      </ScrollView>
    );
  }

  // 已登录状态
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#fdf2f8', '#fce7f3', '#ffffff']} style={styles.headerGradientLarge} />

      {/* 用户信息卡片 */}
      <View style={styles.userCard}>
        <Pressable style={styles.userInfo} onPress={() => router.push(`/user/${user?.id}`)}>
          <View style={styles.avatarRing}>
            <LinearGradient colors={['#ec4899', '#f472b6', '#0ea5e9']} style={styles.avatarGradient}>
              <View style={styles.avatarInner}>
                <Image
                  source={user?.avatar ? { uri: user.avatar } : require('../../assets/default-avatar.png')}
                  style={styles.avatar}
                />
              </View>
            </LinearGradient>
          </View>
          <View style={styles.userMeta}>
            <Text style={styles.userName}>{user?.nickname || user?.username}</Text>
            <Text style={styles.userBio} numberOfLines={1}>
              {user?.bio || '这个人很懒，什么都没写~'}
            </Text>
            {user?.expert_level && user.expert_level > 0 && (
              <View style={styles.expertBadgeWrapper}>
                <LinearGradient colors={['#0ea5e9', '#0284c7']} style={styles.expertBadge}>
                  <Ionicons name="shield-checkmark" size={12} color="#fff" />
                  <Text style={styles.expertText}>{user.expert_type || '认证专家'}</Text>
                </LinearGradient>
              </View>
            )}
          </View>
          <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
        </Pressable>

        {/* 数据统计 */}
        <View style={styles.statsContainer}>
          <StatItem label="关注" value={followStats?.following_count || 0} onPress={() => router.push(`/user/${user?.id}/following`)} />
          <View style={styles.statDivider} />
          <StatItem label="粉丝" value={followStats?.followers_count || 0} onPress={() => router.push(`/user/${user?.id}/followers`)} />
          <View style={styles.statDivider} />
          <StatItem label="文章" value={articleCount} onPress={() => router.push('/user/articles')} />
        </View>
      </View>

      {/* 菜单列表 */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <MenuItemComponent key={item.id} item={item} isLast={index === menuItems.length - 1} router={router} />
        ))}
      </View>

      {/* 退出登录 */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>退出登录</Text>
      </Pressable>

      {/* 底部间距 */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

// 统计项组件
function StatItem({ label, value, onPress }: { label: string; value: number; onPress: () => void }) {
  return (
    <Pressable style={styles.statItem} onPress={onPress}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Pressable>
  );
}

// 菜单项组件
function MenuItemComponent({ item, isLast, router }: { item: MenuItem; isLast: boolean; router: any }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={[styles.menuItem, !isLast && styles.menuItemBorder]}
        onPress={() => {
          if (item.action) {
            item.action();
          } else if (item.route) {
            router.push(item.route as any);
          }
        }}
        onPressIn={() => {
          scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 400 });
        }}
      >
        <View style={[styles.menuIconBg, { backgroundColor: `${item.color}15` }]}>
          <Ionicons name={item.icon} size={20} color={item.color} />
        </View>
        <Text style={styles.menuTitle}>{item.title}</Text>
        {item.badge && item.badge > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge > 99 ? '99+' : item.badge}</Text>
          </View>
        ) : null}
        <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  headerGradientLarge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
  },
  guestHeader: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
  },
  guestAvatarRing: {
    marginBottom: 16,
  },
  guestAvatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestAvatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestText: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
  },
  loginButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: 'rgba(236, 72, 153, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  userCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: 'rgba(236, 72, 153, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarRing: {
    marginRight: 16,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#fce7f3',
  },
  userMeta: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  userBio: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 8,
  },
  expertBadgeWrapper: {
    flexDirection: 'row',
  },
  expertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  expertText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#fce7f3',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#fce7f3',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
  },
  menuContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#ec4899',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    fontSize: 15,
    color: '#ef4444',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 32,
  },
});
