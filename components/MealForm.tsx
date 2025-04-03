import { Alert, Button, FlatList, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';
import { Timestamp } from 'firebase/firestore';
import { Meal } from '@/types';
import { ThemeContext } from '@/ThemeContext';
import ImageManager from './ImageManager';
import { Ionicons } from '@expo/vector-icons';


interface MealFormProps {
    initialMeal?: Meal;
    onSubmit: (meal: Meal) => void;
}

// export const userId = "testUser";

export default function MealForm({ initialMeal, onSubmit }: MealFormProps) {
  const [date, setDate] = useState<Date | null>(initialMeal ? initialMeal.date.toDate(): null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [type, setType] = useState<string | null>(initialMeal ? initialMeal.type :null);
  const [open, setOpen] = useState(false);
  const [ingredient, setIngredient] = useState(""); // Single input field
  const [ingredients, setIngredients] = useState<string[]>(initialMeal ? initialMeal.ingredients :[]); // Array of ingredients
  const [takenImageUri, setTakenImageUri] = useState<string>(initialMeal?.image ?? "");

  const types = [
    { label: "Breakfast", value: "Breakfast"},
    { label: "Lunch", value: "Lunch"},
    { label: "Dinner", value: "Dinner"},
    { label: "Snack", value: "Snack"},
  ];

  const { theme } = React.useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

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
      image: takenImageUri,
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

  function imageUriHandler(uri: string) {
    setTakenImageUri(uri);
  }
  

  return (
    <View style={styles.container}>
      {/* Date Picker */}
      <View style={styles.inlineRow}>
        <View style={styles.labelRow}>
          <Ionicons name="calendar-outline" size={18} color={currentTheme.text} />
          <Text style={[styles.label, {color: currentTheme.text}]}>Date</Text>
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Select Date"
            placeholderTextColor="lightgrey"
            value={date? date.toDateString() : ""}
            onPressIn={() => toggleDatePicker()}
          />
        </View>
      </View>

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
      <View style={styles.inlineRow}>
        <View style={styles.labelRow}>
          <Ionicons name="restaurant-outline" size={18} color={currentTheme.text} />
          <Text style={[styles.label, {color: currentTheme.text}]}>Type</Text>
        </View>
        <View style={[styles.inputRow]}>
          <DropDownPicker
            open={open}
            value={type}
            items={types}
            setOpen={setOpen}
            setValue={setType}
            placeholder="Select Meal Type"
            style={{
              borderColor: "grey",
              minHeight: 40,
            }}
            placeholderStyle={{ color: "lightgrey" }}
          />
        </View>
      </View>

      {/* Image Picker */}
      <View style={styles.imageRow}>
        <View style={styles.labelRow}>
          <Ionicons name="image-outline" size={18} color={currentTheme.text} />
          <Text style={[styles.label, {color: currentTheme.text}]}>Image (optional)</Text>
        </View>
        <View style={styles.labelRow}>
          <ImageManager imageUriHandler={imageUriHandler} />
        </View>
      </View>
      {takenImageUri && 
        <View style={styles.imageContainer}>
          <Image source={{uri: takenImageUri}} style={styles.image}/>
          <Pressable onPress={() => setTakenImageUri("")}>
            <Ionicons name="close-circle" size={24} color="#ff4d4d" />
          </Pressable>
        </View>
      }

      {/* Meal Input */}
      <View style={styles.inlineRow}>
        <View style={styles.labelRow}>
          <Ionicons name="list-outline" size={18} color={currentTheme.text} />
          <Text style={[styles.label, {color: currentTheme.text}]}>Meal</Text>
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter quantity and item (e.g. 1 cup rice)"
            placeholderTextColor="lightgrey"
            onChangeText={setIngredient}
            value={ingredient}
          />
          <Pressable 
            onPress={addIngredient}
            style={styles.addIcon}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          >
            <Ionicons name="add-circle" size={24} color="green" />
          </Pressable>
        </View>
      </View>
      
      {/* Ingredients List */}
      <FlatList
        data={ingredients}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.ingredientCard}>
            <View style={styles.ingredientIcon}>
              <Ionicons name="create-outline" size={24} color="#666" />
            </View>
            <View style={styles.ingredientTextBox}>
              <Text style={styles.ingredientTitle}>{item}</Text>
            </View>
            <TouchableOpacity onPress={() => removeIngredient(index)} style={styles.deleteButton}>
              <Ionicons name="close-circle" size={22} color="#ff5c5c" />
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
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  inputRow: {
    flex: 1,
    position: 'relative',
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#FFF",
    paddingRight: 40,
    // height: 50,
  },
  addIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  deleteText: { 
    color: "red", 
    fontWeight: "bold" 
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: { 
    width: 60, 
    height: 60, 
    backgroundColor: '#eee', 
    borderRadius: 10 
  },

  addButton: {
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },

  ingredientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  ingredientIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  ingredientTextBox: {
    flex: 1,
  },
  ingredientTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  deleteButton: {
    padding: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
})