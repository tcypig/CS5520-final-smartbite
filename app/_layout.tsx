import React, { useEffect, useState } from 'react';
import { Slot, useSegments, router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/firebaseSetup';
import { Text, View } from 'react-native';
import { ThemeProvider } from '@/ThemeContext';

export default function RootLayout() {
  const segments = useSegments();
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserLoggedIn(!!user); // true if user object, false otherwise
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Whenever auth state or route changes, decide where to navigate
  useEffect(() => {
    if (isLoading) return; // Wait until we know the auth state

    // segments[0] will be either "(auth)" or "(protected)"
    if (userLoggedIn && segments[0] === '(auth)') {
      // User is logged in but currently on an auth screen; redirect to protected
      router.replace('(protected)');
    } else if (!userLoggedIn && segments[0] === '(protected)') {
      // User is not logged in but on a protected screen; redirect to login
      router.replace('(auth)/login');
    }
  }, [userLoggedIn, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading User...</Text>
      </View>
    );
  }

  // Wrap everything in ThemeProvider so you keep your theming
  return (
    <ThemeProvider>
      {/* 
        Using <Slot/> means "render the nested route's layout/screen here".
        This can be either (auth) or (protected).
      */}
      <Slot />
    </ThemeProvider>
  );
}
