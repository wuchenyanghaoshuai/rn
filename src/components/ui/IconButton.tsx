/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 图标按钮组件 - 方案A设计系统
 * 圆形或方形图标按钮,支持多种变体和动画
 */

import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/colors';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface IconButtonProps extends TouchableOpacityProps {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'white';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'ghost',
  size = 'md',
  shape = 'circle',
  disabled = false,
  onPressIn,
  onPressOut,
  style,
  className = '',
  ...props
}) => {
  const scale = useSharedValue(1);

  // 尺寸配置
  const sizes = {
    sm: 32,
    md: 40,
    lg: 48,
  };

  const buttonSize = sizes[size];
  const borderRadius = shape === 'circle' ? buttonSize / 2 : 12;

  // 按压动画
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e: any) => {
    scale.value = withSpring(0.9, { damping: 15 });
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, { damping: 15 });
    onPressOut?.(e);
  };

  // Primary变体使用渐变
  if (variant === 'primary') {
    return (
      <AnimatedTouchable
        style={[animatedStyle, style]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        className={className}
        {...props}
      >
        <LinearGradient
          colors={Gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: buttonSize,
            height: buttonSize,
            borderRadius,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: disabled ? 0.5 : 1,
          }}
        >
          {icon}
        </LinearGradient>
      </AnimatedTouchable>
    );
  }

  // 其他变体样式
  const variantStyles = {
    secondary: `bg-rose-light`,
    ghost: 'bg-transparent',
    white: 'bg-white shadow-md',
  };

  return (
    <AnimatedTouchable
      style={[animatedStyle, style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.8}
      className={`${variantStyles[variant]} ${className}`}
      {...props}
    >
      <Animated.View
        style={{
          width: buttonSize,
          height: buttonSize,
          borderRadius,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {icon}
      </Animated.View>
    </AnimatedTouchable>
  );
};
