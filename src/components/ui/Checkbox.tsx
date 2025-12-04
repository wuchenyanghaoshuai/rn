/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 复选框组件 - 方案A设计系统
 * 带流畅动画的复选框,支持标签和禁用状态
 */

import React, { useEffect } from 'react';
import { TouchableOpacity, Text, View, ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/colors';

interface CheckboxProps extends Omit<ViewProps, 'children'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  style,
  className = '',
  ...props
}) => {
  const progress = useSharedValue(checked ? 1 : 0);

  // 尺寸配置
  const sizes = {
    sm: { box: 18, text: 'text-sm', iconSize: 14 },
    md: { box: 22, text: 'text-base', iconSize: 16 },
    lg: { box: 26, text: 'text-lg', iconSize: 18 },
  };

  const { box: boxSize, text: textSize, iconSize } = sizes[size];

  useEffect(() => {
    progress.value = withSpring(checked ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });
  }, [checked]);

  // 缩放动画
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: progress.value }],
  }));

  // 边框颜色动画
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
      onChange(!checked);
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
      {/* 复选框 */}
      <Animated.View
        style={[
          {
            width: boxSize,
            height: boxSize,
            borderRadius: 6,
            borderWidth: 2,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          },
          borderStyle,
        ]}
      >
        {checked && (
          <LinearGradient
            colors={Gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
          />
        )}
        {checked && (
          <Animated.View style={animatedStyle}>
            <Check size={iconSize} color="white" strokeWidth={3} />
          </Animated.View>
        )}
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
