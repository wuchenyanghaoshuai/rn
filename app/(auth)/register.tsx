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

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();

  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!username.trim()) {
      Alert.alert('提示', '请输入用户名');
      return;
    }
    if (username.trim().length < 4) {
      Alert.alert('提示', '用户名至少4个字符');
      return;
    }
    if (!password.trim()) {
      Alert.alert('提示', '请输入密码');
      return;
    }
    if (password.length < 6) {
      Alert.alert('提示', '密码至少6个字符');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('提示', '两次输入的密码不一致');
      return;
    }

    try {
      await register({
        username: username.trim(),
        password,
        nickname: nickname.trim() || undefined,
      });
      Alert.alert('注册成功', '欢迎加入 GoDad！', [
        { text: '确定', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('注册失败', err.message || '请稍后重试');
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* 标题区域 */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-gray-800">创建账号</Text>
          <Text className="text-gray-400 mt-1">加入 GoDad，开启育儿之旅</Text>
        </View>

        {/* 表单区域 */}
        <View className="gap-4">
          {/* 用户名输入 */}
          <View>
            <Text className="text-gray-600 mb-2 font-medium">用户名 *</Text>
            <View className="bg-gray-50 rounded-xl flex-row items-center px-4">
              <Ionicons name="person-outline" size={20} color="#9ca3af" />
              <TextInput
                className="flex-1 py-4 px-3 text-base text-gray-800"
                placeholder="设置用户名（4-20个字符）"
                placeholderTextColor="#9ca3af"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={20}
              />
            </View>
          </View>

          {/* 昵称输入 */}
          <View>
            <Text className="text-gray-600 mb-2 font-medium">昵称（可选）</Text>
            <View className="bg-gray-50 rounded-xl flex-row items-center px-4">
              <Ionicons name="happy-outline" size={20} color="#9ca3af" />
              <TextInput
                className="flex-1 py-4 px-3 text-base text-gray-800"
                placeholder="设置昵称"
                placeholderTextColor="#9ca3af"
                value={nickname}
                onChangeText={setNickname}
                maxLength={20}
              />
            </View>
          </View>

          {/* 密码输入 */}
          <View>
            <Text className="text-gray-600 mb-2 font-medium">密码 *</Text>
            <View className="bg-gray-50 rounded-xl flex-row items-center px-4">
              <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
              <TextInput
                className="flex-1 py-4 px-3 text-base text-gray-800"
                placeholder="设置密码（至少6位）"
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
          </View>

          {/* 确认密码 */}
          <View>
            <Text className="text-gray-600 mb-2 font-medium">确认密码 *</Text>
            <View className="bg-gray-50 rounded-xl flex-row items-center px-4">
              <Ionicons name="shield-checkmark-outline" size={20} color="#9ca3af" />
              <TextInput
                className="flex-1 py-4 px-3 text-base text-gray-800"
                placeholder="再次输入密码"
                placeholderTextColor="#9ca3af"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>
          </View>

          {/* 注册按钮 */}
          <TouchableOpacity
            className={`bg-primary-500 rounded-xl py-4 items-center mt-4 ${
              isLoading ? 'opacity-70' : ''
            }`}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg font-semibold">注册</Text>
            )}
          </TouchableOpacity>

          {/* 用户协议 */}
          <Text className="text-center text-gray-400 text-sm mt-4">
            注册即表示同意{' '}
            <Text className="text-primary-500">《用户协议》</Text>
            {' '}和{' '}
            <Text className="text-primary-500">《隐私政策》</Text>
          </Text>
        </View>

        {/* 登录入口 */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-400">已有账号？</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-primary-500 font-medium ml-1">立即登录</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
