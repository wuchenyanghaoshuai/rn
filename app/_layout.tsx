import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../src/stores/auth';
import '../global.css';

// 创建 React Query 客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 分钟
      gcTime: 1000 * 60 * 30, // 30 分钟
    },
  },
});

export default function RootLayout() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // 初始化认证状态
    initialize();
  }, [initialize]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Stack
            initialRouteName="splash"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#e76f51',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerBackTitle: '返回',
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="splash"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(auth)"
              options={{
                headerShown: false,
                presentation: 'modal',
              }}
            />
            <Stack.Screen
              name="article/[id]"
              options={{
                title: '文章详情',
              }}
            />
            <Stack.Screen
              name="article/create"
              options={{
                title: '发布文章',
              }}
            />
            <Stack.Screen
              name="moment/[id]"
              options={{
                title: '动态详情',
              }}
            />
            <Stack.Screen
              name="moment/create"
              options={{
                title: '发布动态',
              }}
            />
            <Stack.Screen
              name="user/[id]"
              options={{
                title: '个人主页',
              }}
            />
            <Stack.Screen
              name="user/[id]/following"
              options={{
                title: '关注的人',
              }}
            />
            <Stack.Screen
              name="user/[id]/followers"
              options={{
                title: '粉丝',
              }}
            />
            <Stack.Screen
              name="user/favorites"
              options={{
                title: '我的收藏',
              }}
            />
            <Stack.Screen
              name="user/articles"
              options={{
                title: '我的文章',
              }}
            />
            <Stack.Screen
              name="user/moments"
              options={{
                title: '我的动态',
              }}
            />
            <Stack.Screen
              name="user/points"
              options={{
                title: '我的积分',
              }}
            />
            <Stack.Screen
              name="user/edit"
              options={{
                title: '编辑资料',
              }}
            />
            <Stack.Screen
              name="user/password"
              options={{
                title: '修改密码',
              }}
            />
            <Stack.Screen
              name="user/bind-phone"
              options={{
                title: '绑定手机号',
              }}
            />
            <Stack.Screen
              name="search"
              options={{
                title: '搜索',
                presentation: 'modal',
              }}
            />
            <Stack.Screen
              name="notifications"
              options={{
                title: '消息通知',
              }}
            />
            <Stack.Screen
              name="settings"
              options={{
                title: '设置',
              }}
            />
          </Stack>
          <StatusBar style="light" />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
