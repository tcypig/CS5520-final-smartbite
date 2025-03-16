import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';
import { ThemeContext } from '../../ThemeContext';

export default function TabsLayout() {
  const { theme } = useContext(ThemeContext);
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: theme.navigationBackgroundColor },
        tabBarActiveTintColor: theme.navigationTextColor,
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
          title: 'Nutrition',
          headerTitle: 'Nutrition Info',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

