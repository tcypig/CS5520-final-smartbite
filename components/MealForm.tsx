import { Alert, Button, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';
import { Timestamp } from 'firebase/firestore';
import { Meal } from '@/types';


interface MealFormProps {
    initialMeal?: Meal;
    onSubmit: (meal: Meal) => void;
}

export const userId = "testUser";

export default function MealForm({ initialMeal, onSubmit }: MealFormProps) {
  const [date, setDate] = useState<Date | null>(initialMeal ? initialMeal.date.toDate(): null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [type, setType] = useState<string | null>(initialMeal ? initialMeal.type :null);
  const [open, setOpen] = useState(false);
  const [ingredient, setIngredient] = useState(""); // Single input field
  const [ingredients, setIngredients] = useState<string[]>(initialMeal ? initialMeal.ingredients :[]); // Array of ingredients

  const types = [
    { label: "Breakfast", value: "Breakfast"},
    { label: "Lunch", value: "Lunch"},
    { label: "Dinner", value: "Dinner"},
    { label: "Snack", value: "Snack"},
  ];

  function toggleDatePicker() {
    setDate(date || new Date());
    if (Platform.OS === "ios") {
      setShowDatePicker((prev) => !prev);
    } else {
      setShowDatePicker(true);
    }
  }
  
  async function handleSave() {
    if (!date || !type || ingredients.length === 0) {
      Alert.alert("Error", "Please fill out all required fields.");
      return;
    }

    const meal: Meal = {
      date: Timestamp.fromDate(date),
      type: type,
      ingredients: ingredients,
      image: "",
      analyzed: false
    };
    
    onSubmit(meal);
  }

  function addIngredient() {
    if (ingredient.trim() === "") {
      Alert.alert("Error", "Please enter a valid ingredient.");
      return;
    }
    setIngredients([...ingredients, ingredient.trim()]);
    setIngredient("");
    console.log(ingredients);
  }

  function removeIngredient(index: number) {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }
  

  return (
    <View style={styles.container}>
      {/* Date Picker */}
      <Text style={styles.label}>Date *</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Select Date"
        value={date? date.toDateString() : ""}
        onPressIn={() => toggleDatePicker()}
      />

      {showDatePicker && (
        <DateTimePicker
          testID="datetime-picker"
          value={date || new Date()}
          mode="date"
          display="inline"
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate);
            }
            if (Platform.OS !== "ios") {
              setShowDatePicker(false);
            }
          }}
        />
      )}

      {/* Meal Type Dropdown */}
      <Text style={styles.label}>Meal Type *</Text>
      <DropDownPicker
        open={open}
        value={type}
        items={types}
        setOpen={setOpen}
        setValue={setType}
        placeholder="Select Meal Type"
      />

      {/* Image Picker */}
      <Text style={styles.label}>Image (optional) *</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Select Image (completed in future)"
      />

      {/* Meal Input */}
      <Text style={styles.label}>Meals *</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter meal details(quantity & unit). e.g. 1 cup rice"
        onChangeText={setIngredient}
        value={ingredient}
      />
      <Button title="Add" onPress={addIngredient} />

      <FlatList
        data={ingredients}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.ingredientItem}>
            <Text>{item}</Text>
            <TouchableOpacity onPress={() => removeIngredient(index)}>
              <Text style={styles.deleteText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Button title="Cancel" onPress={()=> router.back()} />
        <Button title="Save" onPress={handleSave}/>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },

  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#FFF",
    height: 50,
  },
  ingredientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
  },
  deleteText: { 
    color: "red", 
    fontWeight: "bold" 
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
})