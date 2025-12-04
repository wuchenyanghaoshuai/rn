/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 骨架屏加载组件 - 方案A设计系统
 * 用于数据加载时显示占位内容
 */

import React, { useEffect } from 'react';
import { View, ViewProps, DimensionValue } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';

interface SkeletonLoaderProps extends ViewProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  variant?: 'rect' | 'circle' | 'text';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  variant = 'rect',
  style,
  ...props
}) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // 根据变体设置默认样式
  const computedBorderRadius = variant === 'circle'
    ? (typeof height === 'number' ? height / 2 : 50)
    : variant === 'text'
    ? 4
    : borderRadius;

  const computedWidth = variant === 'circle' ? height : width;
  const computedHeight = variant === 'text' ? 16 : height;

  return (
    <View
      style={[
        {
          width: computedWidth as DimensionValue,
          height: computedHeight as DimensionValue,
          backgroundColor: Colors.neutral[200],
          borderRadius: computedBorderRadius,
        },
        style,
      ]}
      {...props}
    >
      <Animated.View
        style={[
          {
            width: '100%',
            height: '100%',
            backgroundColor: Colors.neutral[200],
            borderRadius: computedBorderRadius,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};
