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
      <Stack.Screen name="AllNutritions" options={{title: "Nutrition"}} />
      <Stack.Screen name="AddMeal" options={{title: "Add Meal"}} />
      <Stack.Screen name="EditMeal" options={{title: "Edit Meal"}} />
      <Stack.Screen name="MealDetail" options={{title: "Nutrition Detail"}} />
    </Stack>
  )
}