/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 标签组件 - 方案A设计系统
 * 支持多种颜色变体、可关闭、图标
 */

import React from 'react';
import { View, Text, TouchableOpacity, ViewProps } from 'react-native';
import { X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/colors';

interface TagProps extends ViewProps {
  variant?: 'primary' | 'lavender' | 'mint' | 'sky' | 'butter' | 'rose' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  closable?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Tag: React.FC<TagProps> = ({
  variant = 'neutral',
  size = 'md',
  closable = false,
  onClose,
  icon,
  children,
  style,
  className = '',
  ...props
}) => {
  // 尺寸配置
  const sizes = {
    sm: { height: 24, padding: 'px-2', text: 'text-xs', iconSize: 12 },
    md: { height: 28, padding: 'px-2.5', text: 'text-sm', iconSize: 14 },
    lg: { height: 32, padding: 'px-3', text: 'text-base', iconSize: 16 },
  };

  const { height, padding, text: textSize, iconSize } = sizes[size];

  // 颜色配置
  const colors = {
    primary: { bg: Gradients.primary, text: Colors.neutral[800] },
    lavender: { bg: [Colors.lavender.light, Colors.lavender.DEFAULT] as const, text: Colors.neutral[800] },
    mint: { bg: [Colors.mint.light, Colors.mint.DEFAULT] as const, text: Colors.neutral[800] },
    sky: { bg: [Colors.sky.light, Colors.sky.DEFAULT] as const, text: Colors.neutral[800] },
    butter: { bg: [Colors.butter.light, Colors.butter.DEFAULT] as const, text: Colors.neutral[800] },
    rose: { bg: [Colors.rose.light, Colors.rose.DEFAULT] as const, text: Colors.neutral[800] },
    neutral: { bg: [Colors.neutral[100], Colors.neutral[200]] as const, text: Colors.neutral[700] },
  };

  const colorConfig = colors[variant];

  return (
    <LinearGradient
      colors={colorConfig.bg as readonly [string, string, ...string[]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className={`rounded-full flex-row items-center ${padding} ${className}`}
      style={[{ height }, style]}
      {...props}
    >
      {icon && <View className="mr-1">{icon}</View>}
      
      <Text className={`${textSize} font-medium`} style={{ color: colorConfig.text }}>
        {children}
      </Text>

      {closable && onClose && (
        <>
          <View className="w-1" />
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="ml-1"
          >
            <X size={iconSize} color={colorConfig.text} strokeWidth={2.5} />
          </TouchableOpacity>
        </>
      )}
    </LinearGradient>
  );
};
