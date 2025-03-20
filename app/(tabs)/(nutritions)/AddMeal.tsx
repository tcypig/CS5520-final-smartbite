import { Alert, Button, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { router } from 'expo-router';
import { writeMealToDB, writeNutritionToDB, analyzeNutrition} from '@/firebase/nutritionHelper';
import { Timestamp } from 'firebase/firestore';
import MealForm from '@/components/MealForm';
import { useContext } from 'react';
import { ThemeContext } from '@/ThemeContext';
import { Meal } from '@/types';


export const userId = "testUser";

export default function AddMeal() {
  const { theme } = useContext(ThemeContext);

  async function handleSave(meal: Meal) {
    const mealId = await writeMealToDB(userId, meal);
    if (mealId) {
      await analyzeNutrition(userId, mealId, meal.ingredients);
    } else {
      console.error("Error: mealId is undefined");
    }
    router.back();
  }

  return (
    <View style={styles.container}>
      <MealForm onSubmit={handleSave} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})