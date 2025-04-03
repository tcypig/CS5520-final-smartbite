import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function AddRecipeScrreen() {
  const router = useRouter();

  function handleStart() {
    router.push('/(tabs)/(recipes)/AddRecipeWizard/Step1SelectImage');
  }

  return (
    <View style={styles.container}>
      <Button title="Start Add Recipe" onPress={handleStart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});