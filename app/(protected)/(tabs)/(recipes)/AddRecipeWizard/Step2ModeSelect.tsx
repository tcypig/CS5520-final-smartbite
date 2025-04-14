import React, {useEffect, useContext, useState} from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import BackArrow from '@/components/BackArrow';
import { ThemeContext } from '@/ThemeContext';

export default function Step2ModeSelect() {
    const { theme } = useContext(ThemeContext);
    const [currentTheme, setCurrentTheme] = useState(theme);
  
    useEffect(() => {
      setCurrentTheme(theme);
    }, [theme]);
  const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();

  function goManual() {
    router.push({
      pathname: '/(tabs)/(recipes)/AddRecipeWizard/Step3EditConfirm',
      params: { imageUri, mode: 'manual' },
    });
  }

  function goAI() {
    router.push({
      pathname: '/(tabs)/(recipes)/AddRecipeWizard/Step3EditConfirm',
      params: { imageUri, mode: 'ai' },
    });
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <BackArrow style={styles.backArrow} />

      <View style={styles.content}>
        <Text style={[styles.title, { color: currentTheme.text }]}>🧭 Step 2: Choose Input Mode</Text>
        <Text style={[styles.subtitle, { color: currentTheme.text }]}>Select how you want to provide your recipe data</Text>

        <View style={styles.buttonStack}>
          <Pressable 
            style={({pressed}) => [styles.button, pressed && styles.buttonPressed]}
            onPress={goManual}
          >
            <Text style={styles.buttonText}>✍️ Manual Input</Text>
          </Pressable>

          <Pressable 
            style={({pressed}) => [styles.button, pressed && styles.buttonPressed]}
            onPress={goAI}
          >
            <Text style={styles.buttonText}>🤖 AI Mode</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -22 }],
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonStack: {
    gap: 16,
    width: '100%',
    marginTop: 16,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
    minWidth: 260,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },  
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});