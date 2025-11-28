import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { useEffect } from 'react';

type IconName = keyof typeof Ionicons.glyphMap;

interface EmptyStateProps {
  icon?: IconName;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon = 'folder-open-outline',
  title = '暂无数据',
  description,
  actionText,
  onAction,
}: EmptyStateProps) {
  // 图标浮动动画
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // 按钮动画
  const buttonScale = useSharedValue(1);
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100 });
  };

  return (
    <View style={styles.container}>
      {/* 渐变背景圆形 + 浮动图标 */}
      <Animated.View style={[styles.iconWrapper, floatingStyle]}>
        <LinearGradient
          colors={['#fdf2f8', '#fce7f3', '#fbcfe8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconGradient}
        >
          <View style={styles.iconInner}>
            <Ionicons name={icon} size={44} color="#ec4899" />
          </View>
        </LinearGradient>
      </Animated.View>

      {/* 标题 */}
      <Text style={styles.title}>{title}</Text>

      {/* 描述 */}
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}

      {/* 操作按钮 */}
      {actionText && onAction && (
        <Animated.View style={buttonAnimatedStyle}>
          <Pressable
            onPress={onAction}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <LinearGradient
              colors={['#ec4899', '#db2777']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>{actionText}</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  iconWrapper: {
    marginBottom: 20,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInner: {
    width: '100%',
    height: '100%',
    borderRadius: 46,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: 'rgba(236, 72, 153, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
