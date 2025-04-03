import { Alert, Button, Linking, StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/ThemeContext';

interface ImageManagerProps {
  imageUriHandler: (uri: string) => void;
}

export default function ImageManager({ imageUriHandler }: ImageManagerProps) {
  const [permissionResponse, requestPermission] = ImagePicker.useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = ImagePicker.useMediaLibraryPermissions();
  const [imageUri, setImageUri] = useState<string>("");
  
  const { theme } = React.useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);

  async function verifyPermissions() {
    if (permissionResponse?.granted) return true;
    const responseAfterRequest = await requestPermission();
    console.log(responseAfterRequest);
    if (responseAfterRequest?.granted) {
      return true;
    } else {
      return false;
    }
  }

  async function verifyMediaPermissions() {
    if (mediaPermission?.granted) return true;
    const responseAfterRequest = await requestMediaPermission();
    console.log(responseAfterRequest);
    if (responseAfterRequest?.granted) {
      return true;
    } else {
      return false;
    }
  }

  // 拍照
  async function takeImageHandler() {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      Alert.alert("No permissions", "You need to grant camera permissions to use this feature", [{ text: "OK"}]);
      return;
    }
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
      });
      console.log(result);
      if (result.canceled) return;
      setImageUri(result.assets[0].uri); // Store image URI
      imageUriHandler(result.assets[0].uri);
    }
    catch (err) {
      console.log(err);
    }
  };

  async function pickFromGalleryHandler() {
    const hasPermission = await verifyMediaPermissions();
    if (!hasPermission) {
      Alert.alert("No permissions", "You need to grant gallery permissions to use this feature", [{ text: "OK"}]);
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
      });
      console.log(result);
      if (result.canceled) return;
      setImageUri(result.assets[0].uri);
      imageUriHandler(result.assets[0].uri);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <View>
      <Pressable
        onPress={takeImageHandler}
        style={({ pressed }) => [
          styles.imageButton,
          pressed && { opacity: 0.7 }
        ]}
      > 
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="camera-outline" size={16} />
          <Text style={styles.imageButtonText}>Take Image</Text>
        </View>
      </Pressable>

      <Pressable
        onPress={pickFromGalleryHandler}
        style={({ pressed }) => [
          styles.imageButton,
          pressed && { opacity: 0.7 }
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="image-outline" size={16} />
          <Text style={styles.imageButtonText}>Upload from Gallery</Text>
        </View>
      </Pressable>

      {/* {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
        />
      ) : null} */}
    </View>
  )
}

const styles = StyleSheet.create({
  image: { 
    width: 200, 
    height: 200, 
    marginTop: 10 
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgrey',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  imageButtonText: {
    marginLeft: 6,
  },
});
