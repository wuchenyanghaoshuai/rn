import { View, Text, Image, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Pressable } from 'react-native';
import type { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  style?: StyleProp<ViewStyle>;
  showAuthor?: boolean;
}

export default function ArticleCard({ article, style, showAuthor = true }: ArticleCardProps) {
  const router = useRouter();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
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

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle, style]}>
      <Pressable
        onPress={() => router.push(`/article/${article.id}`)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.card}>
          {/* 封面图 + 渐变遮罩 */}
          {article.cover_image && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: article.cover_image }} style={styles.coverImage} resizeMode="cover" />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.4)']} style={styles.imageOverlay} />
              {/* 分类标签浮在图片上 */}
              {article.category && (
                <View style={styles.categoryBadge}>
                  <LinearGradient colors={['#ec4899', '#db2777']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.categoryGradient}>
                    <Text style={styles.categoryText}>{article.category.name}</Text>
                  </LinearGradient>
                </View>
              )}
            </View>
          )}

          <View style={styles.content}>
            {/* 无图片时显示分类标签 */}
            {!article.cover_image && article.category && (
              <View style={styles.categoryBadgeInline}>
                <LinearGradient colors={['#fdf2f8', '#fce7f3']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.categoryGradientInline}>
                  <Text style={styles.categoryTextInline}>{article.category.name}</Text>
                </LinearGradient>
              </View>
            )}

            {/* 标题 */}
            <Text style={styles.title} numberOfLines={2}>
              {article.title}
            </Text>

            {/* 摘要 */}
            {article.summary && (
              <Text style={styles.summary} numberOfLines={2}>
                {article.summary}
              </Text>
            )}

            {/* 底部信息 */}
            <View style={styles.footer}>
              {/* 作者信息 */}
              {showAuthor && article.author && (
                <Pressable
                  style={styles.authorContainer}
                  onPress={() => {
                    if (article.author?.id) {
                      router.push(`/user/${article.author.id}`);
                    }
                  }}
                >
                  <View style={styles.avatarRing}>
                    <Image
                      source={
                        article.author.avatar
                          ? { uri: article.author.avatar }
                          : require('../../assets/default-avatar.png')
                      }
                      style={styles.avatar}
                    />
                  </View>
                  <Text style={styles.authorName}>
                    {article.author.nickname || article.author.username}
                  </Text>
                </Pressable>
              )}

              {/* 统计数据 */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Ionicons name="eye-outline" size={14} color="#f472b6" />
                  <Text style={styles.statText}>{article.view_count}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="heart" size={14} color="#f472b6" />
                  <Text style={styles.statText}>{article.like_count}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="chatbubble" size={13} color="#f472b6" />
                  <Text style={styles.statText}>{article.comment_count}</Text>
                </View>
              </View>
            </View>

            {/* 时间 */}
            <Text style={styles.time}>
              {formatDate(article.published_at || article.created_at)}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    shadowColor: 'rgba(236, 72, 153, 0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(251, 207, 232, 0.3)',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoryGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryBadgeInline: {
    alignSelf: 'flex-start',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  categoryGradientInline: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  categoryTextInline: {
    color: '#db2777',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    lineHeight: 24,
    marginBottom: 6,
  },
  summary: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#fce7f3',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarRing: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#fbcfe8',
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fce7f3',
  },
  authorName: {
    marginLeft: 8,
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  time: {
    fontSize: 12,
    color: '#d1d5db',
    marginTop: 8,
  },
});
