import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useEffect } from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  size = 'large',
  text,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1200, easing: Easing.linear }),
      -1,
      false
    );
    scale.value = withRepeat(
      withTiming(1.1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  const spinnerSize = size === 'large' ? 48 : 32;
  const dotSize = size === 'large' ? 10 : 7;

  const SpinnerContent = () => (
    <View style={styles.spinnerContainer}>
      <Animated.View style={[styles.spinner, { width: spinnerSize, height: spinnerSize }, spinnerStyle]}>
        <LinearGradient
          colors={['#ec4899', '#f472b6', '#fce7f3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.spinnerGradient, { width: spinnerSize, height: spinnerSize, borderRadius: spinnerSize / 2 }]}
        >
          {/* 旋转的点 */}
          <View style={[styles.dot, styles.dot1, { width: dotSize, height: dotSize, borderRadius: dotSize / 2 }]} />
          <View style={[styles.dot, styles.dot2, { width: dotSize, height: dotSize, borderRadius: dotSize / 2 }]} />
          <View style={[styles.dot, styles.dot3, { width: dotSize, height: dotSize, borderRadius: dotSize / 2 }]} />
        </LinearGradient>
      </Animated.View>
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );

  if (fullScreen) {
    return (
      <View style={styles.fullScreenContainer}>
        <LinearGradient colors={['#fdf2f8', '#ffffff', '#f0f9ff']} style={StyleSheet.absoluteFill} />
        <SpinnerContent />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SpinnerContent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerContainer: {
    alignItems: 'center',
  },
  spinner: {
    position: 'relative',
  },
  spinnerGradient: {
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.2,
  },
  dot: {
    position: 'absolute',
    backgroundColor: '#ec4899',
  },
  dot1: {
    top: 2,
    left: '50%',
    marginLeft: -5,
  },
  dot2: {
    bottom: 6,
    left: 6,
  },
  dot3: {
    bottom: 6,
    right: 6,
  },
  text: {
    marginTop: 16,
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
});
