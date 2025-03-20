import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { getRecipeById, deleteRecipe, updateRecipe } from '../../../firebase/firestore'; 
import { RecipeData } from '@/types';
import { ThemeContext } from '../../../ThemeContext';

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<(RecipeData & { id: string }) | null>(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const { theme } = React.useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) return;
      const data = await getRecipeById(id as string);
      if (data) {
        setRecipe(data);
        setIsFavorite(data.isFavorite ?? false);
      }
    };
    loadRecipe();
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      const loadRecipe = async () => {
        if (!id) return;
        const data = await getRecipeById(id as string);
        if (data) {
          setRecipe(data);
          setIsFavorite(data.isFavorite ?? false);
        }
      };
      loadRecipe();
    }, [id])
  );

  const handleToggleFavorite = async () => {
    if (!recipe) return;
    try {
      const newValue = !isFavorite;
      await updateRecipe(recipe.id, { isFavorite: newValue });
      setIsFavorite(newValue);
      setRecipe({ ...recipe, isFavorite: newValue });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleDelete = async () => {
    if (!recipe) return;
    try {
      await deleteRecipe(recipe.id);
      router.replace('/(tabs)/(recipes)');
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = () => {
    if (!recipe) return;
    router.push({
      pathname: '/(tabs)/(recipes)/edit',
      params: { id: recipe.id },
    });
  };

  if (!recipe) {
    return (
      <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
        <Text style={{ color: currentTheme.text }}>Loading recipe...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Text style={[styles.title, { color: currentTheme.text }]}>{recipe.name}</Text>
      <Text style={{ color: currentTheme.text, marginBottom: 12 }}>
        Ingredients: {recipe.ingredients.join(', ')}
      </Text>
      <Text style={{ color: currentTheme.text, marginBottom: 24 }}>
        Instructions: {recipe.instructions}
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title={isFavorite ? 'Unfavorite' : 'Favorite'}
          onPress={handleToggleFavorite}
          color={currentTheme.navigationBackgroundColor}
        />

        <Button
          title="Edit"
          onPress={handleEdit}
          color={currentTheme.navigationBackgroundColor}
        />

        <Button 
          title="Delete" 
          onPress={handleDelete} 
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
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 16 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16
  }
});
