import { Stack } from 'expo-router';
import { ThemeContext } from '../../../../../ThemeContext';
import React, { useEffect, useState } from 'react';

export default function AddRecipeWizardLayout() {
    const { theme } = React.useContext(ThemeContext);
    const [currentTheme, setCurrentTheme] = useState(theme);
      // Update layout when theme changes
  useEffect(() => {
    setCurrentTheme(theme);

  }, [theme]);
  return (
    
    <Stack screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Step1SelectImage" options={{ title: 'Step 1: Image' }} />
      <Stack.Screen name="Step2ModeSelect"  options={{ title: 'Step 2: Mode' }} />
      <Stack.Screen name="Step3EditConfirm" options={{ title: 'Step 3: Edit & Confirm' }} />
    </Stack>
  );
}
