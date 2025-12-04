/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 徽章组件 - 方案A设计系统
 * 支持6种颜色变体、数字显示、圆点模式
 */

import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/colors';

interface BadgeProps extends ViewProps {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  count?: number;
  maxCount?: number;
  dot?: boolean;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  count,
  maxCount = 99,
  dot = false,
  children,
  style,
  ...props
}) => {
  // 尺寸配置
  const sizes = {
    sm: { height: 16, minWidth: 16, padding: 'px-1', text: 'text-xs' },
    md: { height: 20, minWidth: 20, padding: 'px-1.5', text: 'text-sm' },
  };

  const { height, minWidth, padding, text: textSize } = sizes[size];

  // 颜色配置
  const colors = {
    primary: Colors.primary[400],
    success: Colors.success,
    warning: Colors.warning,
    error: Colors.error,
    info: Colors.info,
    neutral: Colors.neutral[400],
  };

  const bgColor = colors[variant];

  // 显示内容
  const displayContent = (() => {
    if (children) return children;
    if (count === undefined) return null;
    if (count === 0) return null;
    if (count > maxCount) return `${maxCount}+`;
    return count.toString();
  })();

  // 圆点模式
  if (dot) {
    return (
      <View
        className="rounded-full"
        style={[
          {
            width: height / 2,
            height: height / 2,
            backgroundColor: bgColor,
          },
          style,
        ]}
        {...props}
      />
    );
  }

  // 如果没有内容,不渲染
  if (!displayContent && displayContent !== 0) {
    return null;
  }

  // 主色渐变模式
  if (variant === 'primary') {
    return (
      <LinearGradient
        colors={Gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={`rounded-full ${padding} items-center justify-center`}
        style={[
          {
            height,
            minWidth,
          },
          style,
        ]}
        {...props}
      >
        <Text className={`${textSize} font-semibold text-white`}>
          {displayContent}
        </Text>
      </LinearGradient>
    );
  }

  // 其他颜色模式
  return (
    <View
      className={`rounded-full ${padding} items-center justify-center`}
      style={[
        {
          height,
          minWidth,
          backgroundColor: bgColor,
        },
        style,
      ]}
      {...props}
    >
      <Text className={`${textSize} font-semibold text-white`}>
        {displayContent}
      </Text>
    </View>
  );
};
