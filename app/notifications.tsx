import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNotificationStore } from '../src/stores/notification';
import LoadingSpinner from '../src/components/LoadingSpinner';
import EmptyState from '../src/components/EmptyState';
import type { Notification } from '../src/types';

export default function NotificationsScreen() {
  const router = useRouter();
  const {
    notifications,
    isLoading,
    hasMore,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();

  const [refreshing, setRefreshing] = useState(false);

  // 初始加载
  useState(() => {
    fetchNotifications(true);
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications(true);
    setRefreshing(false);
  }, [fetchNotifications]);

  const loadMore = () => {
    if (hasMore && !isLoading) {
      fetchNotifications();
    }
  };

  const handlePress = async (notification: Notification) => {
    // 标记为已读
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    // 根据通知类型跳转
    if (notification.related_type === 'article' && notification.related_id) {
      router.push(`/article/${notification.related_id}`);
    } else if (notification.related_type === 'moment' && notification.related_id) {
      router.push(`/moment/${notification.related_id}`);
    } else if (notification.related_type === 'user' && notification.related_id) {
      router.push(`/user/${notification.related_id}`);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes <= 0 ? '刚刚' : `${minutes}分钟前`;
      }
      return `${hours}小时前`;
    } else if (days < 7) {
      return `${days}天前`;
    }
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return { name: 'heart', color: '#ef4444' };
      case 'comment':
        return { name: 'chatbubble', color: '#3b82f6' };
      case 'follow':
        return { name: 'person-add', color: '#22c55e' };
      case 'system':
        return { name: 'megaphone', color: '#f59e0b' };
      default:
        return { name: 'notifications', color: '#6b7280' };
    }
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const icon = getNotificationIcon(item.type);

    return (
      <TouchableOpacity
        className={`flex-row p-4 border-b border-gray-100 ${
          !item.is_read ? 'bg-primary-50' : 'bg-white'
        }`}
        onPress={() => handlePress(item)}
      >
        {/* 发送者头像或图标 */}
        {item.sender ? (
          <Image
            source={
              item.sender.avatar
                ? { uri: item.sender.avatar }
                : require('../assets/default-avatar.png')
            }
            className="w-12 h-12 rounded-full bg-gray-100"
          />
        ) : (
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: `${icon.color}20` }}
          >
            <Ionicons name={icon.name as any} size={24} color={icon.color} />
          </View>
        )}

        <View className="flex-1 ml-3">
          <Text className="text-gray-800 font-medium">{item.title}</Text>
          <Text className="text-gray-500 mt-1" numberOfLines={2}>
            {item.content}
          </Text>
          <Text className="text-gray-400 text-xs mt-1">
            {formatDate(item.created_at)}
          </Text>
        </View>

        {/* 未读标记 */}
        {!item.is_read && (
          <View className="w-2.5 h-2.5 bg-primary-500 rounded-full self-start mt-2" />
        )}
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (isLoading && notifications.length > 0) {
      return <LoadingSpinner size="small" />;
    }
    if (!hasMore && notifications.length > 0) {
      return (
        <Text className="text-center text-gray-400 py-4">没有更多通知了</Text>
      );
    }
    return null;
  };

  const renderEmpty = () => {
    if (isLoading) {
      return <LoadingSpinner fullScreen />;
    }
    return (
      <EmptyState
        icon="notifications-outline"
        title="暂无通知"
        description="有新消息时会在这里显示"
      />
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '消息通知',
          headerRight: () => (
            <TouchableOpacity onPress={markAllAsRead}>
              <Text className="text-white">全部已读</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <View className="flex-1 bg-background">
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#e76f51']} />
          }
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </View>
    </>
  );
}
