import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen 
        name="(recipes)" 
        options={{
          headerShown: false,
          title: "Recipes",
          tabBarIcon: ({color}) => (
            <Ionicons name="fast-food-outline" size={24} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="(nutritions)" 
        options={{
          headerShown: false,
          title: "Nutritions",
          tabBarIcon: ({color}) => (
            <Ionicons name="leaf-outline" size={24} color={color} />
          ),
        }} 
      />
    </Tabs>
  );
}
