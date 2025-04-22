import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, TextInput, Modal } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getAllRecipes, updateRecipe } from '../../../../firebase/firestore';
import { RecipeData } from '@/types';
import RecipeCard from '../../../../components/RecipeCard';
import PressableButton from '@/components/PressableButton';
import { ThemeContext } from '../../../../ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

type SortOption = 'name-asc' | 'name-desc' | 'date-newest' | 'date-oldest';

export default function RecipesMainScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Array<RecipeData & { id: string }>>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'favorites'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = React.useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);
  
  // Search and sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [showSortModal, setShowSortModal] = useState(false);

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

  const filteredRecipes = recipes
    .filter(recipe => {
      // Filter by category (all or favorites)
      const categoryMatch = selectedCategory === 'all' || favorites.has(recipe.id);
      
      // Filter by search query
      const searchMatch = !searchQuery || 
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return categoryMatch && searchMatch;
    })
    .sort((a, b) => {
      // Sort by selected option
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-newest':
          return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0);
        case 'date-oldest':
          return (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0);
        default:
          return 0;
      }
    });

  // Array of sort options for the modal
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'name-asc', label: 'Name (A to Z)' },
    { value: 'name-desc', label: 'Name (Z to A)' },
    { value: 'date-newest', label: 'Date (Newest first)' },
    { value: 'date-oldest', label: 'Date (Oldest first)' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      {/* Search input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes or ingredients..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.sortRow}>
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

        <Pressable style={styles.sortButton} onPress={() => setShowSortModal(true)}>
          <Ionicons name="funnel-outline" size={18} color="#007AFF" />
          <Text style={styles.sortButtonText}>Sort</Text>
        </Pressable>
      </View>

      <PressableButton
        pressedHandler={() => router.navigate('/(tabs)/(recipes)/AddRecipeWizard/Step1SelectImage')}
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

      {/* Sort options modal */}
      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort Recipes</Text>
            {sortOptions.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.sortOption,
                  sortOption === option.value && styles.selectedSortOption
                ]}
                onPress={() => {
                  setSortOption(option.value);
                  setShowSortModal(false);
                }}
              >
                <Text style={[
                  styles.sortOptionText,
                  sortOption === option.value && styles.selectedSortOptionText
                ]}>
                  {option.label}
                </Text>
                {sortOption === option.value && (
                  <Ionicons name="checkmark" size={18} color="#007AFF" />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
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
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sortButtonText: {
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 4,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedSortOption: {
    backgroundColor: '#f8f8f8',
  },
  sortOptionText: {
    fontSize: 16,
  },
  selectedSortOptionText: {
    color: '#007AFF',
    fontWeight: '500',
  },
});
