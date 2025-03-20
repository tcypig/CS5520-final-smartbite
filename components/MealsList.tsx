import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { database } from '@/firebase/firebaseSetup'
import { userId } from '@/app/(tabs)/(nutritions)/AddMeal';
import { router } from 'expo-router';
import CustomPieChart from './CustomPieChart';
import { mealsFromDB, Nutrition } from '@/types';
import { ThemeContext } from '@/ThemeContext';


interface MealsListProps {
  startDate: Date; 
  endDate: Date;
}

export default function MealsList({startDate, endDate} : MealsListProps) {
  const [meals, setMeals] = useState<mealsFromDB[]>([])
  const [chartData, setChartData] = useState([
    { name: "Fat", value: 0, color: "#FFCC00" },
    { name: "Protein", value: 0, color: "#FF6666" },
    { name: "Carbs", value: 0, color: "#66CC66" },
  ]);
  const { theme } = React.useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  // set listener for meals collection
  useEffect(() => {
    if (!userId) return;
    try {
      const mealsRef = collection(database, "users", userId, "meals");

      const startOfDay = new Date(startDate);
      startOfDay.setHours(0, 0, 0, 0); 
      const startTimestamp = Timestamp.fromDate(startOfDay);

      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      const endTimestamp = Timestamp.fromDate(endOfDay);

      const mealsQuery = query(
        mealsRef,
        where("date", ">=", startTimestamp),
        where("date", "<=", endTimestamp),
        orderBy("date", "asc")
      );
      
      const unsubscribe = onSnapshot(mealsQuery, (snapshot) => {
        if (snapshot.empty) {
          setMeals([]);
        } else {
          let newMeals: mealsFromDB[] = [];
          let totalFat = 0, totalProtein = 0, totalCarbs = 0;

          snapshot.forEach((doc) => {
            const meal = doc.data() as mealsFromDB;
            
            const nutrition = meal.nutrition
            ? { 
                calories: meal.nutrition.calories,
                totalNutrients: meal.nutrition.totalNutrients || {},
                totalDaily: meal.nutrition.totalDaily || {},
              }
            : undefined;

            newMeals.push({
              id: doc.id,
              date: meal.date,
              type: meal.type,
              image: meal.image,
              ingredients: meal.ingredients,
              analyzed: meal.analyzed,
              nutrition: nutrition,
            });
            
            if (meal.nutrition?.totalNutrients) {
              totalFat += meal.nutrition.totalNutrients.FAT?.quantity || 0;
              totalProtein += meal.nutrition.totalNutrients.PROCNT?.quantity || 0;
              totalCarbs += meal.nutrition.totalNutrients.CHOCDF?.quantity || 0;
            }
          });

          setMeals(newMeals);
          setChartData([
            { name: "Fat", value: totalFat, color: "#FFCC00" },
            { name: "Protein", value: totalProtein, color: "#FF6666" },
            { name: "Carbs", value: totalCarbs, color: "#66CC66" },
          ]);
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.error('Error getting meals: ', error)
    }
  }, [userId, startDate, endDate])

  function handlePressDetail(item: mealsFromDB) {
    router.push({
      pathname: "MealDetail",
      params: { 
        ...item,
        date: item.date.toDate().toDateString(),
        nutrition: JSON.stringify(item.nutrition),
        analyzed: item.analyzed.toString()
       },
      });
  }

  function handelPressEdit(item: mealsFromDB) {
    router.push({
      pathname: "EditMeal",
      params: { 
        ...item,
        date: item.date.toDate().toDateString(),
        nutrition: JSON.stringify(item.nutrition),
        analyzed: item.analyzed.toString()
       },
      });
  }


  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      {/* Pie Chart */}
      <CustomPieChart chartData={chartData} />

      {/* Meals List */}
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.mealCard}>
            <View style={styles.mealInfo}>
              <Text style={styles.mealType}>{item.type}</Text>
              <Text>Date: {item.date.toDate().toDateString()}</Text>
              <Text>Ingredients: {item.ingredients.join(", ")}</Text>
              <Text>Calories: {item.nutrition?.calories}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <Pressable 
                onPress={() => handlePressDetail(item)}>
                <Ionicons name="search" size={24} />
              </Pressable>
              <Pressable onPress={() => handelPressEdit(item)}>
                <Ionicons name="pencil" size={24} />
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  mealCard: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    padding: 10, marginTop: 10, 
    backgroundColor: "#f2f2f2", 
    borderRadius: 10, 
  },
  mealInfo: { 
    flex: 1, 
    marginRight: 10, 
  },
  mealType: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  buttonContainer: { 
    flexDirection: "row", 
    alignItems: "center",
    gap: 10 
  },
})