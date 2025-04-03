import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { Meal } from '@/types'
import React, { useContext, useEffect, useState } from 'react'
import { deleteMealFromDB, updateMealToDB } from '@/firebase/nutritionHelper'
// import { userId } from './AddMeal'
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Timestamp } from 'firebase/firestore';
import MealForm from '@/components/MealForm';
import { ThemeContext } from '@/ThemeContext';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '@/firebase/firebaseSetup';


export default function EditMeal() {
  const { theme } = useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [meal, setMeal] = useState<Meal | null>(null);
  const [displayImageUri, setDisplayImageUri] = useState<string>("");
  const [userId, setUserId] = useState<string>("testUser");

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    } else {
      setUserId("testUser");
    }
  }, []);

  const params = useLocalSearchParams(); 
  const mealId = params.id as string;

  useEffect(() => {
    async function loadImage() {
      try {
        let imageUri = typeof params.image === "string" ? params.image : "";
        if (imageUri && !imageUri.startsWith("http")) {
          const imageRef = ref(storage, imageUri);
          imageUri = await getDownloadURL(imageRef);
        }

        const convertedMeal: Meal = {
          date: Timestamp.fromDate(new Date(typeof params.date === "string" ? params.date : "")),
          type: params.type as string,
          image: imageUri,
          ingredients: typeof params.ingredients === "string"
            ? params.ingredients.split(",").map((item) => item.trim())
            : [],
          analyzed: params.analyzed === "true",
        };

        setMeal(convertedMeal);
        setDisplayImageUri(imageUri);
      } catch (error) {
        console.error("Failed to load image:", error);
      }
    }
    loadImage();
  }, [])

  
  async function fetchImage(uri: string) {
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error("Error fetching image");
      }
      const blob = await response.blob();
      const imageName = uri.substring(uri.lastIndexOf('/') + 1);
      const imageRef = ref(storage, `images/${imageName}`);
      const uploadResult = await uploadBytesResumable(imageRef, blob);
      return uploadResult.metadata.fullPath;
    } catch (error) {
      console.error("Error fetching image", error);
    }
  }

  async function handleUpdateMeal(updatedMeal: Meal) {
    let newUpdatedMeal: Meal = updatedMeal;
    // if the image is updated, fetch the image and store it in the storage
    if (updatedMeal.image && updatedMeal.image !== displayImageUri) {
      const storedImageUri = await fetchImage(updatedMeal.image);
      newUpdatedMeal = {
        ...updatedMeal,
        image: storedImageUri,
      };
    } else {
      newUpdatedMeal = {
        ...updatedMeal,
        image: params.image as string,
      };
    }
    await updateMealToDB(userId, mealId, newUpdatedMeal);
    router.back();
  }

  function handleEditDelete() {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete this meal?",
      [{
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await deleteMealFromDB(userId, mealId);
              router.back();
            } catch (error) {
              console.error("Error deleting document: ", error);
            }
          }
        }]
    );
  }

  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{ 
          headerRight: () => (
            <Pressable
              onPress={handleEditDelete}>
              <Ionicons name="trash-outline" size={24} color={ theme.navigationTextColor } />
            </Pressable>
          ),
        }}
      />
      {meal && <MealForm initialMeal={meal} onSubmit={handleUpdateMeal} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})