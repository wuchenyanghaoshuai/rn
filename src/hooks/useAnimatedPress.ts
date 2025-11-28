import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface UseAnimatedPressOptions {
  scaleValue?: number;
  damping?: number;
  stiffness?: number;
}

export function useAnimatedPress(options: UseAnimatedPressOptions = {}) {
  const { scaleValue = 0.97, damping = 15, stiffness = 400 } = options;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(scaleValue, { damping, stiffness });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping, stiffness });
  };

  return { animatedStyle, onPressIn, onPressOut };
}
