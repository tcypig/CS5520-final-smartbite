// 🚀 Step 1: Select Image
import React, {useEffect, useContext, useState} from 'react';
import { View, Text, StyleSheet, Image, Alert, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import ImageManager from '@/components/ImageManager';
import PressableButton from '@/components/PressableButton';
import { ThemeContext } from '@/ThemeContext';

export default function Step1SelectImage() {
  const [imageUri, setImageUri] = useState('');
  const { theme } = useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);
  
    useEffect(() => {
        setCurrentTheme(theme);
    }, [theme]);

  function handleNext() {
    if (!imageUri) {
      Alert.alert('No Image', 'Please choose a photo or skip.');
      return;
    }
    router.push({ pathname: '/(tabs)/(recipes)/AddRecipeWizard/Step2ModeSelect', params: { imageUri } });
  }

  function handleSkip() {
    router.push({ pathname: '/(tabs)/(recipes)/AddRecipeWizard/Step2ModeSelect', params: { imageUri } });
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: currentTheme.text }]}>
          Upload a photo to help AI recognize ingredients
        </Text>

        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.placeholderText}>No image selected yet...</Text>
        )}

        <ImageManager imageUriHandler={setImageUri} />

        <View style={styles.buttonRow}>
          <PressableButton pressedHandler={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </PressableButton>
          <PressableButton pressedHandler={handleSkip} componentStyle={{ backgroundColor: '#AAA' }}>
            <Text style={styles.buttonText}>Skip</Text>
          </PressableButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  subtitle: { 
    fontSize: 18, 
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 24
  },
  imagePreview: { width: 220, height: 220, borderRadius: 12, marginBottom: 16 },
  placeholderText: { marginVertical: 16, color: '#aaa' },
  buttonRow: { flexDirection: 'row', gap: 16, marginTop: 24 },
  buttonText: { color: '#fff', fontWeight: '600' },
});