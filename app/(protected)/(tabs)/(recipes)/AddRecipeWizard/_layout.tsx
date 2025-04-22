import { Stack } from 'expo-router';
import { ThemeContext } from '../../../../../ThemeContext';
import React, { useEffect, useState } from 'react';
import { Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AddRecipeWizardLayout() {
    const { theme } = React.useContext(ThemeContext);
    const [currentTheme, setCurrentTheme] = useState(theme);
    
    // Update layout when theme changes
    useEffect(() => {
      setCurrentTheme(theme);
    }, [theme]);
    
    // Handler for cancel button
    const handleCancel = () => {
      router.back();
    };
    
    return (
      <Stack 
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: currentTheme.navigationBackgroundColor },
          headerTintColor: currentTheme.navigationTextColor,
          headerBackTitle: 'Back',
          headerBackVisible: true,
          presentation: 'card',
        }}
      >
        <Stack.Screen name="Step1SelectImage" options={{ 
          title: 'Add Recipe: Step 1',
          headerBackVisible: false, // Hide automatic back button
          headerLeft: () => (
            <Pressable 
              onPress={handleCancel}
              style={({ pressed }) => [
                { opacity: pressed ? 0.7 : 1, flexDirection: 'row', alignItems: 'center' }
              ]}
            >
              <Ionicons 
                name="chevron-back" 
                size={18} 
                color={currentTheme.navigationTextColor} 
                style={{ marginRight: 3 }}
              />
              <Text style={{ color: currentTheme.navigationTextColor, fontSize: 16 }}>Cancel</Text>
            </Pressable>
          ),
        }} />
        <Stack.Screen name="Step2ModeSelect" options={{ 
          title: 'Add Recipe: Step 2',
        }} />
        <Stack.Screen name="Step3EditConfirm" options={{ 
          title: 'Add Recipe: Step 3',
        }} />
      </Stack>
    );
}
