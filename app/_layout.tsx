// app/_layout.tsx
import React, { useState, useContext } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemeProvider, ThemeContext } from '../ThemeContext';

/** The "dropdown" for profile. */
function ProfileDropdown({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.dropdownContainer}>
          <View style={styles.avatar} />
          <Text style={styles.profileName}>John Doe</Text>
          <Pressable
            onPress={() => {
              onClose();
              // For example, navigate to the add recipe screen inside tabs
              router.push('/(tabs)/(recipes)/add');
            }}
          >
            <Text style={styles.linkText}>Add Recipe</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              onClose();
              // For example, navigate to the recipes list in tabs
              router.push('/(tabs)/(recipes)');
            }}
          >
            <Text style={styles.linkText}>My Recipes</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

export default function RootLayout() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const handleDropdownOpen = () => setDropdownVisible(true);
  const handleDropdownClose = () => setDropdownVisible(false);
  const { theme } = useContext(ThemeContext);

  /** A custom function that returns the center logo component. */
  const LogoTitle = () => (
    <Image
      source={require('../assets/smartbite.png')}
      style={{ width: 120, height: 25, resizeMode: 'contain' }}
    />
  );

  return (
    <ThemeProvider>
      {/* The Profile Dropdown overlay */}
      <ProfileDropdown visible={dropdownVisible} onClose={handleDropdownClose} />

      {/* Navigation Stack with sibling screens */}
      <Stack>
        {/* Main Page */}
        <Stack.Screen
          name="index"
          options={{
            headerTitle: 'Main',
            headerStyle: { backgroundColor: theme.navigationBackgroundColor },
            headerTintColor: theme.navigationTextColor,
            headerLeft: () => (
              <Pressable onPress={handleDropdownOpen} style={{ padding: 8 }}>
                <Ionicons name="menu" size={24} color={theme.navigationTextColor} />
              </Pressable>
            ),
            // headerright
          }}
        />

        {/* Tabs Screen – All My Recipes */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerTitle: 'All My Recipes',
            headerStyle: { backgroundColor: theme.navigationBackgroundColor },
            headerTintColor: theme.navigationTextColor,
            headerShown: true,
          }}
        />
        
      </Stack>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
  },
  dropdownContainer: {
    backgroundColor: 'white',
    marginHorizontal: 40,
    padding: 16,
    borderRadius: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 8,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 16,
  },
  linkText: {
    fontSize: 16,
    color: 'blue',
    textAlign: 'center',
    marginVertical: 4,
  },
});
