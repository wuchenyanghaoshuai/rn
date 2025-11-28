import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNotificationStore } from '../../src/stores/notification';
import { useAuthStore } from '../../src/stores/auth';
import { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface RouteState {
  key: string;
  name: string;
}

interface TabBarProps {
  state: {
    index: number;
    routes: RouteState[];
  };
  navigation: {
    emit: (event: { type: string; target: string; canPreventDefault: boolean }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
  descriptors: Record<string, unknown>;
}

type IconName = keyof typeof Ionicons.glyphMap;

interface TabConfig {
  name: string;
  title: string;
  icon: IconName;
  iconFocused: IconName;
}

const TAB_CONFIG: TabConfig[] = [
  { name: 'index', title: '首页', icon: 'home-outline', iconFocused: 'home' },
  { name: 'articles', title: '文章', icon: 'document-text-outline', iconFocused: 'document-text' },
  { name: 'ai', title: '问AI', icon: 'sparkles-outline', iconFocused: 'sparkles' },
  { name: 'square', title: '广场', icon: 'chatbubbles-outline', iconFocused: 'chatbubbles' },
  { name: 'profile', title: '我的', icon: 'person-outline', iconFocused: 'person' },
];

export default function TabLayout() {
  const stats = useNotificationStore((state) => state.stats);
  const fetchStats = useNotificationStore((state) => state.fetchStats);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated, fetchStats]);

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} unreadCount={stats?.unread || 0} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: 'rgba(236, 72, 153, 0.1)',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 8,
          elevation: 4,
        },
        headerTintColor: '#ec4899',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          headerTitle: 'GoDad',
          headerTitleStyle: {
            color: '#ec4899',
            fontWeight: '800',
            fontSize: 22,
          },
        }}
      />
      <Tabs.Screen
        name="articles"
        options={{
          title: '文章',
          headerTitleStyle: {
            color: '#1f2937',
            fontWeight: '700',
          },
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: '问AI',
          headerTitle: 'AI助手',
          headerTitleStyle: {
            color: '#ec4899',
            fontWeight: '700',
          },
        }}
      />
      <Tabs.Screen
        name="square"
        options={{
          title: '广场',
          headerTitleStyle: {
            color: '#1f2937',
            fontWeight: '700',
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          headerTitleStyle: {
            color: '#1f2937',
            fontWeight: '700',
          },
        }}
      />
      {/* 隐藏工具Tab，但保留页面可从其他入口访问 */}
      <Tabs.Screen
        name="tools"
        options={{
          href: null,
          title: '工具',
        }}
      />
    </Tabs>
  );
}

function CustomTabBar({ state, descriptors, navigation, unreadCount }: TabBarProps & { unreadCount: number }) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 10);

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: bottomPadding }]}>
      {state.routes.map((route, index) => {
        // 跳过隐藏的 tools tab
        if (route.name === 'tools') return null;

        const isFocused = state.index === index;
        const isAiTab = route.name === 'ai';
        const tabConfig = TAB_CONFIG.find((t) => t.name === route.name);

        if (!tabConfig) return null;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (isAiTab) {
          return <AITabButton key={route.key} focused={isFocused} onPress={onPress} />;
        }

        return (
          <TabItem
            key={route.key}
            config={tabConfig}
            focused={isFocused}
            onPress={onPress}
            badge={route.name === 'profile' && unreadCount > 0 ? unreadCount : undefined}
          />
        );
      })}
    </View>
  );
}

function TabItem({ config, focused, onPress, badge }: { config: TabConfig; focused: boolean; onPress: () => void; badge?: number }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const color = focused ? '#ec4899' : '#9ca3af';
  const iconName = focused ? config.iconFocused : config.icon;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.9, { damping: 15, stiffness: 400 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 400 }); }}
      style={styles.tabItem}
    >
      <Animated.View style={[styles.tabItemInner, animatedStyle]}>
        <View style={styles.iconWrapper}>
          {focused ? (
            <LinearGradient colors={['rgba(236, 72, 153, 0.15)', 'rgba(236, 72, 153, 0.05)']} style={styles.activeIconBg}>
              <Ionicons name={iconName} size={22} color={color} />
            </LinearGradient>
          ) : (
            <Ionicons name={iconName} size={22} color={color} />
          )}
          {badge !== undefined && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.tabLabel, { color }]}>{config.title}</Text>
      </Animated.View>
    </Pressable>
  );
}

function AITabButton({ focused, onPress }: { focused: boolean; onPress: () => void }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.9, { damping: 15, stiffness: 400 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 400 }); }}
      style={styles.aiTabItem}
    >
      <Animated.View style={[styles.aiButtonWrapper, animatedStyle]}>
        <LinearGradient
          colors={focused ? ['#ec4899', '#db2777'] : ['#f472b6', '#ec4899']}
          style={styles.aiButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="sparkles" size={26} color="#fff" />
        </LinearGradient>
      </Animated.View>
      <Text style={[styles.aiLabel, focused && styles.aiLabelFocused]}>问AI</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingTop: 8,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    shadowColor: 'rgba(236, 72, 153, 0.15)',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
    borderTopWidth: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemInner: {
    alignItems: 'center',
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
  },
  activeIconBg: {
    width: 44,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ec4899',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  aiTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  aiButtonWrapper: {
    marginTop: -24,
  },
  aiButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    ...Platform.select({
      ios: {
        borderWidth: 4,
        borderColor: '#fff',
      },
      android: {
        borderWidth: 3,
        borderColor: '#fff',
      },
    }),
  },
  aiLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
    marginTop: 4,
  },
  aiLabelFocused: {
    color: '#ec4899',
  },
});
