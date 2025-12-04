/**
 * @author Julian Wu
 * @date 2024-12-03
 * @description 底部Tab导航布局 - 使用Lucide图标 + 胶囊指示器设计
 */

import { Tabs } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNotificationStore } from '../../src/stores/notification';
import { useAuthStore } from '../../src/stores/auth';
import { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabBarIcon, TabIconName } from '../../src/components/navigation';
import { Colors } from '../../src/constants/colors';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CustomTabBarProps = any;

interface TabConfig {
  name: string;
  iconKey: TabIconName;
  title: string;
}

const TAB_CONFIG: TabConfig[] = [
  { name: 'index', iconKey: 'home', title: '首页' },
  { name: 'articles', iconKey: 'articles', title: '文章' },
  { name: 'ai', iconKey: 'ai', title: '问AI' },
  { name: 'square', iconKey: 'square', title: '广场' },
  { name: 'profile', iconKey: 'profile', title: '我的' },
];

const TAB_COLORS = {
  active: Colors.primary[400],
  inactive: '#9CA3AF',
};

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
          shadowColor: 'rgba(255, 155, 138, 0.1)',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 8,
          elevation: 4,
        },
        headerTintColor: Colors.primary[400],
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
            color: Colors.primary[500],
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
            color: Colors.primary[500],
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

function CustomTabBar({ state, descriptors, navigation, unreadCount }: CustomTabBarProps & { unreadCount: number }) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: bottomPadding }]}>
      {state.routes.map((route: RouteState, index: number) => {
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

interface TabItemProps {
  config: TabConfig;
  focused: boolean;
  onPress: () => void;
  badge?: number;
}

function TabItem({ config, focused, onPress, badge }: TabItemProps) {
  const scale = useSharedValue(1);

  const color = focused ? TAB_COLORS.active : TAB_COLORS.inactive;

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabItem}
    >
      <Animated.View style={[styles.tabItemInner, containerStyle]}>
        <View style={styles.iconContainer}>
          <TabBarIcon name={config.iconKey} focused={focused} color={color} />
          {badge !== undefined && badge > 0 && (
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

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.aiTabItem}
    >
      <Animated.View style={[styles.aiButtonWrapper, animatedStyle]}>
        <LinearGradient
          colors={focused ? [Colors.primary[500], Colors.primary[600]] : [Colors.primary[400], Colors.primary[500]]}
          style={styles.aiButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Sparkles size={24} color="#fff" strokeWidth={2} />
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
    paddingTop: 4,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    shadowColor: 'rgba(255, 155, 138, 0.12)',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 12,
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
  iconContainer: {
    position: 'relative',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  aiTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  aiButtonWrapper: {
    marginTop: -18,
  },
  aiButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    ...Platform.select({
      ios: {
        borderWidth: 3,
        borderColor: '#fff',
      },
      android: {
        borderWidth: 2,
        borderColor: '#fff',
      },
    }),
  },
  aiLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 2,
  },
  aiLabelFocused: {
    color: Colors.primary[400],
    fontWeight: '600',
  },
});
