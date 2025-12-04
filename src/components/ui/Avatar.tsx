/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 头像组件 - 方案A设计系统
 * 支持图片、文字回退、4种尺寸、在线状态指示器
 */

import React from 'react';
import { View, Text, Image, ImageProps, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradients, Colors } from '@/constants/colors';

interface AvatarProps extends ViewProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  source?: ImageProps['source'];
  name?: string;
  status?: 'online' | 'offline' | 'busy';
  showStatus?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  source,
  name,
  status,
  showStatus = false,
  style,
  ...props
}) => {
  // 尺寸配置
  const sizes = {
    sm: { avatar: 32, text: 'text-sm', status: 8 },
    md: { avatar: 48, text: 'text-lg', status: 12 },
    lg: { avatar: 64, text: 'text-2xl', status: 14 },
    xl: { avatar: 96, text: 'text-4xl', status: 16 },
  };

  const { avatar: avatarSize, text: textSize, status: statusSize } = sizes[size];

  // 状态颜色
  const statusColors = {
    online: Colors.success,
    offline: Colors.neutral[300],
    busy: Colors.error,
  };

  // 获取名字首字母
  const getInitials = (name?: string): string => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <View style={[{ position: 'relative' }, style]} {...props}>
      {/* 头像主体 */}
      <View
        className="items-center justify-center overflow-hidden"
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
        }}
      >
        {source ? (
          // 图片头像
          <Image
            source={source}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          // 渐变背景 + 文字回退
          <LinearGradient
            colors={Gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-full h-full items-center justify-center"
          >
            <Text className={`${textSize} font-semibold text-white`}>
              {initials}
            </Text>
          </LinearGradient>
        )}
      </View>

      {/* 在线状态指示器 */}
      {showStatus && status && (
        <View
          className="absolute bottom-0 right-0 rounded-full border-2 border-white"
          style={{
            width: statusSize,
            height: statusSize,
            backgroundColor: statusColors[status],
          }}
        />
      )}
    </View>
  );
};
