import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { ThemeContext } from '../../../../ThemeContext';

export default function RecipesLayout() {
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
      {/* Main Recipes list */}
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'All My Recipes',
        }}
      />
      
      {/* Add new Recipe screen */}
      <Stack.Screen
        name="add"
        options={{
          headerTitle: 'Add Recipe',
        }}
      />

      {/* Single Recipe detail screen */}
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: 'Recipe Details',
        }}
      />
    </Stack>
  );
}
