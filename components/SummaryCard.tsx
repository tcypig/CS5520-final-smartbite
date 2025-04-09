import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface SummaryCardProps {
  averageCalories: number;
  chartData: { name: string, value: number, color: string }[];
  calorieLimit?: number;
  onSetGoal: () => void;
  onHistoryPress?: () => void;
}

export default function SummaryCard({
    averageCalories,
    chartData,
    calorieLimit,
    onSetGoal,
    onHistoryPress,
  }: SummaryCardProps) {
  
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <View style={styles.cardContainer}>
      {/* Top row: Set Goal | Calorie Circle | History */}
      <View style={styles.topRow}>
        <Pressable onPress={onSetGoal} style={styles.iconButton}>
          {/* <Ionicons name="flag-outline" size={16} color="#007AFF" /> */}
          <Text style={styles.sideButton}>Set Goal</Text>
        </Pressable>

        <View style={styles.calorieCircle}>
          <View style={styles.circle}>
            <Text style={styles.avgText}>Daily Avg</Text>
            <Text style={styles.calorieText}>{averageCalories}</Text>
            {calorieLimit ? (
              <Text style={styles.kcalText}>Limit: {calorieLimit} kal</Text>
            ): (
              <Text style={styles.kcalText}>kal</Text>
            )}
          </View>
        </View>

        <Pressable onPress={onHistoryPress} disabled={!onHistoryPress} style={styles.iconButton}>
          <Text style={[styles.sideButton, !onHistoryPress && styles.disabled]}>History</Text>
        </Pressable>
      </View>

      {/* Nutrient progress bars */}
      <View style={styles.nutrientGroup}>
        {chartData.map((item) => {
          const percent = total === 0 ? 0 : item.value / total;
          return (
            <View key={item.name} style={styles.nutrientItem}>
              <Text style={styles.nutrientLabel}>{item.name}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, {
                  width: `${Math.round(percent * 100)}%`,
                  backgroundColor: item.color
                }]} />
              </View>
              <Text style={styles.nutrientMeta}>
                {Math.round(item.value)}g / {Math.round(percent * 100)}%
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },  
  sideButton: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  disabled: {
    color: '#ccc',
  },
  calorieCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avgText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  circle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 6,
    borderColor: '#78C850',
    backgroundColor: '#F5FFF2',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  calorieText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  kcalText: {
    fontSize: 12,
    color: '#777',
  },
  recommendText: {
    fontSize: 12,
    color: '#999',
  },
  nutrientGroup: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  nutrientItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  nutrientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nutrientLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  nutrientValue: {
    fontSize: 14,
    color: '#333',
  },
  nutrientMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
