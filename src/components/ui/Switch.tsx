/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 开关组件 - 方案A设计系统
 * 带平滑动画效果的开关切换
 */

import React, { useEffect } from 'react';
import { TouchableOpacity, ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/colors';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewProps['style'];
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  size = 'md',
  style,
  className,
}) => {
  const progress = useSharedValue(value ? 1 : 0);

  // 尺寸配置
  const sizes = {
    sm: { width: 44, height: 24, thumbSize: 20, padding: 2 },
    md: { width: 52, height: 28, thumbSize: 24, padding: 2 },
    lg: { width: 60, height: 32, thumbSize: 28, padding: 2 },
  };

  const { width, height, thumbSize, padding } = sizes[size];

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [value]);

  // 滑块位置动画
  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const translateX = progress.value * (width - thumbSize - padding * 2);
    return {
      transform: [{ translateX }],
    };
  });

  // 背景颜色动画
  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [Colors.neutral[300], Gradients.primary[0]]
    );
    return { backgroundColor };
  });

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled}
      style={[
        {
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          {
            width,
            height,
            borderRadius: height / 2,
            padding,
            justifyContent: 'center',
          },
          backgroundAnimatedStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 3,
            },
            thumbAnimatedStyle,
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};
