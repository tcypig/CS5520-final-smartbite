import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { ThemeContext } from '../../../../ThemeContext';

export default function OthersLayout() {
  const { theme } = React.useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);

  // Update layout when theme changes
  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: currentTheme.navigationBackgroundColor },
        headerTintColor: currentTheme.navigationTextColor,
        headerBackTitle: 'Back',
        headerBackVisible: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'Settings',
        }}
      />
    </Stack>
  );
} 

      // {/* Register a stack screen for preferences */}
      // <Stack.Screen
      //   name="preferences/index"
      //   options={{
      //     headerTitle: 'Preferences',
      //   }}
      // />

      // {/* If you want a single preference detail/edit page */}
      // <Stack.Screen
      //   name="preferences/[id]"
      //   options={{
      //     headerTitle: 'Preference Detail',
      //   }}
      // />