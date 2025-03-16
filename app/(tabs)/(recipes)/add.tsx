// app/tabs/recipes/add.tsx
import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { addRecipe } from '../../../firebase/firestore';

export default function AddRecipeScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  const handlePhoto = () => {
  };

  const handleGenerateWithAI = async () => {
  };

  const handleSave = async () => {
    const ingArr = ingredients
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    try {
      await addRecipe({
        name,
        ingredients: ingArr,
        instructions,
      });
      router.back();
    } catch (err) {
      console.log('Error saving recipe:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Recipe</Text>
      
      <Button title="Take or Upload Photo" onPress={handlePhoto} />
      
      <Text>Ingredients (comma separated):</Text>
      <TextInput
        style={styles.input}
        value={ingredients}
        onChangeText={setIngredients}
      />

      <Text>Recipe Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text>Instructions:</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        value={instructions}
        onChangeText={setInstructions}
      />

      <Button title="Generate with AI" onPress={handleGenerateWithAI} />
      <Button title="Save" onPress={handleSave} />
      <Button title="Dislike (Cancel)" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    padding: 8,
    marginVertical: 8,
  },
});
