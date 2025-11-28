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
import { authApi } from '../../src/api/auth';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendReset = async () => {
    if (!email.trim()) {
      Alert.alert('提示', '请输入邮箱地址');
      return;
    }

    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('提示', '请输入有效的邮箱地址');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
      Alert.alert(
        '发送成功',
        '重置密码链接已发送到您的邮箱，请查收',
        [{ text: '确定' }]
      );
    } catch (err: any) {
      Alert.alert('发送失败', err.message || '请稍后重试');
    } finally {
      setIsLoading(false);
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
        {/* 图标 */}
        <View className="items-center my-8">
          <View className="w-20 h-20 bg-primary-50 rounded-full items-center justify-center">
            <Ionicons name="key-outline" size={40} color="#e76f51" />
          </View>
        </View>

        {/* 标题 */}
        <View className="items-center mb-8">
          <Text className="text-2xl font-bold text-gray-800">忘记密码</Text>
          <Text className="text-gray-400 mt-2 text-center">
            输入您注册时使用的邮箱，{'\n'}我们将发送重置密码链接给您
          </Text>
        </View>

        {/* 表单 */}
        <View className="gap-4">
          <View className="bg-gray-50 rounded-xl flex-row items-center px-4">
            <Ionicons name="mail-outline" size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 py-4 px-3 text-base text-gray-800"
              placeholder="请输入邮箱地址"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!sent}
            />
          </View>

          <TouchableOpacity
            className={`bg-primary-500 rounded-xl py-4 items-center mt-4 ${
              isLoading || sent ? 'opacity-70' : ''
            }`}
            onPress={handleSendReset}
            disabled={isLoading || sent}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg font-semibold">
                {sent ? '已发送' : '发送重置链接'}
              </Text>
            )}
          </TouchableOpacity>

          {sent && (
            <TouchableOpacity
              className="py-3 items-center"
              onPress={() => {
                setSent(false);
                setEmail('');
              }}
            >
              <Text className="text-primary-500">重新发送</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 返回登录 */}
        <TouchableOpacity
          className="flex-row items-center justify-center mt-8"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#e76f51" />
          <Text className="text-primary-500 ml-1">返回登录</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
