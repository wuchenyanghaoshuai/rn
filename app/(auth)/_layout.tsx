import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#374151',
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: '登录',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: '注册',
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: '忘记密码',
        }}
      />
    </Stack>
  );
}
