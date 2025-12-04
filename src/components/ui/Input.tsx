/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 输入框组件 - 方案A设计系统
 */

import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  secureTextEntry?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  secureTextEntry,
  className,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const showPassword = secureTextEntry && !isPasswordVisible;

  return (
    <View className={className}>
      {label && (
        <Text className="text-sm font-medium text-neutral-700 mb-2">
          {label}
        </Text>
      )}

      <View
        className={`
          flex-row items-center
          bg-white
          rounded-xl
          px-4
          border-2
          ${error ? 'border-error' : isFocused ? 'border-primary-400' : 'border-neutral-200'}
        `}
      >
        {icon && <View className="mr-2">{icon}</View>}

        <TextInput
          className="flex-1 h-12 text-base text-neutral-800"
          placeholderTextColor={Colors.neutral[400]}
          secureTextEntry={showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="p-1"
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={Colors.neutral[400]} />
            ) : (
              <Eye size={20} color={Colors.neutral[400]} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="text-sm text-error mt-1">{error}</Text>
      )}
    </View>
  );
};
