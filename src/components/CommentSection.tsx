import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { commentApi } from '../api/comment';
import { useAuthStore } from '../stores/auth';
import type { Comment } from '../types';

interface CommentSectionProps {
  articleId: number;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();

  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);

  // 获取评论列表
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['comments', articleId],
    queryFn: ({ pageParam = 1 }) =>
      commentApi.getArticleComments(articleId, { page: pageParam, size: 20 }),
    getNextPageParam: (lastPage) => {
      const { page = 1, total_pages = 1 } = (lastPage as any).pagination || (lastPage as any).data || {};
      return page < total_pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!articleId,
  });

  const comments =
    data?.pages.flatMap((page) => {
      if (Array.isArray((page as any).data)) {
        return (page as any).data;
      }
      const items = (page as any).data?.items || [];
      return Array.isArray(items) ? items : [];
    }) || [];

  // 创建评论
  const createMutation = useMutation({
    mutationFn: () =>
      commentApi.create({
        content: commentText,
        article_id: articleId,
        parent_id: replyTo?.id,
      }),
    onSuccess: () => {
      setCommentText('');
      setReplyTo(null);
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
      queryClient.invalidateQueries({ queryKey: ['article', articleId] });
    },
    onError: (error: any) => {
      Alert.alert('发送失败', error.message || '请稍后重试');
    },
  });

  // 点赞评论
  const likeMutation = useMutation({
    mutationFn: (commentId: number) => commentApi.like(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
    },
  });

  const handleSubmit = () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }

    if (!commentText.trim()) {
      Alert.alert('提示', '请输入评论内容');
      return;
    }

    createMutation.mutate();
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

  const renderComment = ({ item }: { item: Comment }) => {
    const userInfo = item.user || (item as any).User || {};
    const displayName = userInfo.nickname || userInfo.username || '匿名';
    const avatar = userInfo.avatar;
    const isExpert = userInfo.expert_level && userInfo.expert_level > 0;

    return (
      <View className="py-3 border-b border-gray-100">
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => userInfo.id && router.push(`/user/${userInfo.id}`)}
            disabled={!userInfo.id}
          >
            <Image
              source={
                avatar
                  ? { uri: avatar }
                  : require('../../assets/default-avatar.png')
              }
              className="w-9 h-9 rounded-full bg-gray-100"
            />
          </TouchableOpacity>
          <View className="flex-1 ml-3">
            <View className="flex-row items-center">
              <Text className="text-gray-800 font-medium">{displayName}</Text>
              {isExpert && (
                <View className="bg-secondary-100 px-1.5 py-0.5 rounded ml-1">
                  <Text className="text-secondary-600 text-xs">专家</Text>
                </View>
              )}
            </View>
            <Text className="text-gray-700 mt-1 leading-5">{item.content}</Text>
            <View className="flex-row items-center mt-2">
              <Text className="text-gray-400 text-xs">{formatDate(item.created_at)}</Text>
              {item.location_display && (
                <Text className="text-gray-400 text-xs ml-2">{item.location_display}</Text>
              )}
              <TouchableOpacity
                className="flex-row items-center ml-4"
                onPress={() => {
                  if (!isAuthenticated) {
                    router.push('/(auth)/login');
                    return;
                  }
                  likeMutation.mutate(item.id);
                }}
              >
                <Ionicons
                  name={item.is_liked ? 'heart' : 'heart-outline'}
                  size={14}
                  color={item.is_liked ? '#ef4444' : '#9ca3af'}
                />
                <Text
                  className={`text-xs ml-1 ${item.is_liked ? 'text-red-500' : 'text-gray-400'}`}
                >
                  {item.like_count || ''}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center ml-4"
                onPress={() => setReplyTo(item)}
              >
                <Ionicons name="chatbubble-outline" size={14} color="#9ca3af" />
                <Text className="text-gray-400 text-xs ml-1">回复</Text>
              </TouchableOpacity>
            </View>

            {/* 回复列表 */}
            {item.replies && item.replies.length > 0 && (
              <View className="mt-3 bg-gray-50 rounded-lg p-3">
                {item.replies.slice(0, 3).map((reply) => {
                  const replyUser = (reply as any).user || (reply as any).User || {};
                  const replyName = replyUser.nickname || replyUser.username || '匿名';
                  return (
                    <View key={reply.id} className="mb-2">
                      <Text className="text-gray-700">
                        <Text className="text-primary-500 font-medium">
                          {replyName}
                        </Text>
                        ：{reply.content}
                      </Text>
                    </View>
                  );
                })}
                {item.reply_count && item.reply_count > 3 && (
                  <TouchableOpacity>
                    <Text className="text-primary-500 text-sm">
                      查看全部 {item.reply_count} 条回复
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      {/* 评论输入框 */}
      <View className="flex-row items-end bg-gray-50 rounded-xl p-3 mb-4">
        <View className="flex-1">
          {replyTo && (
            <View className="flex-row items-center mb-2">
              <Text className="text-gray-500 text-sm">
                回复 {replyTo.user?.nickname || replyTo.user?.username || '匿名'}
              </Text>
              <TouchableOpacity className="ml-2" onPress={() => setReplyTo(null)}>
                <Ionicons name="close-circle" size={18} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          )}
          <TextInput
            className="text-gray-700 max-h-24"
            placeholder={replyTo ? `回复 ${replyTo.user?.nickname || replyTo.user?.username || '匿名'}...` : '写下你的评论...'}
            placeholderTextColor="#9ca3af"
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
        </View>
        <TouchableOpacity
          className={`ml-3 px-4 py-2 rounded-full ${
            commentText.trim() ? 'bg-primary-500' : 'bg-gray-300'
          }`}
          onPress={handleSubmit}
          disabled={createMutation.isPending || !commentText.trim()}
        >
          {createMutation.isPending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text className="text-white font-medium">发送</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* 评论列表 */}
      {isLoading ? (
        <View className="py-8 items-center">
          <ActivityIndicator color="#e76f51" />
        </View>
      ) : comments.length === 0 ? (
        <View className="py-8 items-center">
          <Ionicons name="chatbubble-outline" size={48} color="#d1d5db" />
          <Text className="text-gray-400 mt-2">暂无评论，快来抢沙发吧</Text>
        </View>
      ) : (
        <>
          {comments.map((comment) => renderComment({ item: comment }))}
          {hasNextPage && (
            <TouchableOpacity
              className="py-3 items-center"
              onPress={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? (
                <ActivityIndicator color="#e76f51" size="small" />
              ) : (
                <Text className="text-primary-500">加载更多评论</Text>
              )}
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}
