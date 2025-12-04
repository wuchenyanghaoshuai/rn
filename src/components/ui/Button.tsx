/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 按钮组件 - 方案A设计系统
 * 支持5种变体、3种尺寸、加载状态、动画效果
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  TouchableOpacityProps,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/colors';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  children,
  onPressIn,
  onPressOut,
  ...props
}) => {
  const scale = useSharedValue(1);

  // 按压动画
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e: any) => {
    scale.value = withSpring(0.96, { damping: 15 });
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, { damping: 15 });
    onPressOut?.(e);
  };

  // 尺寸样式
  const sizeStyles = {
    sm: 'h-8 px-3',
    md: 'h-10 px-4',
    lg: 'h-12 px-6',
  };

  // 文本尺寸
  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const isDisabled = disabled || loading;

  // Primary按钮使用渐变
  if (variant === 'primary') {
    return (
      <AnimatedTouchable
        style={animatedStyle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={0.8}
        {...props}
      >
        <LinearGradient
          colors={Gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className={`
            rounded-xl
            ${sizeStyles[size]}
            ${fullWidth ? 'w-full' : ''}
            ${isDisabled ? 'opacity-50' : ''}
            flex-row items-center justify-center
            shadow-primary
          `}
        >
          {loading && (
            <ActivityIndicator color="white" className="mr-2" size="small" />
          )}
          {!loading && icon && <View className="mr-2">{icon}</View>}
          <Text className={`${textSizes[size]} font-semibold text-white`}>
            {children}
          </Text>
        </LinearGradient>
      </AnimatedTouchable>
    );
  }

  // 其他变体样式
  const variantStyles = {
    secondary: 'bg-rose-light',
    outline: 'bg-transparent border-2 border-primary-400',
    ghost: 'bg-transparent',
    danger: 'bg-error',
  };

  const textColors = {
    primary: 'text-white',
    secondary: 'text-primary-400',
    outline: 'text-primary-400',
    ghost: 'text-primary-400',
    danger: 'text-white',
  };

  return (
    <AnimatedTouchable
      style={animatedStyle}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      activeOpacity={0.8}
      className={`
        rounded-xl
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50' : ''}
        flex-row items-center justify-center
      `}
      {...props}
    >
      {loading && (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary[400] : 'white'}
          className="mr-2"
          size="small"
        />
      )}
      {!loading && icon && <View className="mr-2">{icon}</View>}
      <Text className={`${textSizes[size]} font-semibold ${textColors[variant]}`}>
        {children}
      </Text>
    </AnimatedTouchable>
  );
};
