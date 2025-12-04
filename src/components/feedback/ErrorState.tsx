/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 错误状态组件 - 方案A设计系统
 * 支持网络错误、服务器错误、权限错误等场景
 */

import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { WifiOff, ServerCrash, ShieldAlert, AlertTriangle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Button } from '../ui/Button';

interface ErrorStateProps extends ViewProps {
  type?: 'network' | 'server' | 'permission' | 'unknown';
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  showRetry?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = 'unknown',
  title,
  message,
  onRetry,
  retryText = '重试',
  showRetry = true,
  style,
  ...props
}) => {
  // 默认配置
  const errorConfigs = {
    network: {
      icon: <WifiOff size={64} color={Colors.error} strokeWidth={1.5} />,
      title: '网络连接失败',
      message: '请检查您的网络设置后重试',
    },
    server: {
      icon: <ServerCrash size={64} color={Colors.error} strokeWidth={1.5} />,
      title: '服务器错误',
      message: '服务器开小差了,请稍后再试',
    },
    permission: {
      icon: <ShieldAlert size={64} color={Colors.warning} strokeWidth={1.5} />,
      title: '权限不足',
      message: '您没有访问此内容的权限',
    },
    unknown: {
      icon: <AlertTriangle size={64} color={Colors.error} strokeWidth={1.5} />,
      title: '出错了',
      message: '发生了未知错误,请稍后再试',
    },
  };

  const config = errorConfigs[type];
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;

  return (
    <View
      className="flex-1 items-center justify-center px-8 py-12"
      style={style}
      {...props}
    >
      {/* 错误图标 */}
      <View className="mb-4">{config.icon}</View>

      {/* 错误标题 */}
      <Text className="text-xl font-semibold text-neutral-800 text-center mb-2">
        {displayTitle}
      </Text>

      {/* 错误描述 */}
      <Text className="text-base text-neutral-500 text-center mb-6 leading-6">
        {displayMessage}
      </Text>

      {/* 重试按钮 */}
      {showRetry && onRetry && (
        <Button variant="primary" size="md" onPress={onRetry}>
          {retryText}
        </Button>
      )}
    </View>
  );
};
