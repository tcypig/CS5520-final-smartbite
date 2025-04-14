import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getAllRecipes, updateRecipe } from '../../../../firebase/firestore';
import { RecipeData } from '@/types';
import RecipeCard from '../../../../components/RecipeCard';
import PressableButton from '@/components/PressableButton';
import { ThemeContext } from '../../../../ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function RecipesMainScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Array<RecipeData & { id: string }>>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'favorites'>('all');
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
    if (selectedCategory === 'all') return true;
    return favorites.has(recipe.id);
  });

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>

      <View style={styles.categoryContainer}>
        {['all', 'favorites'].map((cat) => (
          <Pressable
            key={cat}
            style={[styles.categoryButton, selectedCategory === cat && styles.selectedCategory]}
            onPress={() => setSelectedCategory(cat as 'all' | 'favorites')}
          >
            <Text style={[styles.categoryText, selectedCategory === cat && styles.selectedCategoryText]}>
              {cat === 'all' ? 'All' : 'Favorites'}
            </Text>
          </Pressable>
        ))}
      </View>

      <PressableButton
        pressedHandler={() => router.navigate('/(tabs)/(recipes)/add')}
        componentStyle={styles.addButton}
      >
        <Ionicons name="add-circle-outline" size={22} color="white" />
        <Text style={styles.addButtonText}>Add New Recipe</Text>
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
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
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
  title: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 1 },
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});
