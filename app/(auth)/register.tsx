/**
 * @author wanglezhi
 * @date 2025-11-28
 * @description 注册页面 - 与Web端保持一致
 */

import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Phone, Lock, ShieldCheck } from 'lucide-react-native';
import { useAuthStore } from '../../src/stores/auth';
import { authApi } from '../../src/api/auth';
import { Button, Input, GradientCard, Checkbox } from '@/components/ui';
import { Gradients, Colors } from '@/constants/colors';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();

  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 倒计时逻辑
  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [countdown]);

  // 验证手机号格式
  const isValidPhone = (phoneNumber: string): boolean => {
    return /^1\d{10}$/.test(phoneNumber);
  };

  // 发送验证码
  const handleSendCode = async () => {
    if (!phone.trim()) {
      Alert.alert('提示', '请输入手机号');
      return;
    }
    if (!isValidPhone(phone.trim())) {
      Alert.alert('提示', '请输入正确的11位手机号');
      return;
    }

    setIsSendingCode(true);
    try {
      await authApi.sendRegisterCode(phone.trim());
      setCountdown(60);
      Alert.alert('提示', '验证码已发送');
    } catch (err: any) {
      Alert.alert('发送失败', err.message || '请稍后重试');
    } finally {
      setIsSendingCode(false);
    }
  };

  // 注册
  const handleRegister = async () => {
    if (!username.trim()) {
      Alert.alert('提示', '请输入用户名');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('提示', '请输入手机号');
      return;
    }
    if (!isValidPhone(phone.trim())) {
      Alert.alert('提示', '请输入正确的11位手机号');
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
    if (!code.trim()) {
      Alert.alert('提示', '请输入验证码');
      return;
    }
    if (code.trim().length !== 6) {
      Alert.alert('提示', '请输入6位验证码');
      return;
    }
    if (!agreedToTerms) {
      Alert.alert('提示', '请阅读并同意服务条款和隐私政策');
      return;
    }

    try {
      await register({
        username: username.trim(),
        password,
        phone: phone.trim(),
        code: code.trim(),
      });
      Alert.alert('注册成功', '欢迎加入 GoDad！', [
        { text: '确定', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('注册失败', err.message || '请稍后重试');
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
          contentContainerStyle={{ padding: 20, paddingTop: 60 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* 标题区域 */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-neutral-800">欢迎加入</Text>
            <View className="flex-row mt-2">
              <Text className="text-neutral-500 text-base">已有账号？</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-primary-400 font-semibold ml-1 text-base">立即登录</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 表单卡片 */}
          <GradientCard variant="white" className="p-6">
            <View className="gap-4">
              {/* 用户名输入 */}
              <Input
                label="用户名"
                placeholder="中英文均可"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={20}
                icon={<User size={20} color={Colors.neutral[400]} />}
              />

              {/* 手机号输入 */}
              <Input
                label="手机号"
                placeholder="请输入11位手机号"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={11}
                icon={<Phone size={20} color={Colors.neutral[400]} />}
              />

              {/* 密码输入 */}
              <Input
                label="密码"
                placeholder="设置密码"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                icon={<Lock size={20} color={Colors.neutral[400]} />}
              />

              {/* 验证码输入 */}
              <View>
                <Text className="text-sm font-medium text-neutral-700 mb-1.5">验证码</Text>
                <View className="flex-row items-center gap-3">
                  <View className="flex-1">
                    <Input
                      placeholder="6位验证码"
                      value={code}
                      onChangeText={setCode}
                      keyboardType="number-pad"
                      maxLength={6}
                      icon={<ShieldCheck size={20} color={Colors.neutral[400]} />}
                    />
                  </View>
                  <Button
                    variant={countdown > 0 ? 'outline' : 'primary'}
                    size="md"
                    onPress={handleSendCode}
                    disabled={countdown > 0 || isSendingCode}
                    loading={isSendingCode}
                    style={{ minWidth: 110 }}
                  >
                    {countdown > 0 ? `${countdown}s` : '获取验证码'}
                  </Button>
                </View>
              </View>

              {/* 用户协议复选框 */}
              <View className="flex-row items-center mt-2">
                <Checkbox
                  checked={agreedToTerms}
                  onChange={setAgreedToTerms}
                />
                <Text className="text-neutral-600 text-sm ml-2 flex-1">
                  我已阅读并同意{' '}
                  <Text className="text-primary-400 font-medium">服务条款</Text>
                  {' '}和{' '}
                  <Text className="text-primary-400 font-medium">隐私政策</Text>
                </Text>
              </View>

              {/* 注册按钮 */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                onPress={handleRegister}
                disabled={!agreedToTerms}
                className="mt-2"
              >
                立即加入
              </Button>
            </View>
          </GradientCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
