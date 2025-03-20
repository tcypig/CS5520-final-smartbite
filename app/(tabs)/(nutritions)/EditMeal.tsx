import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { Meal } from '@/types'
import React, { useContext, useEffect, useState } from 'react'
import { deleteMealFromDB, updateMealToDB } from '@/firebase/nutritionHelper'
import { userId } from './AddMeal'
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Timestamp } from 'firebase/firestore';
import MealForm from '@/components/MealForm';
import { ThemeContext } from '@/ThemeContext';

export default function EditMeal() {
  const { theme } = useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  const params = useLocalSearchParams(); 
  const mealId = params.id as string;
  const meal: Meal = {
    date: Timestamp.fromDate(new Date(typeof(params.date) === "string"? params.date : "")),
    type: params.type as string,
    image: params.image as string,
    ingredients: typeof params.ingredients === "string"
      ? params.ingredients.split(",").map((item) => item.trim())
      : [],
    analyzed: params.analyzed === "true",
  }
  

  async function handleUpdateMeal(updatedMeal: Meal) {
    await updateMealToDB(userId, mealId, updatedMeal);
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
      <MealForm initialMeal={meal} onSubmit={handleUpdateMeal} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})