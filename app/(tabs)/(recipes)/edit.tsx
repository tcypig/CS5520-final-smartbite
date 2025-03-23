// app/(tabs)/(recipes)/edit.tsx

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getRecipeById, updateRecipe } from '../../../firebase/firestore';
import { ThemeContext } from '../../../ThemeContext';
import { RecipeData } from '@/types';

export default function EditRecipeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const { theme } = useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) return;
      const data = await getRecipeById(id as string);
      if (data) {
        setName(data.name);
        setIngredients(data.ingredients.join(', '));
        setInstructions(data.instructions);
      }
    };
    loadRecipe();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    try {
      const ingArr = ingredients
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean);

      await updateRecipe(id as string, {
        name,
        ingredients: ingArr,
        instructions,
      });

      router.back();
    } catch (err) {
      console.log('Error updating recipe:', err);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Text style={[styles.header, { color: currentTheme.text }]}>Edit Recipe</Text>
      
      <Text style={{ color: currentTheme.text, marginTop: 16 }}>Ingredients (comma separated):</Text>
      <TextInput
        style={[
          styles.input, 
          { 
            borderColor: currentTheme.background === '#131313' ? '#555' : '#888',
            backgroundColor: currentTheme.cardBackground,
            color: currentTheme.text 
          }
        ]}
        value={ingredients}
        onChangeText={setIngredients}
        placeholderTextColor={currentTheme.background === '#131313' ? '#777' : '#999'}
      />

      <Text style={{ color: currentTheme.text }}>Recipe Name:</Text>
      <TextInput
        style={[
          styles.input, 
          { 
            borderColor: currentTheme.background === '#131313' ? '#555' : '#888',
            backgroundColor: currentTheme.cardBackground,
            color: currentTheme.text 
          }
        ]}
        value={name}
        onChangeText={setName}
        placeholderTextColor={currentTheme.background === '#131313' ? '#777' : '#999'}
      />

      <Text style={{ color: currentTheme.text }}>Instructions:</Text>
      <TextInput
        style={[
          styles.input, 
          { 
            height: 80,
            borderColor: currentTheme.background === '#131313' ? '#555' : '#888',
            backgroundColor: currentTheme.cardBackground,
            color: currentTheme.text 
          }
        ]}
        multiline
        value={instructions}
        onChangeText={setInstructions}
        placeholderTextColor={currentTheme.background === '#131313' ? '#777' : '#999'}
      />

      <View style={styles.buttonContainer}>
        <Button 
          title="Save" 
          onPress={handleSave} 
          color={currentTheme.navigationBackgroundColor}
        />
        <Button 
          title="Cancel" 
          onPress={() => router.back()} 
          color="#FF3B30"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16 
  },
  header: { 
    fontSize: 20, 
    marginBottom: 12,
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginVertical: 8,
    borderRadius: 8
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12
  }
});
