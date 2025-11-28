import { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

export function useAnimatedLike() {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const triggerLike = () => {
    scale.value = withSequence(
      withSpring(1.4, { damping: 6, stiffness: 400 }),
      withSpring(0.9, { damping: 6, stiffness: 400 }),
      withSpring(1.1, { damping: 8, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 400 })
    );
    rotation.value = withSequence(
      withTiming(-15, { duration: 100 }),
      withTiming(15, { duration: 100 }),
      withTiming(-10, { duration: 80 }),
      withTiming(10, { duration: 80 }),
      withTiming(0, { duration: 60 })
    );
  };

  const triggerUnlike = () => {
    scale.value = withSequence(
      withTiming(0.8, { duration: 100 }),
      withSpring(1, { damping: 15, stiffness: 400 })
    );
  };

  return { animatedStyle, triggerLike, triggerUnlike };
}
