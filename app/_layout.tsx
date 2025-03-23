import { useContext } from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider, ThemeContext } from '../ThemeContext';


export default function RootLayout() {
  const { theme } = useContext(ThemeContext);

  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerTitle: 'All My Recipes',
            headerStyle: { backgroundColor: theme.navigationBackgroundColor },
            headerTintColor: theme.navigationTextColor,
            headerShown: false,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
