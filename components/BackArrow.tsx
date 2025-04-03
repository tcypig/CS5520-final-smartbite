import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface BackArrowProps {
  onPress?: () => void;
  color?: string;
  size?: number;
  style?: ViewStyle | ViewStyle[];
}

export default function BackArrow({
  onPress,
  color = '#000',
  size = 24,
  style,
}: BackArrowProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <Pressable onPress={handlePress} style={[styles.container, style]}>
      <Ionicons name="chevron-back" size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
