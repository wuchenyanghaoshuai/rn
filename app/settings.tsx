import { View, Text, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useAuthStore } from '../src/stores/auth';
import Constants from 'expo-constants';

type IconName = keyof typeof Ionicons.glyphMap;

interface SettingItem {
  id: string;
  title: string;
  icon: IconName;
  type: 'navigate' | 'switch' | 'action';
  route?: string;
  value?: boolean;
  onPress?: () => void;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      '清除缓存',
      '确定要清除本地缓存吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            // 清除缓存逻辑
            Alert.alert('提示', '缓存已清除');
          },
        },
      ]
    );
  };

  const accountSettings: SettingItem[] = isAuthenticated
    ? [
        {
          id: 'profile',
          title: '编辑资料',
          icon: 'person-outline',
          type: 'navigate',
          route: '/user/edit',
        },
        {
          id: 'password',
          title: '修改密码',
          icon: 'lock-closed-outline',
          type: 'navigate',
          route: '/user/password',
        },
        {
          id: 'bindPhone',
          title: '绑定手机',
          icon: 'phone-portrait-outline',
          type: 'navigate',
          route: '/user/bind-phone',
        },
      ]
    : [];

  const generalSettings: SettingItem[] = [
    {
      id: 'notifications',
      title: '消息通知',
      icon: 'notifications-outline',
      type: 'switch',
      value: notifications,
      onPress: () => setNotifications(!notifications),
    },
    {
      id: 'darkMode',
      title: '深色模式',
      icon: 'moon-outline',
      type: 'switch',
      value: darkMode,
      onPress: () => setDarkMode(!darkMode),
    },
    {
      id: 'clearCache',
      title: '清除缓存',
      icon: 'trash-outline',
      type: 'action',
      onPress: handleClearCache,
    },
  ];

  const aboutSettings: SettingItem[] = [
    {
      id: 'about',
      title: '关于我们',
      icon: 'information-circle-outline',
      type: 'navigate',
      route: '/about',
    },
    {
      id: 'privacy',
      title: '隐私政策',
      icon: 'shield-checkmark-outline',
      type: 'navigate',
      route: '/privacy',
    },
    {
      id: 'terms',
      title: '用户协议',
      icon: 'document-text-outline',
      type: 'navigate',
      route: '/terms',
    },
    {
      id: 'feedback',
      title: '意见反馈',
      icon: 'chatbox-outline',
      type: 'navigate',
      route: '/feedback',
    },
  ];

  const renderSettingItem = (item: SettingItem, isLast: boolean) => (
    <TouchableOpacity
      key={item.id}
      className={`flex-row items-center px-4 py-4 ${
        !isLast ? 'border-b border-gray-100' : ''
      }`}
      onPress={() => {
        if (item.type === 'navigate' && item.route) {
          router.push(item.route as any);
        } else if (item.onPress) {
          item.onPress();
        }
      }}
      disabled={item.type === 'switch'}
    >
      <Ionicons name={item.icon} size={22} color="#6b7280" />
      <Text className="flex-1 ml-3 text-gray-700">{item.title}</Text>
      {item.type === 'switch' ? (
        <Switch
          value={item.value}
          onValueChange={item.onPress}
          trackColor={{ false: '#d1d5db', true: '#fca5a5' }}
          thumbColor={item.value ? '#e76f51' : '#f4f4f5'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
      )}
    </TouchableOpacity>
  );

  const renderSection = (title: string, items: SettingItem[]) => {
    if (items.length === 0) return null;

    return (
      <View className="mt-4">
        <Text className="text-gray-400 text-sm px-4 mb-2">{title}</Text>
        <View className="bg-white">
          {items.map((item, index) =>
            renderSettingItem(item, index === items.length - 1)
          )}
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: '设置' }} />

      <ScrollView className="flex-1 bg-background">
        {/* 账户设置 */}
        {renderSection('账户设置', accountSettings)}

        {/* 通用设置 */}
        {renderSection('通用设置', generalSettings)}

        {/* 关于 */}
        {renderSection('关于', aboutSettings)}

        {/* 退出登录 */}
        {isAuthenticated && (
          <TouchableOpacity
            className="mt-6 mx-4 bg-white py-4 rounded-xl items-center"
            onPress={handleLogout}
          >
            <Text className="text-red-500 font-medium">退出登录</Text>
          </TouchableOpacity>
        )}

        {/* 版本信息 */}
        <View className="items-center py-8">
          <Text className="text-gray-400 text-sm">
            GoDad v{Constants.expoConfig?.version || '1.0.0'}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}
