import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type IconName = keyof typeof Ionicons.glyphMap;

interface FeatureItem {
  id: string;
  icon: IconName;
  title: string;
  description: string;
  color: string;
}

const features: FeatureItem[] = [
  { id: 'chat', icon: 'chatbubble-ellipses', title: '智能问答', description: '育儿问题随时问，AI秒回答', color: '#ec4899' },
  { id: 'summary', icon: 'document-text', title: '文章总结', description: '快速了解文章核心要点', color: '#0ea5e9' },
  { id: 'suggest', icon: 'bulb', title: '智能建议', description: '个性化育儿方案推荐', color: '#f59e0b' },
];

const quickQuestions = [
  '宝宝发烧怎么办？',
  '如何培养孩子阅读习惯？',
  '辅食添加顺序是什么？',
  '宝宝多大可以断奶？',
];

export default function AIScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#fdf2f8', '#fce7f3', '#ffffff']} style={styles.headerGradient} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* AI助手头像区域 */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <LinearGradient colors={['#ec4899', '#db2777']} style={styles.avatar}>
              <Ionicons name="sparkles" size={36} color="#fff" />
            </LinearGradient>
            <View style={styles.statusDot} />
          </View>
          <Text style={styles.title}>AI育儿助手</Text>
          <Text style={styles.subtitle}>有问题随时问我，我会尽力帮助你~</Text>
        </View>

        {/* 功能入口 */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>我能帮你</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </View>
        </View>

        {/* 快捷问题 */}
        <View style={styles.quickSection}>
          <Text style={styles.sectionTitle}>常见问题</Text>
          <View style={styles.quickList}>
            {quickQuestions.map((question, index) => (
              <QuickQuestionItem key={index} question={question} />
            ))}
          </View>
        </View>

        {/* 开始对话按钮 */}
        <View style={styles.buttonSection}>
          <Pressable style={({ pressed }) => [styles.startButton, pressed && styles.startButtonPressed]}>
            <LinearGradient colors={['#ec4899', '#db2777']} style={styles.startButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Ionicons name="chatbubbles" size={20} color="#fff" />
              <Text style={styles.startButtonText}>开始对话</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

function FeatureCard({ feature }: { feature: FeatureItem }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.featureCardWrapper, animatedStyle]}>
      <Pressable
        style={styles.featureCard}
        onPressIn={() => { scale.value = withSpring(0.95, { damping: 15, stiffness: 400 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 400 }); }}
      >
        <View style={[styles.featureIcon, { backgroundColor: `${feature.color}15` }]}>
          <Ionicons name={feature.icon} size={24} color={feature.color} />
        </View>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDesc}>{feature.description}</Text>
      </Pressable>
    </Animated.View>
  );
}

function QuickQuestionItem({ question }: { question: string }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={styles.quickItem}
        onPressIn={() => { scale.value = withSpring(0.98, { damping: 15, stiffness: 400 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 400 }); }}
      >
        <View style={styles.quickIconWrapper}>
          <Ionicons name="help-circle" size={18} color="#ec4899" />
        </View>
        <Text style={styles.quickText}>{question}</Text>
        <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
  avatarSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  statusDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#22c55e',
    borderWidth: 3,
    borderColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featuresSection: {
    marginBottom: 32,
  },
  featuresGrid: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
  },
  featureCardWrapper: {
    flex: 1,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(251, 207, 232, 0.3)',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 16,
  },
  quickSection: {
    marginBottom: 32,
  },
  quickList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  quickItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    shadowColor: 'rgba(0, 0, 0, 0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(251, 207, 232, 0.2)',
  },
  quickIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
  },
  buttonSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  startButton: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  startButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 24,
  },
});
