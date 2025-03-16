import React from 'react';
import { Stack, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import PressableButton from '@/components/PressableButton';
import { ThemeContext } from '../../../ThemeContext';

export default function RecipesLayout() {
  const { theme } = React.useContext(ThemeContext);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.navigationBackgroundColor },
        headerTintColor: theme.navigationTextColor,
        headerShown:false,
      }}
    >
      {/* Main Recipes list - has a top-right icon to navigate to "add" */}
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'All My Recipes',
        }}
      />


      {/* Add new Recipe screen - NO icon in the header, to avoid redundancy */}
      <Stack.Screen
        name="add"
        options={{ headerTitle: 'Add Recipe' }}
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
