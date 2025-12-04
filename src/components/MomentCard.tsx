import { View, Text, Image, StyleProp, ViewStyle, ActionSheetIOS, Platform, Alert, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withSequence } from 'react-native-reanimated';
import { Video, ResizeMode } from 'expo-av';
import { momentApi } from '../api/moment';
import { useAuthStore } from '../stores/auth';
import ReportModal from './ReportModal';
import type { Moment, MomentMedia } from '../types';

interface MomentCardProps {
  moment: Moment;
  style?: StyleProp<ViewStyle>;
}

export default function MomentCard({ moment, style }: MomentCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUser = useAuthStore((state) => state.user);
  const [reportVisible, setReportVisible] = useState(false);

  const isOwner = currentUser?.id === moment.user_id;

  // 卡片按压动画
  const cardScale = useSharedValue(1);
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  // 点赞按钮动画
  const likeScale = useSharedValue(1);
  const likeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const deleteMutation = useMutation({
    mutationFn: () => momentApi.delete(moment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moments'] });
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
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }
  };

  // 点赞/取消点赞
  const likeMutation = useMutation({
    mutationFn: () => {
      if (moment.is_liked) {
        return momentApi.unlike(moment.id);
      }
      return momentApi.like(moment.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moments'] });
    },
  });

  const handleLike = () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }
    // 触发点赞动画
    if (!moment.is_liked) {
      likeScale.value = withSequence(
        withSpring(1.4, { damping: 6, stiffness: 400 }),
        withSpring(0.9, { damping: 6, stiffness: 400 }),
        withSpring(1.1, { damping: 8, stiffness: 400 }),
        withSpring(1, { damping: 10, stiffness: 400 })
      );
    }
    likeMutation.mutate();
  };

  const handleCardPressIn = () => {
    cardScale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  };

  const handleCardPressOut = () => {
    cardScale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const renderMediaItem = (media: MomentMedia, isSingle: boolean) => {
    if (media.media_type === 'video') {
      return (
        <Video
          source={{ uri: media.url }}
          style={isSingle ? styles.singleVideo : styles.gridVideo}
          resizeMode={ResizeMode.COVER}
          useNativeControls
          isLooping={false}
        />
      );
    }
    return (
      <Image
        source={{ uri: media.url }}
        style={isSingle ? styles.singleImage : styles.gridImage}
        resizeMode="cover"
      />
    );
  };

  return (
    <Animated.View style={[styles.cardContainer, cardAnimatedStyle, style]}>
      <Pressable
        onPress={() => router.push(`/moment/${moment.id}`)}
        onPressIn={handleCardPressIn}
        onPressOut={handleCardPressOut}
      >
        <View style={styles.card}>
          {/* 用户信息 */}
          <View style={styles.header}>
            <Pressable
              style={styles.userInfo}
              onPress={() => router.push(`/user/${moment.author?.id}`)}
            >
              <View style={styles.avatarRing}>
                <LinearGradient
                  colors={['#ec4899', '#f472b6', '#0ea5e9']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.avatarGradient}
                >
                  <View style={styles.avatarInner}>
                    <Image
                      source={
                        moment.author?.avatar
                          ? { uri: moment.author.avatar }
                          : require('../../assets/default-avatar.png')
                      }
                      style={styles.avatar}
                    />
                  </View>
                </LinearGradient>
              </View>
              <View style={styles.userMeta}>
                <View style={styles.nameRow}>
                  <Text style={styles.userName}>
                    {moment.author?.nickname || moment.author?.username || '匿名用户'}
                  </Text>
                  {moment.author?.expert_level && moment.author.expert_level > 0 && (
                    <LinearGradient
                      colors={['#0ea5e9', '#0284c7']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.expertBadge}
                    >
                      <Ionicons name="shield-checkmark" size={10} color="#fff" />
                      <Text style={styles.expertText}>专家</Text>
                    </LinearGradient>
                  )}
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.time}>{formatDate(moment.created_at)}</Text>
                  {moment.location_display && (
                    <>
                      <Text style={styles.dot}>·</Text>
                      <Text style={styles.location}>{moment.location_display}</Text>
                    </>
                  )}
                </View>
              </View>
            </Pressable>

            {/* 更多菜单 */}
            <Pressable style={styles.moreButton} onPress={showActionSheet}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#9ca3af" />
            </Pressable>
          </View>

          {/* 内容 */}
          <Text style={styles.content} numberOfLines={5}>
            {moment.content}
          </Text>

          {/* 标签 */}
          {moment.tags && moment.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {moment.tags.map((tag, index) => (
                <Pressable
                  key={tag.id || index}
                  style={styles.tagWrapper}
                  onPress={() => router.push(`/square/tag/${tag.tag_name}`)}
                >
                  <LinearGradient
                    colors={['#f0fdf4', '#dcfce7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.tagGradient}
                  >
                    <Text style={styles.tagText}>#{tag.tag_name}</Text>
                  </LinearGradient>
                </Pressable>
              ))}
            </View>
          )}

          {/* 媒体网格（图片/视频） */}
          {moment.media && moment.media.length > 0 && (
            <View style={styles.mediaContainer}>
              {moment.media.length === 1 ? (
                renderMediaItem(moment.media[0], true)
              ) : (
                <View style={styles.imageGrid}>
                  {moment.media.slice(0, 9).map((media, index) => {
                    const count = moment.media!.length;
                    const isTwoColumn = count === 2 || count === 4;

                    return (
                      <View key={media.id || index} style={{ width: isTwoColumn ? '48.5%' : '32%' }}>
                        {renderMediaItem(media, false)}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* 互动栏 */}
          <View style={styles.actionsContainer}>
            <Pressable style={styles.actionButton} onPress={handleLike}>
              <Animated.View style={likeAnimatedStyle}>
                <Ionicons
                  name={moment.is_liked ? 'heart' : 'heart-outline'}
                  size={22}
                  color={moment.is_liked ? '#ec4899' : '#9ca3af'}
                />
              </Animated.View>
              <Text style={[styles.actionText, moment.is_liked && styles.actionTextActive]}>
                {moment.like_count || '点赞'}
              </Text>
            </Pressable>

            <Pressable style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={20} color="#9ca3af" />
              <Text style={styles.actionText}>
                {moment.reply_count || '评论'}
              </Text>
            </Pressable>

            <Pressable style={styles.actionButton}>
              <Ionicons name="share-outline" size={22} color="#9ca3af" />
              <Text style={styles.actionText}>分享</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>

      <ReportModal
        visible={reportVisible}
        onClose={() => setReportVisible(false)}
        targetType="moment"
        targetId={moment.id}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    shadowColor: 'rgba(236, 72, 153, 0.12)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(251, 207, 232, 0.3)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarRing: {
    width: 46,
    height: 46,
    borderRadius: 23,
    padding: 2,
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fce7f3',
  },
  userMeta: {
    marginLeft: 12,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  expertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 2,
  },
  expertText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#9ca3af',
  },
  dot: {
    fontSize: 12,
    color: '#d1d5db',
    marginHorizontal: 4,
  },
  location: {
    fontSize: 12,
    color: '#9ca3af',
  },
  moreButton: {
    padding: 8,
    marginRight: -8,
  },
  content: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tagWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  tagGradient: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: '500',
  },
  mediaContainer: {
    marginTop: 4,
    marginBottom: 12,
  },
  singleImage: {
    width: '65%',
    height: 200,
    borderRadius: 16,
    backgroundColor: '#fce7f3',
  },
  singleVideo: {
    width: '65%',
    height: 200,
    borderRadius: 16,
    backgroundColor: '#000',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  gridImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#fce7f3',
    marginBottom: 4,
  },
  gridVideo: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#000',
    marginBottom: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#fce7f3',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  actionTextActive: {
    color: '#ec4899',
  },
});
