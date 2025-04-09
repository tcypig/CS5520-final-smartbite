import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { auth, database } from '@/firebase/firebaseSetup';
import { DailyNutrition } from '@/types';

const screenWidth = Dimensions.get('window').width - 32;

export default function NutritionHistory() {
  const userId = auth.currentUser?.uid;
  const [chartData, setChartData] = useState<DailyNutrition[]>([]);

  const sanitize = (val: number | undefined | null) => (isFinite(val ?? 0) ? val! : 0);

  useEffect(() => {
    console.log('user:', auth.currentUser?.email);
  }, []);

  useEffect(() => {
    if (!userId) return;
  
    const mealsRef = collection(database, 'users', userId, 'meals');
    const mealsQuery = query(mealsRef, orderBy('date', 'asc'));
  
    const unsubscribe = onSnapshot(mealsQuery, (snapshot) => {
      const mealDataByDate = new Map();
  
      snapshot.forEach((doc) => {
        const meal = doc.data();
        // const date = meal.date.toDate().toISOString().split('T')[0];
        const date = meal.date.toDate().toLocaleDateString('sv-SE');
  
        if (!mealDataByDate.has(date)) {
          mealDataByDate.set(date, { calories: 0, fat: 0, protein: 0, carbs: 0 });
        }
  
        const day = mealDataByDate.get(date);
        day.calories += meal.nutrition?.calories || 0;
        day.fat += meal.nutrition?.totalNutrients?.FAT?.quantity || 0;
        day.protein += meal.nutrition?.totalNutrients?.PROCNT?.quantity || 0;
        day.carbs += meal.nutrition?.totalNutrients?.CHOCDF?.quantity || 0;
      });
  
      // const todayString = new Date().toISOString().split('T')[0];
      const todayString = new Date().toLocaleDateString('sv-SE'); // gives '2025-04-08'
      if (!mealDataByDate.has(todayString)) {
        mealDataByDate.set(todayString, {
          calories: 0,
          fat: 0,
          protein: 0,
          carbs: 0,
        });
      }
  
      const formatted = Array.from(mealDataByDate.entries()).map(([date, nutrients]) => ({
        date,
        ...nutrients,
      }));
  
      setChartData(formatted);
    });
  
    return () => unsubscribe();
  }, [userId]);
  
  const dateLabels = chartData.map(item => item.date.slice(5));
  const calorieValues = chartData.map(item => sanitize(item.calories));
  const fatValues = chartData.map(item => sanitize(item.fat));
  const proteinValues = chartData.map(item => sanitize(item.protein));
  const carbValues = chartData.map(item => sanitize(item.carbs));

  if (chartData.length === 0) return null;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Daily Calories (kcal)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={{
            labels: dateLabels,
            datasets: [{ data: calorieValues }],
          }}
          width={Math.max(screenWidth, dateLabels.length * 80)}
          height={220}
          fromZero={true}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </ScrollView>

      <Text style={styles.title}>Nutrient Breakdown (g)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={{
            labels: dateLabels,
            datasets: [
              {
                data: fatValues,
                color: () => '#FFCC00',
                strokeWidth: 2,
              },
              {
                data: proteinValues,
                color: () => '#FF6666',
                strokeWidth: 2,
              },
              {
                data: carbValues,
                color: () => '#66CC66',
                strokeWidth: 2,
              },
            ],
            legend: ['Fat', 'Protein', 'Carbs'],
          }}
          width={Math.max(screenWidth, dateLabels.length * 80)}
          height={240}
          fromZero={true}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </ScrollView>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
  labelColor: () => '#333',
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#fff',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    color: '#333',
  },
  chart: {
    borderRadius: 16,
    marginRight: 8,
  },
});
