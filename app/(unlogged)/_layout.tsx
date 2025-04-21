import { ThemeContext } from '@/ThemeContext';
import { Stack } from 'expo-router'
import { useContext, useEffect, useState } from 'react';

export default function NutritionsLayout() {
  const { theme } = useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);

  // Update layout when theme changes
  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.navigationBackgroundColor },
        headerTintColor: theme.navigationTextColor,
      }}
    >
      <Stack.Screen name="guestScreen" options={{title: "Welcome"}} />
    </Stack>
  )
}