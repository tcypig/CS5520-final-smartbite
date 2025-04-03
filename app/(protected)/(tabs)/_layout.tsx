import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../../ThemeContext';

export default function TabsLayout() {
  const { theme } = useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: currentTheme.navigationBackgroundColor },
        tabBarActiveTintColor: currentTheme.navigationTextColor,
        tabBarInactiveTintColor: "#AAA",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(recipes)"
        options={{
          title: 'Recipes',
          headerTitle: 'All My Recipes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(nutritions)"
        options={{
          headerShown: false,
          title: 'Nutrition',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(others)"
        options={{
          title: 'Settings',
          headerTitle: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

