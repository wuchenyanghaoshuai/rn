/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 渐变卡片组件 - 方案A设计系统
 * 支持6种渐变颜色变体、悬浮动画
 */

import React from 'react';
import { View, TouchableOpacity, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Gradients } from '@/constants/colors';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface GradientCardProps extends ViewProps {
  variant?: 'pink' | 'lavender' | 'mint' | 'sky' | 'butter' | 'white';
  children: React.ReactNode;
  onPress?: () => void;
  hover?: boolean;
}

export const GradientCard: React.FC<GradientCardProps> = ({
  variant = 'white',
  children,
  onPress,
  hover = true,
  style,
  className = '',
  ...props
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (hover && onPress) {
      scale.value = withSpring(0.98, { damping: 15 });
    }
  };

  const handlePressOut = () => {
    if (hover && onPress) {
      scale.value = withSpring(1, { damping: 15 });
    }
  };

  // 渐变色配置
  const gradients = {
    pink: Gradients.rose,
    lavender: Gradients.lavender,
    mint: Gradients.mint,
    sky: Gradients.sky,
    butter: Gradients.butter,
    white: ['#FFFFFF', '#FFFFFF'],
  };

  const CardContent = (
    <View className={`p-5 ${className}`} {...props}>
      {children}
    </View>
  );

  // 白色卡片（非渐变）
  if (variant === 'white') {
    if (onPress) {
      return (
        <AnimatedTouchable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          style={[animatedStyle, style]}
          className="bg-white rounded-2xl shadow-md"
        >
          {CardContent}
        </AnimatedTouchable>
      );
    }
    return (
      <View className="bg-white rounded-2xl shadow-md" style={style}>
        {CardContent}
      </View>
    );
  }

  // 渐变卡片
  const GradientWrapper = (
    <LinearGradient
      colors={gradients[variant]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="rounded-2xl shadow-md"
      style={style}
    >
      {CardContent}
    </LinearGradient>
  );

  if (onPress) {
    return (
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={animatedStyle}
      >
        {GradientWrapper}
      </AnimatedTouchable>
    );
  }

  return <Animated.View style={animatedStyle}>{GradientWrapper}</Animated.View>;
};
