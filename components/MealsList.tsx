import { FlatList, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { auth, database } from '@/firebase/firebaseSetup'
import { router } from 'expo-router';
import CustomPieChart from './CustomPieChart';
import { mealsFromDB, Nutrition } from '@/types';
import { ThemeContext } from '@/ThemeContext';
import EmptyState from './EmptyState';
import * as Notifications from 'expo-notifications';
import { triggerCalorieLimitNotification } from './NotificationManager';
import SummaryCard from './SummaryCard';
import CalorieGoalModal from './CalorieGoalModal';
import { updateLastNotificationDate, writeDailyCalorieToDB } from '@/firebase/nutritionHelper';

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
  const [userId, setUserId] = useState<string | null>(null);
  const [averageCalories, setAverageCalories] = useState(0);
  const [todayCalories, setTodayCalories] = useState(0);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [calorieLimit, setCalorieLimit] = useState<number | null>(null);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [lastNotificationDate, setLastNotificationDate] = useState<string | null>(null);



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

  // set listener for meals collection
  useEffect(() => {
    if (!userId) return;
    console.log("userId", auth.currentUser?.uid);
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
          setChartData([
            { name: "Fat", value: 0, color: "#FFCC00" },
            { name: "Protein", value: 0, color: "#FF6666" },
            { name: "Carbs", value: 0, color: "#66CC66" },
          ]);
        } else {
          let newMeals: mealsFromDB[] = [];
          let totalFat = 0, totalProtein = 0, totalCarbs = 0;
          let totalCaloriesToday = 0;
          let totalCaloriesAll = 0;

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          snapshot.forEach(async (doc) => {
            const meal = doc.data() as mealsFromDB;
            const mealDate = meal.date.toDate();
            mealDate.setHours(0, 0, 0, 0);
            
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

            const mealCalories = meal.nutrition?.calories || 0;
            totalCaloriesAll += mealCalories;

            if (mealDate.getTime() === today.getTime()) {
              totalCaloriesToday += meal.nutrition?.calories || 0;
            }
          });

          setMeals(newMeals);
          setChartData([
            { name: "Fat", value: totalFat, color: "#FFCC00" },
            { name: "Protein", value: totalProtein, color: "#FF6666" },
            { name: "Carbs", value: totalCarbs, color: "#66CC66" },
          ]);
          setTodayCalories(totalCaloriesToday);

          const daysDiff = Math.max(
            1,
            Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
          );
          setAverageCalories(Math.round(totalCaloriesAll / daysDiff));

        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.error('Error getting meals: ', error)
    }
  }, [userId, startDate, endDate])


  // set listener for daily calorie goal
  useEffect(() => {
    if (!userId) return;
  
    const ref = doc(database, 'users', userId, 'notification', 'dailyCalories');
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCalorieLimit(data.calorieLimit);
        // console.log("calorie Limit in meallist", calorieLimit);
        setNotificationEnabled(data.notificationEnabled);
        setLastNotificationDate(data.lastNotificationDate || null);
      }
    });
  
    return () => unsubscribe();
  }, [userId]);


  // listener for triggering notification
  useEffect(() => {
    if (
      !userId ||
      calorieLimit == null ||
      !notificationEnabled ||
      todayCalories <= calorieLimit
    ) return;
  
    // const todayString = new Date().toISOString().split('T')[0];
    const todayString = new Date().toLocaleDateString('sv-SE');
    if (lastNotificationDate === todayString) return;
  
    const handleTriggerNotification = async () => {
      triggerCalorieLimitNotification(todayCalories, calorieLimit);
      await updateLastNotificationDate(userId, todayString);
    };
  
    handleTriggerNotification();
  }, [userId, calorieLimit, notificationEnabled, lastNotificationDate, todayCalories]);
  
  

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

  async function handleSetGoal(limit: number, enableNotification: boolean) {
    setCalorieLimit(limit);
    setShowGoalModal(false);
    if (userId) {
      try {
        await writeDailyCalorieToDB(userId, limit, enableNotification)
      } catch (error) {
        console.error("Error setting goal: ", error);
      }
    }
  }
  
  function handleCancelGoal() {
    setShowGoalModal(false);
  }

  function getMealIcon(type: string) {
    switch (type.toLowerCase()) {
      case 'breakfast':
        return 'cafe-outline';
      case 'lunch':
        return 'restaurant-outline';
      case 'dinner':
        return 'pizza-outline';
      case 'snack':
        return 'ice-cream-outline';
      default:
        return 'fast-food-outline';
    }
  }
  

  return (
    <ScrollView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      {/* Pie Chart */}
      {/* <View style={styles.section}>
        <CustomPieChart chartData={chartData} />
      </View> */}

      {/* SummaryCard */}
      <SummaryCard 
        averageCalories={averageCalories}
        calorieLimit={calorieLimit ?? undefined}
        chartData={chartData}
        onSetGoal={() => setShowGoalModal(true)}
        onHistoryPress={() => router.push("NutritionHistory")}
      />
      <CalorieGoalModal 
        visible={showGoalModal}
        originalLimit={calorieLimit ?? undefined}
        onConfirm={handleSetGoal}
        onCancel={handleCancelGoal}
      />

      {/* Meals List */}
      {meals.length === 0 ? (
        <EmptyState />
      ): (
      meals.map((item) => (
        <View key={item.id} style={styles.mealCard}>
          <View style={styles.mealInfo}>
            <View style={styles.mealTypeContainer}>
              <Ionicons name={getMealIcon(item.type)} size={16} color="#4CAF50" style={{ marginRight: 6 }}/>
              <Text style={styles.mealType}>{item.type}</Text>
            </View>
            <View style={styles.mealDetailContainer}>
              <Text style={styles.mealDetail}>Date: {item.date.toDate().toDateString()}</Text>
              <Text style={styles.mealDetail}>Calories: {item.nutrition?.calories} kcal</Text>
              <Text style={styles.mealDetail}>Ingredients: {item.ingredients.join(", ")}</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable 
              onPress={() => handlePressDetail(item)}>
              <Ionicons name="search" size={24} color="#555"/>
            </Pressable>
            <Pressable onPress={() => handelPressEdit(item)}>
              <Ionicons name="pencil" size={24} color="#555"/>
            </Pressable>
          </View>
        </View>
      ))
    )}
      
    </ScrollView>  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  section: {
    backgroundColor: "#fff",
    marginBottom: 16,
    borderRadius: 12, 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  mealCard: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    padding: 16, 
    marginTop: 10, 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  mealInfo: { 
    flex: 1, 
    marginRight: 10, 
    paddingRight: 10,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },  
  mealType: { 
    fontSize: 18, 
    fontWeight: "bold",
    color: '#4CAF50', // Fresh green for clarity
  },
  mealDetailContainer: {
    paddingHorizontal: 2,
  },
  mealDetail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  ingredient: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  buttonContainer: { 
    flexDirection: "row", 
    alignItems: "center",
    gap: 10 
  },
})