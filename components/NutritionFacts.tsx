import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Nutrition } from '@/types';

interface Nutrient {
    label: string;
    quantity: number;
    unit: string;
}

interface NutritionFactsProps {
    nutrients: Nutrition;
}

const keyNutrients = ["FAT", "FASAT", "FATRN", "CHOLE", "NA", "CHOCDF", "PROCNT", "VITD", "CA", "FE", "K"];

export default function NutritionFacts({ nutrients }: NutritionFactsProps) {
  const calories = nutrients.calories || 0;
  const nutrientsList = nutrients.totalNutrients || {};
  const totalDaily = nutrients.totalDaily || {};
  
  return (
    <View style={styles.container}>
      {/* Calories Section */}
      <View style={styles.caloriesContainer}>
        <Text style={styles.caloriesText}>Calories</Text>
        <Text style={styles.caloriesValue}>{calories}</Text>
      </View>

      {/* Separator */}
      <View style={styles.separator} />
      
      {/* Nutrient List */}
      <View style={styles.nutrientsContainer}>
        {keyNutrients.map((key) => {
          const nutrient = nutrientsList[key];
          if (!nutrient) return null;

          return (
            <View key={key} style={styles.nutrientRow}>
              <Text style={styles.nutrientLabel}>{nutrient.label}</Text>
              <Text style={styles.nutrientValue}>
                {Math.round(nutrient.quantity)} {nutrient.unit}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Footer */}
      <Text style={styles.footerText}>*Percent Daily Values are based on a 2000 calorie diet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  caloriesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  caloriesText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  caloriesValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginVertical: 8,
  },
  nutrientsContainer: {
    marginBottom: 10,
  },
  nutrientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  nutrientLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  nutrientValue: {
    fontSize: 16,
  },
  footerText: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
});