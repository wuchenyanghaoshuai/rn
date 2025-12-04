/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 单选框组件 - 方案A设计系统
 * 带流畅动画的单选框,支持标签和禁用状态
 */

import React, { useEffect } from 'react';
import { TouchableOpacity, Text, View, ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/colors';

interface RadioProps extends Omit<ViewProps, 'children'> {
  selected: boolean;
  onSelect: () => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Radio: React.FC<RadioProps> = ({
  selected,
  onSelect,
  label,
  disabled = false,
  size = 'md',
  style,
  className = '',
  ...props
}) => {
  const progress = useSharedValue(selected ? 1 : 0);

  // 尺寸配置
  const sizes = {
    sm: { outer: 18, inner: 10, text: 'text-sm' },
    md: { outer: 22, inner: 12, text: 'text-base' },
    lg: { outer: 26, inner: 14, text: 'text-lg' },
  };

  const { outer: outerSize, inner: innerSize, text: textSize } = sizes[size];

  useEffect(() => {
    progress.value = withSpring(selected ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });
  }, [selected]);

  // 内圆缩放动画
  const innerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: progress.value }],
    opacity: progress.value,
  }));

  // 外圆边框颜色动画
  const borderStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      [Colors.neutral[300], Gradients.primary[0]]
    );
    return { borderColor };
  });

  const handlePress = () => {
    if (!disabled) {
      onSelect();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      disabled={disabled}
      style={[
        {
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      className={`flex-row items-center ${className}`}
      {...props}
    >
      {/* 单选框 */}
      <Animated.View
        style={[
          {
            width: outerSize,
            height: outerSize,
            borderRadius: outerSize / 2,
            borderWidth: 2,
            justifyContent: 'center',
            alignItems: 'center',
          },
          borderStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: innerSize,
              height: innerSize,
              borderRadius: innerSize / 2,
              overflow: 'hidden',
            },
            innerAnimatedStyle,
          ]}
        >
          <LinearGradient
            colors={Gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </Animated.View>
      </Animated.View>

      {/* 标签 */}
      {label && (
        <Text className={`${textSize} text-neutral-700 ml-2`}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};
