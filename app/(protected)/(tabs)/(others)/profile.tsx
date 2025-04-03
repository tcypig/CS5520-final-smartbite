import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Button, ScrollView, Alert } from 'react-native';
import { getUserProfile, updateUserProfile } from '@/firebase/firestore';
import { auth } from '@/firebase/firebaseSetup';
import { uploadUserImage } from '@/utils/imageUpload';
import ImageManager from '@/components/ImageManager';
import { ThemeContext } from '@/ThemeContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { theme } = useContext(ThemeContext);
  const [nickname, setNickname] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [currentTheme, setCurrentTheme] = useState(theme);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  useEffect(() => {
    async function fetchProfile() {
      if (!userId) return;
      const user = await getUserProfile(userId);
      if (user) {
        setNickname(user.nickname || '');
        setPhotoUrl(user.photoUrl || '');
      }
    }
    fetchProfile();
  }, [userId]);

  const handleImageSelected = async (uri: string) => {
    if (!userId) return;
    const uploadedUrl = await uploadUserImage(uri, userId);
    if (uploadedUrl) {
      setPhotoUrl(uploadedUrl);
      setRefreshKey(Date.now());
    }
  };

  const getImageUri = () => {
    if (!photoUrl) return '';
    return `${photoUrl}?timestamp=${refreshKey}`;
  };

  const handleSave = async () => {
    if (!userId) return;
    try {
      await updateUserProfile(userId, {
        nickname,
        photoUrl,
      });
      Alert.alert('Profile updated!', '', [
        {
          text: 'OK', 
          onPress: () => {
            router.back();
          }
        }
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Text style={[styles.title, { color: currentTheme.text }]}>{nickname? nickname:auth.currentUser?.uid}</Text>

      {photoUrl ? (
        <Image 
          source={{ uri: getImageUri() }} 
          style={styles.image}
          key={refreshKey}
        />
      ) : (
        <Text style={{ color: currentTheme.text }}>No profile picture set.</Text>
      )}

      <ImageManager imageUriHandler={handleImageSelected} />

      <Text style={[styles.label, { color: currentTheme.text }]}>Nickname</Text>
      <TextInput
        style={[styles.input, {
          backgroundColor: currentTheme.cardBackground,
          color: currentTheme.text,
          borderColor: currentTheme.navigationBackgroundColor,
        }]}
        value={nickname}
        onChangeText={setNickname}
        placeholder="Enter nickname"
        placeholderTextColor="#999"
      />

      <View style={styles.buttonWrapper}>
        <Button title="Save" onPress={handleSave} color={currentTheme.navigationBackgroundColor} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  buttonWrapper: {
    marginTop: 20,
  },
});
