/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 登录页面 - 方案A设计系统重构版
 */

import { useState } from 'react';
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Lock } from 'lucide-react-native';
import { useAuthStore } from '../../src/stores/auth';
import { Button, Input, Divider, GradientCard } from '@/components/ui';
import { Gradients, Colors } from '@/constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert('提示', '请输入用户名或手机号');
      return;
    }
    if (!password.trim()) {
      Alert.alert('提示', '请输入密码');
      return;
    }

    try {
      await login({ username: username.trim(), password });
      router.replace('/(tabs)');
    } catch (err: any) {
      // 安全处理：不暴露具体错误，统一提示用户名或密码错误
      Alert.alert('登录失败', '用户名或密码错误');
    }
  };

  return (
    <LinearGradient
      colors={Gradients.pageBackground}
      className="flex-1"
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo 区域 */}
          <View className="items-center mb-8">
            <View
              className="w-36 h-36 rounded-3xl bg-white items-center justify-center mb-4"
              style={{ shadowColor: '#e76f51', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 10 }}
            >
              <Image
                source={require('../../assets/logo.png')}
                className="w-32 h-32"
                resizeMode="contain"
              />
            </View>
            <Text className="text-3xl font-bold text-neutral-800">欢迎回来</Text>
            <Text className="text-neutral-500 mt-2 text-base">登录您的 GoDad 账号</Text>
          </View>

          {/* 表单卡片 */}
          <GradientCard variant="white" className="p-6">
            <View className="gap-4">
              {/* 用户名输入 */}
              <Input
                placeholder="用户名/手机号"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                icon={<User size={20} color={Colors.neutral[400]} />}
              />

              {/* 密码输入 */}
              <Input
                placeholder="密码"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                icon={<Lock size={20} color={Colors.neutral[400]} />}
              />

              {/* 忘记密码 */}
              <TouchableOpacity
                className="self-end"
                onPress={() => router.push('/(auth)/forgot-password')}
              >
                <Text className="text-primary-400 font-medium">忘记密码？</Text>
              </TouchableOpacity>

              {/* 登录按钮 */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                onPress={handleLogin}
                className="mt-2"
              >
                登录
              </Button>
            </View>
          </GradientCard>

          {/* 分割线 */}
          <View className="my-8">
            <Divider text="或" />
          </View>

          {/* 第三方登录 */}
          <View className="flex-row justify-center gap-4">
            <TouchableOpacity
              className="w-14 h-14 bg-green-500 rounded-2xl items-center justify-center"
              style={{ shadowColor: '#22c55e', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 }}
            >
              <Text className="text-white text-2xl">微</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-14 h-14 bg-blue-500 rounded-2xl items-center justify-center"
              style={{ shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 }}
            >
              <Text className="text-white text-2xl">📱</Text>
            </TouchableOpacity>
          </View>

          {/* 注册入口 */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-neutral-600 text-base">还没有账号？</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text className="text-primary-400 font-semibold ml-1 text-base">立即注册</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
