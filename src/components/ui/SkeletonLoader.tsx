import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

interface SkeletonLoaderProps {
  type: 'article-card' | 'moment-card' | 'list-item' | 'avatar' | 'text';
  count?: number;
}

function SkeletonItem({ style }: { style?: any }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.skeletonBase, style, animatedStyle]}>
      <LinearGradient
        colors={['#fce7f3', '#fbcfe8', '#fce7f3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

function ArticleCardSkeleton() {
  return (
    <View style={styles.articleCard}>
      <SkeletonItem style={styles.articleImage} />
      <View style={styles.articleContent}>
        <SkeletonItem style={styles.tag} />
        <SkeletonItem style={styles.title} />
        <SkeletonItem style={styles.titleShort} />
        <View style={styles.footer}>
          <View style={styles.author}>
            <SkeletonItem style={styles.avatar} />
            <SkeletonItem style={styles.authorName} />
          </View>
          <SkeletonItem style={styles.stats} />
        </View>
      </View>
    </View>
  );
}

function MomentCardSkeleton() {
  return (
    <View style={styles.momentCard}>
      <View style={styles.momentHeader}>
        <SkeletonItem style={styles.avatarLarge} />
        <View style={styles.momentMeta}>
          <SkeletonItem style={styles.authorName} />
          <SkeletonItem style={styles.time} />
        </View>
      </View>
      <SkeletonItem style={styles.content} />
      <SkeletonItem style={styles.contentShort} />
      <View style={styles.momentImages}>
        <SkeletonItem style={styles.momentImage} />
        <SkeletonItem style={styles.momentImage} />
      </View>
    </View>
  );
}

function ListItemSkeleton() {
  return (
    <View style={styles.listItem}>
      <SkeletonItem style={styles.listItemImage} />
      <View style={styles.listItemContent}>
        <SkeletonItem style={styles.title} />
        <SkeletonItem style={styles.subtitle} />
      </View>
    </View>
  );
}

export default function SkeletonLoader({ type, count = 1 }: SkeletonLoaderProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  const renderSkeleton = () => {
    switch (type) {
      case 'article-card':
        return items.map((i) => <ArticleCardSkeleton key={i} />);
      case 'moment-card':
        return items.map((i) => <MomentCardSkeleton key={i} />);
      case 'list-item':
        return items.map((i) => <ListItemSkeleton key={i} />);
      case 'avatar':
        return items.map((i) => <SkeletonItem key={i} style={styles.avatarLarge} />);
      case 'text':
        return items.map((i) => <SkeletonItem key={i} style={styles.textLine} />);
      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderSkeleton()}</View>;
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  skeletonBase: {
    backgroundColor: '#fce7f3',
    borderRadius: 8,
    overflow: 'hidden',
  },
  articleCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  articleImage: {
    height: 160,
    borderRadius: 0,
  },
  articleContent: {
    padding: 16,
    gap: 8,
  },
  tag: {
    width: 60,
    height: 24,
    borderRadius: 12,
  },
  title: {
    height: 20,
    borderRadius: 4,
  },
  titleShort: {
    width: '70%',
    height: 20,
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  avatarLarge: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorName: {
    width: 60,
    height: 14,
    borderRadius: 4,
  },
  stats: {
    width: 80,
    height: 14,
    borderRadius: 4,
  },
  momentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  momentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  momentMeta: {
    gap: 6,
  },
  time: {
    width: 80,
    height: 12,
    borderRadius: 4,
  },
  content: {
    height: 16,
    borderRadius: 4,
  },
  contentShort: {
    width: '60%',
    height: 16,
    borderRadius: 4,
  },
  momentImages: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  momentImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    alignItems: 'center',
  },
  listItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  listItemContent: {
    flex: 1,
    gap: 8,
  },
  subtitle: {
    width: '50%',
    height: 14,
    borderRadius: 4,
  },
  textLine: {
    height: 16,
    borderRadius: 4,
  },
});
