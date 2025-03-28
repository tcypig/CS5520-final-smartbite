import { Alert, Button, FlatList, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { router } from 'expo-router';
import { writeMealToDB, writeNutritionToDB, analyzeNutrition} from '@/firebase/nutritionHelper';
import { Timestamp } from 'firebase/firestore';
import MealForm from '@/components/MealForm';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '@/ThemeContext';
import { Meal } from '@/types';
import { ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/firebase/firebaseSetup';


export const userId = "testUser";

export default function AddMeal() {
  const { theme } = useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

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

  async function handleSave(meal: Meal) {
    console.log("Data received from Input", meal.image);

    let storedImageUri = "";
    if (meal.image) {
      storedImageUri = await fetchImage(meal.image) ?? "";
      console.log("Stored image uri", storedImageUri);
    }
    let newMeal: Meal = {
      ...meal,
      image: storedImageUri,
    };

    const mealId = await writeMealToDB(userId, newMeal);
    if (mealId) {
      await analyzeNutrition(userId, mealId, meal.ingredients);
    } else {
      console.error("Error: mealId is undefined");
    }
    router.back();
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <MealForm onSubmit={handleSave} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})