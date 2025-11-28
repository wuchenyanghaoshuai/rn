import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/stores/auth';

const { width, height } = Dimensions.get('window');
const logo = require('../assets/logo.png');

export default function SplashScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (!isInitialized || hasNavigated) return;

    const timer = setTimeout(() => {
      handleContinue();
    }, 2500);

    return () => clearTimeout(timer);
  }, [isInitialized, hasNavigated, isAuthenticated]);

  const handleContinue = () => {
    if (hasNavigated) return;
    setHasNavigated(true);
    router.replace(isAuthenticated ? '/(tabs)' : '/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* 背景装饰圆 */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />
      <View style={styles.decorCircle3} />

      <SafeAreaView style={styles.safeArea}>
        {/* Logo区域 */}
        <Animated.View
          entering={FadeIn.duration(800)}
          style={styles.logoContainer}
        >
          <View style={styles.logoWrapper}>
            <Image source={logo} style={styles.logo} />
          </View>
        </Animated.View>

        {/* Slogan区域 */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(800)}
          style={styles.sloganContainer}
        >
          <Text style={styles.sloganTitle}>用科技</Text>
          <Text style={styles.sloganBody}>
            陪伴每个家庭{'\n'}见证每一个珍贵时刻
          </Text>
        </Animated.View>

        {/* 底部标语 */}
        <Animated.View
          entering={FadeInDown.delay(800).duration(800)}
          style={styles.footer}
        >
          <Text style={styles.footerText}>科学育儿 · 轻量社区</Text>
          <View style={styles.loadingDots}>
            <Animated.View
              entering={FadeIn.delay(1200).duration(400)}
              style={[styles.dot, { backgroundColor: '#e76f51' }]}
            />
            <Animated.View
              entering={FadeIn.delay(1400).duration(400)}
              style={[styles.dot, { backgroundColor: '#f4a261' }]}
            />
            <Animated.View
              entering={FadeIn.delay(1600).duration(400)}
              style={[styles.dot, { backgroundColor: '#2a9d8f' }]}
            />
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef7f0',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  // 装饰圆
  decorCircle1: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(231, 111, 81, 0.08)',
    top: -width * 0.3,
    right: -width * 0.2,
  },
  decorCircle2: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: 'rgba(42, 157, 143, 0.06)',
    bottom: -width * 0.15,
    left: -width * 0.2,
  },
  decorCircle3: {
    position: 'absolute',
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: 'rgba(244, 162, 97, 0.08)',
    bottom: height * 0.25,
    right: -width * 0.1,
  },
  // Logo
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    width: 180,
    height: 180,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e76f51',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
  // Slogan
  sloganContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  sloganTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#e76f51',
    letterSpacing: 4,
    marginBottom: 12,
  },
  sloganBody: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: 1,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#9ca3af',
    letterSpacing: 2,
    marginBottom: 16,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
