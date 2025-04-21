import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/ThemeContext';

interface ImageManagerProps {
  imageUriHandler: (uri: string) => void;
  compact?: boolean;
  uploadText?: string;
}

export default function ImageManager({ imageUriHandler, compact, uploadText }: ImageManagerProps) {
  const [permissionResponse, requestPermission] = ImagePicker.useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = ImagePicker.useMediaLibraryPermissions();
  const [imageUri, setImageUri] = useState<string>("");

  const { theme } = React.useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);

  async function verifyPermissions() {
    if (permissionResponse?.granted) return true;
    const responseAfterRequest = await requestPermission();
    if (responseAfterRequest?.granted) return true;
    return false;
  }

  async function verifyMediaPermissions() {
    if (mediaPermission?.granted) return true;
    const responseAfterRequest = await requestMediaPermission();
    if (responseAfterRequest?.granted) return true;
    return false;
  }

  async function takeImageHandler() {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      Alert.alert("No permissions", "You need to grant camera permissions to use this feature", [{ text: "OK" }]);
      return;
    }
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });
      if (result.canceled) return;
      setImageUri(result.assets[0].uri);
      imageUriHandler(result.assets[0].uri);
    } catch (err) {
      console.log(err);
    }
  }

  async function pickFromGalleryHandler() {
    const hasPermission = await verifyMediaPermissions();
    if (!hasPermission) {
      Alert.alert("No permissions", "You need to grant gallery permissions to use this feature", [{ text: "OK" }]);
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.8,
      });
      if (result.canceled) return;
      setImageUri(result.assets[0].uri);
      imageUriHandler(result.assets[0].uri);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <View style={styles.wrapper}>
      <Pressable 
        onPress={takeImageHandler} 
        style={({ pressed }) => [
          styles.button, 
          compact && styles.compactButton,
          pressed && styles.pressed
        ]}
      > 
        <Ionicons name="camera-outline" size={18} color="#fff" style={styles.icon} />
        <Text style={[styles.text, compact && styles.compactText]}>Take Photo</Text>
      </Pressable>

      <Pressable 
        onPress={pickFromGalleryHandler} 
        style={({ pressed }) => [
          styles.button, 
          compact && styles.compactButton,
          pressed && styles.pressed
        ]}
      > 
        <Ionicons name="image-outline" size={18} color="#fff" style={styles.icon} />
        <Text style={[styles.text, compact && styles.compactText]}>{uploadText || "Upload from Gallery"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 24,
    alignItems: 'center',
    gap: 14,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
    minWidth: 260,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  compactButton: {
    minWidth: '40%',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  compactText: {
    fontSize: 13,
  },
});
