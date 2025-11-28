import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { momentApi } from '../../src/api/moment';
import { useAuthStore } from '../../src/stores/auth';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import EmptyState from '../../src/components/EmptyState';
import ReportModal from '../../src/components/ReportModal';
import type { MomentReply } from '../../src/types';

export default function MomentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();

  const [refreshing, setRefreshing] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyTo, setReplyTo] = useState<MomentReply | null>(null);
  const [reportVisible, setReportVisible] = useState(false);

  const momentId = Number(id);

  // 获取瞬间详情
  const {
    data: moment,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['moment', momentId],
    queryFn: () => momentApi.getDetail(momentId),
    select: (data) => data.data,
    enabled: !!momentId,
  });

  const isOwner = user?.id === moment?.user_id;

  // 删除动态
  const deleteMutation = useMutation({
    mutationFn: () => momentApi.delete(momentId),
    onSuccess: () => {
      Alert.alert('删除成功', '', [
        { text: '确定', onPress: () => router.back() },
      ]);
    },
    onError: (error: any) => {
      Alert.alert('删除失败', error.message || '请稍后重试');
    },
  });

  const handleDelete = () => {
    Alert.alert('确认删除', '确定要删除这条动态吗？此操作不可恢复。', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => deleteMutation.mutate(),
      },
    ]);
  };

  const showActionSheet = () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }

    const options = isOwner ? ['删除', '取消'] : ['举报', '取消'];
    const destructiveButtonIndex = isOwner ? 0 : undefined;
    const cancelButtonIndex = 1;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex,
        },
        (buttonIndex) => {
          if (isOwner && buttonIndex === 0) {
            handleDelete();
          } else if (!isOwner && buttonIndex === 0) {
            setReportVisible(true);
          }
        }
      );
    } else {
      if (isOwner) {
        handleDelete();
      } else {
        Alert.alert('操作', '', [
          { text: '举报', onPress: () => setReportVisible(true) },
          { text: '取消', style: 'cancel' },
        ]);
      }
    }
  };

  // 获取回复列表
  const {
    data: repliesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['momentReplies', momentId],
    queryFn: ({ pageParam = 1 }) =>
      momentApi.getReplies(momentId, { page: pageParam, size: 20 }),
    getNextPageParam: (lastPage) => {
      const { page = 1, total_pages = 1 } = (lastPage as any).pagination || (lastPage as any).data || {};
      return page < total_pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!momentId,
  });

  const replies =
    repliesData?.pages.flatMap((page) => {
      if (Array.isArray((page as any).data)) {
        return (page as any).data;
      }
      const items = (page as any).data?.items || [];
      return Array.isArray(items) ? items : [];
    }) || [];

  // 点赞
  const likeMutation = useMutation({
    mutationFn: () => {
      if (moment?.is_liked) {
        return momentApi.unlike(momentId);
      }
      return momentApi.like(momentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moment', momentId] });
    },
  });

  // 回复
  const replyMutation = useMutation({
    mutationFn: () =>
      momentApi.createReply(momentId, {
        content: replyText,
        parent_reply_id: replyTo?.id,
      }),
    onSuccess: () => {
      setReplyText('');
      setReplyTo(null);
      queryClient.invalidateQueries({ queryKey: ['momentReplies', momentId] });
      queryClient.invalidateQueries({ queryKey: ['moment', momentId] });
    },
    onError: (error: any) => {
      Alert.alert('回复失败', error.message || '请稍后重试');
    },
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleLike = () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }
    likeMutation.mutate();
  };

  const handleReply = () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }
    if (!replyText.trim()) {
      Alert.alert('提示', '请输入回复内容');
      return;
    }
    replyMutation.mutate();
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
    return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="加载中..." />;
  }

  if (error || !moment) {
    return (
      <EmptyState
        icon="chatbubbles-outline"
        title="动态不存在"
        description="该动态可能已被删除"
        actionText="返回"
        onAction={() => router.back()}
      />
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: '动态详情',
          headerRight: () => (
            <TouchableOpacity onPress={showActionSheet} className="p-2">
              <Ionicons name="ellipsis-horizontal" size={24} color="#374151" />
            </TouchableOpacity>
          ),
        }}
      />

      <View className="flex-1 bg-white">
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#e76f51']} />
          }
        >
          <View className="p-4">
            {/* 作者信息 */}
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => router.push(`/user/${moment.author?.id}`)}
            >
              <Image
                source={
                  moment.author?.avatar
                    ? { uri: moment.author.avatar }
                    : require('../../assets/default-avatar.png')
                }
                className="w-12 h-12 rounded-full bg-gray-100"
              />
              <View className="ml-3 flex-1">
                <View className="flex-row items-center">
                  <Text className="text-gray-800 font-semibold">
                    {moment.author?.nickname || moment.author?.username}
                  </Text>
                  {moment.author?.expert_level && moment.author.expert_level > 0 && (
                    <View className="bg-secondary-100 px-1.5 py-0.5 rounded ml-2">
                      <Text className="text-secondary-600 text-xs">专家</Text>
                    </View>
                  )}
                </View>
                <Text className="text-gray-400 text-sm mt-0.5">
                  {formatDate(moment.created_at)}
                  {moment.location_display && ` · ${moment.location_display}`}
                </Text>
              </View>
            </TouchableOpacity>

            {/* 内容 */}
            <Text className="text-gray-800 text-base leading-7 mt-4">{moment.content}</Text>

            {/* 标签 */}
            {moment.tags && moment.tags.length > 0 && (
              <View className="flex-row flex-wrap gap-2 mt-3">
                {moment.tags.map((tag) => (
                  <TouchableOpacity
                    key={tag.id}
                    className="bg-secondary-50 px-3 py-1 rounded-full"
                    onPress={() => router.push(`/square/tag/${tag.tag_name}`)}
                  >
                    <Text className="text-secondary-600">#{tag.tag_name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* 图片 */}
            {moment.media && moment.media.length > 0 && (
              <View className="mt-4">
                {moment.media.map((media) => (
                  <Image
                    key={media.id}
                    source={{ uri: media.url }}
                    className="w-full rounded-xl mb-2"
                    style={{ aspectRatio: 1 }}
                    resizeMode="cover"
                  />
                ))}
              </View>
            )}

            {/* 互动数据 */}
            <View className="flex-row items-center justify-around py-4 mt-4 border-t border-b border-gray-100">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={handleLike}
              >
                <Ionicons
                  name={moment.is_liked ? 'heart' : 'heart-outline'}
                  size={24}
                  color={moment.is_liked ? '#ef4444' : '#6b7280'}
                />
                <Text
                  className={`ml-2 ${moment.is_liked ? 'text-red-500' : 'text-gray-500'}`}
                >
                  {moment.like_count || 0} 赞
                </Text>
              </TouchableOpacity>
              <View className="flex-row items-center">
                <Ionicons name="chatbubble-outline" size={24} color="#6b7280" />
                <Text className="text-gray-500 ml-2">{moment.reply_count || 0} 评论</Text>
              </View>
              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="share-outline" size={24} color="#6b7280" />
                <Text className="text-gray-500 ml-2">分享</Text>
              </TouchableOpacity>
            </View>

            {/* 回复列表 */}
            <View className="mt-4">
              <Text className="text-lg font-bold text-gray-800 mb-4">
                评论 ({moment.reply_count || 0})
              </Text>

              {replies.length === 0 ? (
                <View className="py-8 items-center">
                  <Ionicons name="chatbubble-outline" size={48} color="#d1d5db" />
                  <Text className="text-gray-400 mt-2">暂无评论</Text>
                </View>
              ) : (
                replies.map((reply) => (
                  <View key={reply.id} className="py-3 border-b border-gray-100">
                    <View className="flex-row">
                      <Image
                        source={
                          reply.author?.avatar
                            ? { uri: reply.author.avatar }
                            : require('../../assets/default-avatar.png')
                        }
                        className="w-9 h-9 rounded-full bg-gray-100"
                      />
                      <View className="flex-1 ml-3">
                        <Text className="text-gray-800 font-medium">
                          {reply.author?.nickname || reply.author?.username || '匿名用户'}
                        </Text>
                        <Text className="text-gray-700 mt-1">{reply.content}</Text>
                        <View className="flex-row items-center mt-2">
                          <Text className="text-gray-400 text-xs">
                            {formatDate(reply.created_at)}
                          </Text>
                          <TouchableOpacity
                            className="ml-4"
                            onPress={() => setReplyTo(reply)}
                          >
                            <Text className="text-gray-400 text-xs">回复</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ))
              )}

              {hasNextPage && (
                <TouchableOpacity
                  className="py-3 items-center"
                  onPress={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? (
                    <ActivityIndicator color="#e76f51" size="small" />
                  ) : (
                    <Text className="text-primary-500">加载更多</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>

        {/* 回复输入框 */}
        <View className="flex-row items-end px-4 py-3 bg-white border-t border-gray-100">
          <View className="flex-1 bg-gray-100 rounded-xl px-4 py-2">
            {replyTo && (
              <View className="flex-row items-center mb-1">
                <Text className="text-gray-500 text-sm">
                  回复 {replyTo.author?.nickname}
                </Text>
                <TouchableOpacity className="ml-2" onPress={() => setReplyTo(null)}>
                  <Ionicons name="close-circle" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            )}
            <TextInput
              className="text-gray-700 max-h-20"
              placeholder="写下你的评论..."
              placeholderTextColor="#9ca3af"
              value={replyText}
              onChangeText={setReplyText}
              multiline
            />
          </View>
          <TouchableOpacity
            className={`ml-3 px-4 py-2 rounded-full ${
              replyText.trim() ? 'bg-primary-500' : 'bg-gray-300'
            }`}
            onPress={handleReply}
            disabled={replyMutation.isPending || !replyText.trim()}
          >
            {replyMutation.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-white font-medium">发送</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ReportModal
        visible={reportVisible}
        onClose={() => setReportVisible(false)}
        targetType="moment"
        targetId={momentId}
      />
    </>
  );
}
