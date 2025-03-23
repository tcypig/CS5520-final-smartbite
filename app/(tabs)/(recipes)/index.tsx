import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getAllRecipes, updateRecipe } from '../../../firebase/firestore';
import { RecipeData } from '@/types';
import RecipeCard from '../../../components/RecipeCard';
import PressableButton from '@/components/PressableButton';
import { ThemeContext } from '../../../ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';


type Category = 'all' | 'favorites';

export default function RecipesMainScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Array<RecipeData & { id: string }>>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = React.useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  const fetchRecipes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllRecipes(); 
      setRecipes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRecipes();
    }, [fetchRecipes])
  );

  useEffect(() => {
    const favSet = new Set<string>();
    recipes.forEach((r) => {
      if (r.isFavorite) {
        favSet.add(r.id);
      }
    });
    setFavorites(favSet);
  }, [recipes]);

  const toggleFavorite = async (recipeId: string) => {

    const isCurrentlyFav = favorites.has(recipeId);
    const newFavStatus = !isCurrentlyFav;

    try {
      await updateRecipe(recipeId, { isFavorite: newFavStatus });
    } catch (error) {
      console.error('Error updating isFavorite in Firestore:', error);
      return;
    }

    const updatedSet = new Set(favorites);
    if (newFavStatus) {
      updatedSet.add(recipeId);
    } else {
      updatedSet.delete(recipeId);
    }
    setFavorites(updatedSet);
  };

  const filteredRecipes = recipes.filter(recipe => {
    if (selectedCategory === 'all') {
      return true;
    }
    return favorites.has(recipe.id);
  });

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: currentTheme.text }]}>Saved Recipes</Text>
      </View>
  
      <View style={styles.categoryContainer}>
        <Pressable
          style={[
            styles.categoryButton,
            { backgroundColor: currentTheme.cardBackground },
            selectedCategory === 'all' && styles.selectedCategory
          ]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text style={[
            styles.categoryText,
            { color: currentTheme.cardText },
            selectedCategory === 'all' && styles.selectedCategoryText
          ]}>
            All
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.categoryButton,
            { backgroundColor: currentTheme.cardBackground },
            selectedCategory === 'favorites' && styles.selectedCategory
          ]}
          onPress={() => setSelectedCategory('favorites')}
        >
          <Text style={[
            styles.categoryText,
            { color: currentTheme.cardText },
            selectedCategory === 'favorites' && styles.selectedCategoryText
          ]}>
            Favorites
          </Text>
        </Pressable>
      </View>
  
      <PressableButton
        pressedHandler={() => router.navigate('/(tabs)/(recipes)/add')}
      >
        <Ionicons name="add" size={24} color={currentTheme.navigationTextColor} />
        <Text style={{ color: currentTheme.navigationTextColor, marginLeft: 8 }}>Add Recipe</Text>
      </PressableButton>
  
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecipeCard
            key={`${item.id}-${favorites.has(item.id) ? 'fav' : 'nofav'}`}
            recipe={item}
            onPress={() => router.push(`/(tabs)/(recipes)/${item.id}`)}
            isFavorite={favorites.has(item.id)}
            onFavoritePress={() => toggleFavorite(item.id)}
          />
        )}
        refreshing={isLoading}
        onRefresh={fetchRecipes}
        extraData={favorites}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: '500',
  },
});
