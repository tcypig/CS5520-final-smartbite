// app/tabs/recipes/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getRecipeById, updateRecipe, deleteRecipe } from '../../../firebase/firestore';
import { RecipeData } from '../../../firebase/firestore';

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<(RecipeData & { id: string }) | null>(null);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) return;
      const data = await getRecipeById(id as string);
      if (data) setRecipe(data);
    };
    loadRecipe();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!recipe) return;
    try {
      await updateRecipe(recipe.id, { isFavorite: !recipe.isFavorite });
      setRecipe((prev) => prev && { ...prev, isFavorite: !prev.isFavorite });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!recipe) return;
    try {
      await deleteRecipe(recipe.id);
      router.replace('/tabs/recipes');
    } catch (err) {
      console.error(err);
    }
  };

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text>Loading recipe...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{recipe.name}</Text>
      <Text>Ingredients: {recipe.ingredients.join(', ')}</Text>
      <Text>Instructions: {recipe.instructions}</Text>

      <Button
        title={recipe.isFavorite ? 'Unfavorite' : 'Favorite'}
        onPress={handleToggleFavorite}
      />
      <Button title="Delete" onPress={handleDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});
