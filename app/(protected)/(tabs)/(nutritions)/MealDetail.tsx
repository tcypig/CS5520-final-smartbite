import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { mealsFromDB } from '@/types';
import { Timestamp } from 'firebase/firestore';
import CustomPieChart from '@/components/CustomPieChart';
import NutritionFacts from '@/components/NutritionFacts';
import { ThemeContext } from '@/ThemeContext';
import { storage } from '@/firebase/firebaseSetup';
import { getDownloadURL, ref } from 'firebase/storage';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/styles';

const DEFAULT_IMAGE = "https://t4.ftcdn.net/jpg/10/74/62/49/360_F_1074624937_ut18QYOFrN0Eijzm0WF0LTxzl9wGlKtS.jpg";
const IMAGE_PLACEHOLDER = "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="

export default function MealDetail() {
  const params = useLocalSearchParams(); 
  const [imageUri, setImageUri] = useState<string>("");
  const [isImageReady, setIsImageReady] = useState(false);
  
  const meal: mealsFromDB = {
    id: params.id as string,
    date: Timestamp.fromDate(new Date(typeof(params.date) === "string"? params.date : "")),
    type: params.type as string,
    image: params.image as string || DEFAULT_IMAGE,
    ingredients: params.ingredients as string[],
    analyzed: params.analyzed === "true",
    nutrition: typeof params.nutrition === "string" ? JSON.parse(params.nutrition) : params.nutrition,
  }


  useEffect(() => {
    async function loadImage() {
      try {
        let url = DEFAULT_IMAGE;
        if (meal.image && !meal.image.startsWith("http")) {
          const imageRef = ref(storage, meal.image);
          url = await getDownloadURL(imageRef);
        } else {
          url = meal.image || DEFAULT_IMAGE;
        }
        setImageUri(url);
      } catch (error) {
        console.error("Failed to load image:", error);
        setImageUri(DEFAULT_IMAGE);
      }
      setIsImageReady(true);
    }
    loadImage();
  }, []);

  // Extract relevant nutrition data
  const calories = meal.nutrition?.calories || 0;
  const protein = meal.nutrition?.totalNutrients?.PROCNT?.quantity || 0;
  const fat = meal.nutrition?.totalNutrients?.FAT?.quantity || 0;
  const carbs = meal.nutrition?.totalNutrients?.CHOCDF?.quantity || 0;

  // Pie chart data
  const chartData = [
    { name: "Protein", value: protein, color: "#FF4D4D" },
    { name: "Fat", value: fat, color: Colors.chartYellow },
    { name: "Carbs", value: carbs, color: Colors.lightGreen },
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
        {isImageReady ? (
          <Image 
            source={{ uri: imageUri || DEFAULT_IMAGE }} 
            style={styles.mealImage} 
            resizeMode="contain"
          />
        ): (
          <Image 
            source={{ uri: IMAGE_PLACEHOLDER }} 
            style={styles.mealImage} 
            resizeMode="contain"
          />
        )}
      </View>

      {/* Pie Chart */}
      <View style={styles.card}>
        <Text style={styles.subTitle}>Nutrition Analysis</Text>
        <View style={styles.caloriesBox}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="flame-outline" size={24} color="#f66" />
            <Text style={styles.calorieText}>{calories} kcal</Text>
          </View>
          <Text style={styles.calorieLabel}>Total Calories</Text>
        </View>
        <CustomPieChart chartData={chartData} />
      </View>

      {/* Nutrition Details */}
      <View style={styles.card}>
        <Text style={styles.subTitle}>Nutrition Breakdown</Text>
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    width: "93%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: { 
    fontSize: 20, 
    fontWeight: "bold" 
  },
  imageContainer: { 
    width: "93%",
    alignSelf: "center",
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
  subTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  caloriesBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  calorieText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f66",
    marginVertical: 4,
  },
  calorieLabel: {
    fontSize: 14,
    color: Colors.darkGray,
  },

})