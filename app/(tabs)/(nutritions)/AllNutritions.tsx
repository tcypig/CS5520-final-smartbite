import { Alert, Button, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { router, Stack } from 'expo-router'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import MealsList from '@/components/MealsList'
import { ThemeContext } from '@/ThemeContext'


export default function AllNutritions() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const { theme } = useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);
  
  function toggleStartDatePicker() {
    setShowStartPicker((prev) => !prev)
  }

  function toggleEndDatePicker() {
    setShowEndPicker((prev) => !prev)
  }
  
  useEffect(() => {
    if (endDate < startDate) {
      Alert.alert("Error", "End date must be after start date.");
    }
  }, [endDate])

  useEffect(() => {
    if (endDate < startDate) {
      Alert.alert("Error", "Start date must be before end date.");
    }
  }, [startDate])


  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Stack.Screen 
        options={{
          headerRight: () => (
            <Pressable
              onPress = {() => router.push('AddMeal')}
            >
              <View>
                <Ionicons name="add" size={24} color={theme.navigationTextColor} />
              </View>
            </Pressable>
          )
        }}
      />
      
      {/* Date Selection */}
      <View style={styles.dateContainer}>
        <Pressable 
          onPress={toggleStartDatePicker}>
          <Ionicons name="chevron-back-outline" size={24} color={currentTheme.text} />
        </Pressable>
        <Text style={[styles.dateText, { color: currentTheme.dateText }]}>
          {startDate.toDateString()} - {endDate.toDateString()}
        </Text>
        <Pressable 
          onPress={toggleEndDatePicker}>
          <Ionicons name="chevron-forward-outline" size={24} color={currentTheme.text} />
        </Pressable>
      </View>
      {showStartPicker && (
        <DateTimePicker
          testID="datetime-picker"
          value={startDate || new Date()}
          mode="date"
          display="inline"
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setStartDate(selectedDate);
              setShowStartPicker(false);
            }
          }}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          testID="datetime-picker"
          value={endDate || new Date()}
          mode="date"
          display="inline"
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setEndDate(selectedDate);
              setShowEndPicker(false);
            }
          }}
        />
      )}
      
      <MealsList startDate={startDate} endDate={endDate} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, padding: 20, backgroundColor: "#fff" 
  },
  dateContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  dateText: { fontSize: 16, fontWeight: "bold" },
  mealItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15, borderBottomWidth: 1, borderColor: "#ddd" },
  mealDate: { fontSize: 14, color: "#555" },
  mealType: { fontSize: 16, fontWeight: "bold" },
  iconContainer: { flexDirection: "row", gap: 15 },
  addButton: { position: "absolute", bottom: 20, right: 20, backgroundColor: "#007AFF", borderRadius: 50, width: 50, height: 50, justifyContent: "center", alignItems: "center" },
})