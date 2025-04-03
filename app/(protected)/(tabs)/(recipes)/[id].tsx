import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { getRecipeById, deleteRecipe, updateRecipe } from '../../../../firebase/firestore'; 
import { RecipeData } from '@/types';
import { ThemeContext } from '../../../../ThemeContext';
import { Ionicons } from '@expo/vector-icons';

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

  // Helper function to properly render the image based on source type
  const renderRecipeImage = () => {
    if (!recipe?.photoUrl) return null;

    // Check if photoUrl is a string (URI) or a require() result (number)
    if (typeof recipe.photoUrl === 'string') {
      return (
        <Image 
          source={{ uri: recipe.photoUrl }} 
          style={styles.recipeImage}
          resizeMode="cover"
        />
      );
    } else if (typeof recipe.photoUrl === 'number') {
      // For static images loaded with require()
      return (
        <Image 
          source={recipe.photoUrl} 
          style={styles.recipeImage}
          resizeMode="cover"
        />
      );
    } else {
      return null; // Return null if photoUrl is neither string nor number
    }
  };

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
      router.replace('/(protected)/(tabs)/(recipes)');
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = () => {
    if (!recipe) return;
    router.push({
      pathname: '/(protected)/(tabs)/(recipes)/edit',
      params: { id: recipe.id },
    });
  };

  const handleBack = () => {
    router.back();
  };

  if (!recipe) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: currentTheme.background }]}>
        <View style={styles.loadingContent}>
          <Ionicons name="hourglass-outline" size={48} color={currentTheme.text} />
          <Text style={[styles.loadingText, { color: currentTheme.text }]}>Loading recipe...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: currentTheme.background }}>
      <StatusBar barStyle={currentTheme.background === '#131313' ? 'light-content' : 'dark-content'} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Back button overlaid on the image */}
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: currentTheme.background }]} 
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color={currentTheme.text} />
        </TouchableOpacity>
        
        {/* Recipe Image */}
        <View style={styles.imageContainer}>
          {renderRecipeImage()}
          
          {/* Favorite button */}
          <TouchableOpacity 
            style={[styles.favoriteButton, { backgroundColor: currentTheme.background }]} 
            onPress={handleToggleFavorite}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={22} 
              color={isFavorite ? "#FF3B30" : currentTheme.text} 
            />
          </TouchableOpacity>
        </View>

        {/* Recipe Details */}
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: currentTheme.text }]}>{recipe.name}</Text>
          
          {/* Ingredients Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list-outline" size={22} color={currentTheme.navigationBackgroundColor} style={{ marginRight: 8 }} />
              <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Ingredients</Text>
            </View>
            <View style={[styles.card, { backgroundColor: currentTheme.cardBackground }]}>
              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={[styles.bullet, { backgroundColor: currentTheme.navigationBackgroundColor }]} />
                  <Text style={[styles.ingredientText, { color: currentTheme.text }]}>
                    {ingredient}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Instructions Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={22} color={currentTheme.navigationBackgroundColor} style={{ marginRight: 8 }} />
              <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Instructions</Text>
            </View>
            <View style={[styles.card, { backgroundColor: currentTheme.cardBackground }]}>
              <Text style={[styles.instructionsText, { color: currentTheme.text }]}>
                {recipe.instructions}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: currentTheme.navigationBackgroundColor }]}
              onPress={handleEdit}
            >
              <Ionicons name="create-outline" size={20} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#FF3B30' }]}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  ingredientText: {
    fontSize: 16,
    lineHeight: 24,
  },
  instructionsText: {
    fontSize: 16,
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 0.48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
