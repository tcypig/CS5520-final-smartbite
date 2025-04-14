import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, ScrollView, Image } from 'react-native';
import { ThemeContext } from '../../../../ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebaseSetup';
import { router, useFocusEffect } from 'expo-router';
import { User } from '@/types';
import { getUserProfile } from '@/firebase/firestore';

export default function OthersScreen() {
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const isDarkMode = theme.background === '#131313';
  const currentUser = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/(auth)/login');
    } catch (error: any) {
      alert(error.message);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserProfile = async () => {
        const refreshedUser = auth.currentUser;
        if (refreshedUser?.uid) {
          const profile = await getUserProfile(refreshedUser.uid);
          if (profile) {
            setUserProfile(profile);
            setRefreshKey(Date.now());
          }
        }
      };
      fetchUserProfile();
    }, [])
  );
  
  const getImageUri = () => {
    if (!userProfile?.photoUrl) return '';
    return `${userProfile.photoUrl}?timestamp=${refreshKey}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Pressable 
          onPress={() => router.push('/(protected)/(tabs)/(others)/profile')}
          style={styles.profileContainer}
        >
          {userProfile?.photoUrl ? (
            <Image 
              source={{ uri: getImageUri() }} 
              style={styles.avatar} 
              key={refreshKey}
            />
          ) : (
            <Ionicons name="person-circle-outline" size={60} color={theme.navigationTextColor} />
          )}
          <Text style={[styles.emailText, { color: theme.text }]}> 
            {userProfile?.nickname ?? currentUser?.email ?? 'No user logged in'}
          </Text>
        </Pressable>

        <View style={[styles.settingCard, { backgroundColor: theme.cardBackground }]}>
        <Pressable
  onPress={() => router.push('./FindGroceries')}
  style={({ pressed }) => [
    styles.settingRow,
    pressed && styles.pressedEffect, // Add visual feedback
  ]}
>
  <View style={styles.settingLabelContainer}>
    <Ionicons name="cart-outline" size={24} color={theme.text} />
    <Text style={[styles.settingLabel, { color: theme.text }]}>
      Find Groceries
    </Text>
  </View>
  <Ionicons name="chevron-forward" size={20} color={theme.text} />
</Pressable>
</View>


        <View style={[styles.settingCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name={isDarkMode ? "moon" : "sunny"} size={24} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}> 
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: '#7B68EE' }}
              thumbColor={isDarkMode ? '#f4f3f4' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleTheme}
              value={isDarkMode}
            />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, { color: theme.text }]}> 
            Switch between light and dark mode to change the app appearance.
          </Text>
        </View>
      </ScrollView>

      <Pressable
        style={[styles.logoutButton, { backgroundColor: '#FF3B30' }]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  emailText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  settingCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  infoText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
    menuButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 16,
      borderRadius: 12,
      backgroundColor: '#E3F2FD',
      marginHorizontal: 16,
      marginTop: 8,
    },
    menuText: { fontSize: 16, fontWeight: '500' },
    pressedEffect: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
    },
    
});
