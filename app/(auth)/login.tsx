import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/stores/auth';

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
      router.back();
    } catch (err: any) {
      Alert.alert('登录失败', err.message || '请检查用户名和密码');
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo 区域 */}
        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-primary-500 rounded-2xl items-center justify-center mb-4">
            <Text className="text-white text-3xl font-bold">G</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800">欢迎回来</Text>
          <Text className="text-gray-400 mt-1">登录您的 GoDad 账号</Text>
        </View>

        {/* 表单区域 */}
        <View className="gap-4">
          {/* 用户名输入 */}
          <View className="bg-gray-50 rounded-xl flex-row items-center px-4">
            <Ionicons name="person-outline" size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 py-4 px-3 text-base text-gray-800"
              placeholder="用户名/手机号"
              placeholderTextColor="#9ca3af"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* 密码输入 */}
          <View className="bg-gray-50 rounded-xl flex-row items-center px-4">
            <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 py-4 px-3 text-base text-gray-800"
              placeholder="密码"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#9ca3af"
              />
            </TouchableOpacity>
          </View>

          {/* 忘记密码 */}
          <TouchableOpacity
            className="self-end"
            onPress={() => router.push('/(auth)/forgot-password')}
          >
            <Text className="text-primary-500">忘记密码？</Text>
          </TouchableOpacity>

          {/* 登录按钮 */}
          <TouchableOpacity
            className={`bg-primary-500 rounded-xl py-4 items-center mt-4 ${
              isLoading ? 'opacity-70' : ''
            }`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg font-semibold">登录</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 分割线 */}
        <View className="flex-row items-center my-8">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="text-gray-400 mx-4">或</Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>

        {/* 第三方登录 */}
        <View className="flex-row justify-center gap-6">
          <TouchableOpacity className="w-12 h-12 bg-green-500 rounded-full items-center justify-center">
            <Ionicons name="logo-wechat" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center">
            <Ionicons name="phone-portrait-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 注册入口 */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-400">还没有账号？</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text className="text-primary-500 font-medium ml-1">立即注册</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
