/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 加载动画组件 - 方案A设计系统
 * 支持3种尺寸、自定义文本、流畅的旋转动画
 */

import React, { useEffect } from 'react';
import { View, Text, ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradients } from '@/constants/colors';

interface LoadingSpinnerProps extends ViewProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  fullScreen = false,
  style,
  ...props
}) => {
  const rotation = useSharedValue(0);

  // 尺寸配置
  const sizes = {
    sm: 24,
    md: 40,
    lg: 60,
  };

  const spinnerSize = sizes[size];

  // 启动旋转动画
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  // 旋转样式
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const SpinnerContent = (
    <View className="items-center justify-center" {...props}>
      <Animated.View style={[animatedStyle, { width: spinnerSize, height: spinnerSize }]}>
        <LinearGradient
          colors={Gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-full h-full rounded-full"
          style={{
            borderRadius: spinnerSize / 2,
          }}
        >
          <View
            className="bg-white m-1 rounded-full"
            style={{
              width: spinnerSize - 8,
              height: spinnerSize - 8,
              borderRadius: (spinnerSize - 8) / 2,
            }}
          >
            <LinearGradient
              colors={[Gradients.primary[0], 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              className="w-full h-full rounded-full"
              style={{
                borderRadius: (spinnerSize - 8) / 2,
              }}
            />
          </View>
        </LinearGradient>
      </Animated.View>

      {text && (
        <Text className="text-neutral-600 mt-3 text-base">{text}</Text>
      )}
    </View>
  );

  // 全屏模式
  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-white" style={style}>
        {SpinnerContent}
      </View>
    );
  }

  // 内联模式
  return <View style={style}>{SpinnerContent}</View>;
};
