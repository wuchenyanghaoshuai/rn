/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 分割线组件 - 方案A设计系统
 * 支持水平/垂直方向、带文字、虚线样式
 */

import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { Colors } from '@/constants/colors';

interface DividerProps extends ViewProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed';
  color?: string;
  thickness?: number;
  text?: string;
  textPosition?: 'left' | 'center' | 'right';
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  color = Colors.neutral[200],
  thickness = 1,
  text,
  textPosition = 'center',
  style,
  className = '',
  ...props
}) => {
  // 垂直分割线
  if (orientation === 'vertical') {
    return (
      <View
        className={className}
        style={[
          {
            width: thickness,
            height: '100%',
            backgroundColor: variant === 'solid' ? color : 'transparent',
            borderLeftWidth: variant === 'dashed' ? thickness : 0,
            borderLeftColor: color,
            borderStyle: variant === 'dashed' ? 'dashed' : 'solid',
          },
          style,
        ]}
        {...props}
      />
    );
  }

  // 带文字的水平分割线
  if (text) {
    const textAlignStyles = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    };

    return (
      <View className={`flex-row items-center ${className}`} style={style} {...props}>
        {textPosition !== 'left' && (
          <View
            className="flex-1"
            style={{
              height: thickness,
              backgroundColor: variant === 'solid' ? color : 'transparent',
              borderTopWidth: variant === 'dashed' ? thickness : 0,
              borderTopColor: color,
              borderStyle: variant === 'dashed' ? 'dashed' : 'solid',
            }}
          />
        )}
        <Text className="px-3 text-sm text-neutral-500">{text}</Text>
        {textPosition !== 'right' && (
          <View
            className="flex-1"
            style={{
              height: thickness,
              backgroundColor: variant === 'solid' ? color : 'transparent',
              borderTopWidth: variant === 'dashed' ? thickness : 0,
              borderTopColor: color,
              borderStyle: variant === 'dashed' ? 'dashed' : 'solid',
            }}
          />
        )}
      </View>
    );
  }

  // 普通水平分割线
  return (
    <View
      className={className}
      style={[
        {
          height: thickness,
          width: '100%',
          backgroundColor: variant === 'solid' ? color : 'transparent',
          borderTopWidth: variant === 'dashed' ? thickness : 0,
          borderTopColor: color,
          borderStyle: variant === 'dashed' ? 'dashed' : 'solid',
        },
        style,
      ]}
      {...props}
    />
  );
};
