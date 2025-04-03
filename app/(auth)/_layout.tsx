
import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider, ThemeContext } from '../../ThemeContext';
import { useContext, useState } from "react";
import { Text, StyleSheet } from "react-native";
export default function Layout() {
    const { theme } = useContext(ThemeContext);
    const [currentTheme, setCurrentTheme] = useState(theme);

  return (
    <ThemeProvider>
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: currentTheme.navigationBackgroundColor },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          headerTitle: "Login",
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerTitle: "signup",
        }}
      />
      <Stack.Screen
        name="forgot"
        options={{
            headerTitle: "Forgot Password",
        }}
/>
    </Stack>
    </ThemeProvider>
  );
}