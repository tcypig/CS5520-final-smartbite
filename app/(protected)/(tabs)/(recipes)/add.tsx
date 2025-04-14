import React, {useEffect, useState, useContext} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '../../../../ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import PressableButton from '@/components/PressableButton';

export default function AddRecipeScreen() {
  const router = useRouter();
  const { theme } = React.useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  function handleStart() {
    router.push('/(tabs)/(recipes)/AddRecipeWizard/Step1SelectImage');
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconWrapper, { backgroundColor: theme.cardBackground }]}>
          <Ionicons name="add-circle-outline" size={64} color={theme.navigationBackgroundColor} />
        </View>

        <Text style={[styles.headline, { color: theme.text }]}>Ready to Create Something Delicious?</Text>

        <Text style={[styles.subtext, { color: '#777' }]}>
          Snap a photo of your meal or skip straight to the details.
        </Text>

        <PressableButton
          pressedHandler={handleStart}
          componentStyle={styles.button}
          pressedStyle={styles.buttonPressed}
        >
          <Ionicons name="arrow-forward" size={20} color="#fff" />
          <Text style={styles.buttonText}>Start Now</Text>
        </PressableButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 20,
  },
  iconWrapper: {
    padding: 20,
    borderRadius: 100,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  headline: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  subtext: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    color: '#777',
    maxWidth: 300,
    paddingHorizontal: 12,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // 
    alignSelf: 'center',    
    elevation: 3,
  },  
  buttonPressed: {
    opacity: 0.8,
    backgroundColor: '#005BBB',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
});
