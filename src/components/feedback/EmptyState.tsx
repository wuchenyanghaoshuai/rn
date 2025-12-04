/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 空状态组件 - 方案A设计系统
 * 支持自定义图标、标题、描述、操作按钮
 */

import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { Inbox, Search, FileX, AlertCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Button } from '../ui/Button';

interface EmptyStateProps extends ViewProps {
  variant?: 'default' | 'search' | 'error' | 'custom';
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'default',
  icon,
  title,
  description,
  actionText,
  onAction,
  style,
  ...props
}) => {
  // 默认图标配置
  const defaultIcons = {
    default: <Inbox size={64} color={Colors.neutral[300]} strokeWidth={1.5} />,
    search: <Search size={64} color={Colors.neutral[300]} strokeWidth={1.5} />,
    error: <AlertCircle size={64} color={Colors.error} strokeWidth={1.5} />,
    custom: <FileX size={64} color={Colors.neutral[300]} strokeWidth={1.5} />,
  };

  const displayIcon = icon || defaultIcons[variant];

  return (
    <View
      className="flex-1 items-center justify-center px-8 py-12"
      style={style}
      {...props}
    >
      {/* 图标 */}
      <View className="mb-4">{displayIcon}</View>

      {/* 标题 */}
      <Text className="text-xl font-semibold text-neutral-800 text-center mb-2">
        {title}
      </Text>

      {/* 描述 */}
      {description && (
        <Text className="text-base text-neutral-500 text-center mb-6 leading-6">
          {description}
        </Text>
      )}

      {/* 操作按钮 */}
      {actionText && onAction && (
        <Button variant="primary" size="md" onPress={onAction}>
          {actionText}
        </Button>
      )}
    </View>
  );
};
