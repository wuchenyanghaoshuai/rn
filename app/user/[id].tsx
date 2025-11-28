import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../../src/api/user';
import { articleApi } from '../../src/api/article';
import ArticleCard from '../../src/components/ArticleCard';
import EmptyState from '../../src/components/EmptyState';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import { useAuthStore } from '../../src/stores/auth';
import type { User } from '../../src/types';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const userId = Number(id);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: currentUser, isAuthenticated } = useAuthStore();

  const isViewingSelf = currentUser?.id === userId;

  const { data: userInfo, isLoading: userLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userApi.getPublicInfo(userId),
    enabled: Number.isFinite(userId),
    select: (res) => res.data as User,
  });

  const { data: followStats } = useQuery({
    queryKey: ['user', userId, 'follow-stats'],
    queryFn: () => userApi.getFollowStats(userId),
    enabled: Number.isFinite(userId),
    select: (res) => res.data,
  });

  const { data: followStatus } = useQuery({
    queryKey: ['user', userId, 'follow-status'],
    queryFn: () => userApi.checkFollowStatus(userId),
    enabled: Number.isFinite(userId) && isAuthenticated && !isViewingSelf,
    select: (res) => res.data,
  });

  const { data: userArticles, isLoading: articlesLoading } = useQuery({
    queryKey: ['userArticles', userId],
    queryFn: () => articleApi.getUserArticles(userId, { page: 1, size: 5 }),
    enabled: Number.isFinite(userId),
    select: (res) => {
      if (Array.isArray(res.data)) return res.data;
      return res.data?.items || [];
    },
  });

  const followMutation = useMutation({
    mutationFn: () => userApi.follow(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId, 'follow-status'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId, 'follow-stats'] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => userApi.unfollow(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId, 'follow-status'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId, 'follow-stats'] });
    },
  });

  const isFollowing = followStatus?.is_following;
  const followLoading = followMutation.isPending || unfollowMutation.isPending;

  const headerActionLabel = isViewingSelf
    ? '编辑资料'
    : followLoading
      ? '处理中...'
      : isFollowing
        ? '已关注'
        : '关注';

  const handleToggleFollow = () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }
    if (!Number.isFinite(userId) || isViewingSelf || followLoading) return;

    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  if (!Number.isFinite(userId)) {
    return (
      <View className="flex-1 bg-background">
        <EmptyState title="无效的用户" description="无法识别的用户ID" icon="person-circle-outline" />
      </View>
    );
  }

  if (userLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <LoadingSpinner />
      </View>
    );
  }

  if (!userInfo) {
    return (
      <View className="flex-1 bg-background">
        <EmptyState
          title="未找到用户"
          description="这个用户好像不存在或已被删除"
          icon="alert-circle-outline"
        />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="bg-white px-4 py-6">
        <View className="flex-row items-center">
          <Image
            source={
              userInfo.avatar ? { uri: userInfo.avatar } : require('../../assets/default-avatar.png')
            }
            className="w-16 h-16 rounded-full bg-gray-100"
          />
          <View className="ml-4 flex-1">
            <Text className="text-xl font-bold text-gray-800">
              {userInfo.nickname || userInfo.username}
            </Text>
            {userInfo.bio ? (
              <Text className="text-gray-500 mt-1" numberOfLines={2}>
                {userInfo.bio}
              </Text>
            ) : null}
            {userInfo.expert_level && userInfo.expert_level > 0 ? (
              <View className="flex-row items-center mt-2">
                <View className="bg-secondary-100 px-2 py-0.5 rounded">
                  <Text className="text-secondary-600 text-xs font-medium">
                    {userInfo.expert_type || '认证专家'}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              isFollowing ? 'bg-gray-100' : 'bg-primary-500'
            }`}
            disabled={followLoading}
            onPress={() => {
              if (isViewingSelf) {
                router.push('/user/edit');
              } else {
                handleToggleFollow();
              }
            }}
          >
            <Text className={isFollowing ? 'text-gray-700' : 'text-white'}>
              {headerActionLabel}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row mt-6">
          <TouchableOpacity
            className="flex-1 items-center"
            onPress={() => router.push(`/user/${userId}/following`)}
          >
            <Text className="text-lg font-bold text-gray-800">
              {followStats?.following_count ?? 0}
            </Text>
            <Text className="text-gray-400 text-sm">关注</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 items-center"
            onPress={() => router.push(`/user/${userId}/followers`)}
          >
            <Text className="text-lg font-bold text-gray-800">
              {followStats?.followers_count ?? 0}
            </Text>
            <Text className="text-gray-400 text-sm">粉丝</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 items-center"
            onPress={() => router.push('/user/favorites')}
          >
            <Text className="text-lg font-bold text-gray-800">{userInfo.favorite_count ?? 0}</Text>
            <Text className="text-gray-400 text-sm">收藏</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-4 bg-white px-4 py-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-lg font-bold text-gray-800">TA的文章</Text>
          <TouchableOpacity onPress={() => router.push(`/user/articles?userId=${userId}`)}>
            <Text className="text-primary-500">查看更多</Text>
          </TouchableOpacity>
        </View>

        {articlesLoading ? (
          <LoadingSpinner />
        ) : userArticles && userArticles.length > 0 ? (
          <View className="gap-4">
            {userArticles.map((article) => (
              <ArticleCard key={article.id} article={article} showAuthor={false} />
            ))}
          </View>
        ) : (
          <EmptyState
            icon='document-text-outline'
            title="还没有文章"
            description="这位用户还没有发布文章"
          />
        )}
      </View>
    </ScrollView>
  );
}
