import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import ImageManager from '@/components/ImageManager';

export default function Step1SelectImage() {
  const [imageUri, setImageUri] = useState('');

  function handleNext() {
    // if no photo, either skip or go back
    if (!imageUri) {
      Alert.alert('No Image', 'You have not choose a photo yet，or click skip to go next page');
      return;
    }
    router.push({
      pathname: '/(tabs)/(recipes)/AddRecipeWizard/Step2ModeSelect',
      params: { imageUri },
    });
  }

  function handleSkip() {
    // empty string means skip
    router.push({
      pathname: '/(tabs)/(recipes)/AddRecipeWizard/Step2ModeSelect',
      params: { imageUri: '' },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step 1: Select or Skip Photo</Text>

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      ) : (
        <Text style={{ marginVertical: 10 }}>No image chosen yet...</Text>
      )}

      <ImageManager imageUriHandler={setImageUri} />

      <View style={styles.buttonRow}>
        <Button title="Next" onPress={handleNext} />
        <Button title="Skip" onPress={handleSkip} color="#888" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginTop: 50,
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 30,
    justifyContent: 'center',
  },
});
