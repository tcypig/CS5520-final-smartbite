import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { mealsFromDB } from '@/types';
import { Timestamp } from 'firebase/firestore';
import CustomPieChart from '@/components/CustomPieChart';
import NutritionFacts from '@/components/NutritionFacts';
import { ThemeContext } from '@/ThemeContext';

const DEFAULT_IMAGE = "https://t4.ftcdn.net/jpg/10/74/62/49/360_F_1074624937_ut18QYOFrN0Eijzm0WF0LTxzl9wGlKtS.jpg";

export default function MealDetail() {
  const params = useLocalSearchParams(); 
  
  const meal: mealsFromDB = {
    id: params.id as string,
    date: Timestamp.fromDate(new Date(typeof(params.date) === "string"? params.date : "")),
    type: params.type as string,
    image: params.image as string || DEFAULT_IMAGE,
    ingredients: params.ingredients as string[],
    analyzed: params.analyzed === "true",
    nutrition: typeof params.nutrition === "string" ? JSON.parse(params.nutrition) : params.nutrition,
  }

  // Extract relevant nutrition data
  const calories = meal.nutrition?.calories || 0;
  const protein = meal.nutrition?.totalNutrients?.PROCNT?.quantity || 0;
  const fat = meal.nutrition?.totalNutrients?.FAT?.quantity || 0;
  const carbs = meal.nutrition?.totalNutrients?.CHOCDF?.quantity || 0;

  // Pie chart data
  const chartData = [
    { name: "Protein", value: protein, color: "#FF4D4D" },
    { name: "Fat", value: fat, color: "#FFCC00" },
    { name: "Carbs", value: carbs, color: "#4CAF50" },
  ];

  const { theme } = React.useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, {color: currentTheme.text}]}>{meal.date.toDate().toDateString()} - {meal.type}</Text>
      </View>

      {/* Meal Images */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: meal.image || DEFAULT_IMAGE }} style={styles.mealImage} />
      </View>

      {/* Pie Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.subTitle}>Nutrition Analysis</Text>
        <View style={styles.caloriesBox}>
          <Text style={styles.caloriesText}> Calories: {calories}</Text>
        </View>
        <CustomPieChart chartData={chartData} />
      </View>

      {/* Nutrition Details */}
      <View style={styles.nutritionContainer}>
        <Text style={styles.nutritionTitle}>Nutrition Breakdown</Text>
        {meal.nutrition && <NutritionFacts nutrients={meal.nutrition} />}
      </View>
      
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  header: { 
    alignItems: "center", 
    marginVertical: 10 
  },
  title: { 
    fontSize: 20, 
    fontWeight: "bold" 
  },
  imageContainer: { 
    flexDirection: "row", 
    justifyContent: "center", 
    marginVertical: 10 
  },
  mealImage: { 
    width: '100%', 
    height: 250, 
    marginHorizontal: 5, 
    borderRadius: 10 
  },
  chartContainer: { 
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  subTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  caloriesBox: {
    backgroundColor: "lightgreen",
    padding: 10,
    borderRadius: 10,
  },
  caloriesText: { 
    fontSize: 18, 
    fontWeight: "bold",
    color: "green"
  },
  nutritionContainer: { backgroundColor: "#f9f9f9", padding: 10, borderRadius: 10, marginTop: 10 },
  nutritionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  nutritionItem: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5 },
  nutrientLabel: { fontSize: 16 },
  nutrientValue: { fontSize: 16, fontWeight: "bold" },
})