import { View, Text, StyleSheet, Button } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import BackArrow from '@/components/BackArrow';

export default function Step2ModeSelect() {
  const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();

  function goManual() {
    router.push({
      pathname: '/(tabs)/(recipes)/AddRecipeWizard/Step3EditConfirm',
      params: {
        imageUri,
        mode: 'manual',
      },
    });
  }

  function goAI() {
    router.push({
      pathname: '/(tabs)/(recipes)/AddRecipeWizard/Step3EditConfirm',
      params: {
        imageUri,
        mode: 'ai',
      },
    });
  }

  return (
    <View style={styles.container}>
      {/* Custom Back Arrow */}
      <BackArrow style={styles.backArrow} />

      <Text style={styles.title}>Step 2: Choose Input Mode</Text>

      <View style={styles.buttonContainer}>
        <Button title="Manual Input" onPress={goManual} />
        <Button title="AI Mode" onPress={goAI} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  backArrow: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -20 }],
    zIndex: 10,
  },
  title: {
    marginTop: 50,
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 40,
    gap: 12,
    alignItems: 'center',
  },
});
