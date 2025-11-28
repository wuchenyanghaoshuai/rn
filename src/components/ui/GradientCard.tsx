import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Pressable } from 'react-native';

export type GradientVariant = 'pink' | 'blue' | 'mint' | 'sunset' | 'warm' | 'white';

interface GradientCardProps {
  children: React.ReactNode;
  variant?: GradientVariant;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  animated?: boolean;
}

const GRADIENTS: Record<GradientVariant, string[]> = {
  pink: ['#fdf2f8', '#fce7f3'],
  blue: ['#f0f9ff', '#e0f2fe'],
  mint: ['#f0fdf4', '#dcfce7'],
  sunset: ['#fef7f0', '#fdf2f8'],
  warm: ['#fffbf5', '#fef7f0'],
  white: ['#ffffff', '#fafafa'],
};

const SHADOW_COLORS: Record<GradientVariant, string> = {
  pink: 'rgba(236, 72, 153, 0.15)',
  blue: 'rgba(14, 165, 233, 0.15)',
  mint: 'rgba(34, 197, 94, 0.15)',
  sunset: 'rgba(231, 111, 81, 0.15)',
  warm: 'rgba(231, 111, 81, 0.1)',
  white: 'rgba(0, 0, 0, 0.08)',
};

export default function GradientCard({ children, variant = 'white', style, onPress, animated = true }: GradientCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (animated && onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    if (animated && onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  const cardContent = (
    <LinearGradient colors={GRADIENTS[variant]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.gradient, style]}>
      {children}
    </LinearGradient>
  );

  if (onPress) {
    return (
      <Animated.View style={[styles.container, { shadowColor: SHADOW_COLORS[variant] }, animatedStyle]}>
        <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
          {cardContent}
        </Pressable>
      </Animated.View>
    );
  }

  return <View style={[styles.container, { shadowColor: SHADOW_COLORS[variant] }]}>{cardContent}</View>;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  gradient: {
    borderRadius: 16,
    overflow: 'hidden',
  },
});
