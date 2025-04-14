import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { getRecipeById, deleteRecipe, updateRecipe } from '../../../../firebase/firestore'; 
import { RecipeData } from '@/types';
import { ThemeContext } from '../../../../ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getEmojiFromName } from '@/utils/emojiGenerator';
import * as Haptics from 'expo-haptics';

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<(RecipeData & { id: string }) | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [emoji, setEmoji] = useState('🍽️');
  const [loading, setLoading] = useState(true);
  const { theme } = React.useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) return;
      setLoading(true);
      const data = await getRecipeById(id as string);
      if (data) {
        setRecipe(data);
        setIsFavorite(data.isFavorite ?? false);
      }
      setLoading(false);
    };
    loadRecipe();
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      const loadRecipe = async () => {
        if (!id) return;
        setLoading(true);
        const data = await getRecipeById(id as string);
        if (data) {
          setRecipe(data);
          setIsFavorite(data.isFavorite ?? false);
        }
        setLoading(false);
      };
      loadRecipe();
    }, [id])
  );

  useEffect(() => {
    if (!recipe?.photoUrl && recipe?.name) {
      getEmojiFromName(recipe.name).then(setEmoji);
    }
  }, [recipe?.name, recipe?.photoUrl]);

  const renderRecipeImage = () => {
    if (!recipe?.photoUrl) {
      return (
        <LinearGradient 
          colors={[currentTheme.background === '#131313' ? '#333' : '#f0e9f9', '#c7c6ec']} 
          style={styles.recipeImage}
        >
          <Text style={styles.emoji}>{emoji}</Text>
        </LinearGradient>
      );
    }

    if (typeof recipe.photoUrl === 'string') {
      return (
        <Image 
          source={{ uri: recipe.photoUrl }} 
          style={styles.recipeImage}
          resizeMode="cover"
        />
      );
    } else if (typeof recipe.photoUrl === 'number') {
      return (
        <Image 
          source={recipe.photoUrl} 
          style={styles.recipeImage}
          resizeMode="cover"
        />
      );
    } else {
      return null;
    }
  };

  const handleToggleFavorite = async () => {
    if (!recipe) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      await deleteRecipe(recipe.id);
      router.replace('/(protected)/(tabs)/(recipes)');
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = () => {
    if (!recipe) return;
    Haptics.selectionAsync();
    router.push({
      pathname: '/(protected)/(tabs)/(recipes)/edit',
      params: { id: recipe.id },
    });
  };

  const handleBack = () => {
    Haptics.selectionAsync();
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: currentTheme.background }]}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={currentTheme.navigationBackgroundColor} />
          <Text style={[styles.loadingText, { color: currentTheme.text }]}>Loading recipe...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: currentTheme.background }]}>
        <View style={styles.loadingContent}>
          <Ionicons name="alert-circle-outline" size={48} color={currentTheme.text} />
          <Text style={[styles.loadingText, { color: currentTheme.text }]}>Recipe not found</Text>
          <TouchableOpacity 
            style={[styles.backToRecipesButton, { backgroundColor: currentTheme.navigationBackgroundColor }]}
            onPress={() => router.replace('/(protected)/(tabs)/(recipes)')}
          >
            <Text style={styles.backToRecipesText}>Back to Recipes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: currentTheme.background }}>
      <StatusBar barStyle={currentTheme.background === '#131313' ? 'light-content' : 'dark-content'} />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          {renderRecipeImage()}
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent']}
            style={styles.imageGradient}
            pointerEvents="none"
          />

          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={handleToggleFavorite}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#FF3B30" : "white"} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: currentTheme.text }]}>{recipe.name}</Text>


          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list-outline" size={22} color={currentTheme.navigationBackgroundColor} style={{ marginRight: 8 }} />
              <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Ingredients</Text>
            </View>
            <View style={[styles.card, { backgroundColor: currentTheme.cardBackground }]}>
  {recipe.ingredients.map((ingredient, index) => (
    <Text key={index} style={[styles.ingredientText, { color: currentTheme.text }]}>
      {ingredient}
    </Text>
  ))}
</View>

          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={22} color={currentTheme.navigationBackgroundColor} style={{ marginRight: 8 }} />
              <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Instructions</Text>
            </View>
            <View style={[styles.card, { backgroundColor: currentTheme.cardBackground }]}>
              {recipe.instructions.split('\n').filter(step => step.trim()).map((step, index) => {
                const cleanStep = step.trim().replace(/^\d+[\.\)\-\s]+\s*/, '');
                
                return (
                  <View key={index} style={styles.instructionStep}>
                    <View style={[styles.stepNumberContainer, { backgroundColor: currentTheme.navigationBackgroundColor }]}>
                      <Text style={styles.stepNumber}>{index + 1}</Text>
                    </View>
                    <Text style={[styles.instructionsText, { color: currentTheme.text }]}>
                      {cleanStep}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: currentTheme.navigationBackgroundColor }]}
              onPress={handleEdit}
            >
              <Ionicons name="create-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.actionButtonText}>Edit Recipe</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#FF3B30' }]}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
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
    flex: 1 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingContent: { 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  loadingText: { 
    marginTop: 16, 
    fontSize: 16,
    fontWeight: '500'
  },
  backToRecipesButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backToRecipesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  imageContainer: { 
    position: 'relative', 
    width: '100%', 
    height: 320,
    overflow: 'hidden',
  },
  imageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  recipeImage: { 
    width: '100%', 
    height: '100%', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  emoji: { 
    fontSize: 80 
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
  },
  contentContainer: { 
    paddingHorizontal: 24, 
    paddingTop: 24,
    paddingBottom: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 16,
    letterSpacing: 0.25,
  },
  metadataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataText: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: '500',
  },
  section: { 
    marginBottom: 28 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 14 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '700' 
  },
  card: { 
    borderRadius: 16, 
    padding: 18, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 3 
  },
  ingredientItem: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginBottom: 12,
    paddingRight: 8,
  },
  bullet: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    marginRight: 12,
    marginTop: 8,
  },
  ingredientText: { 
    fontSize: 16, 
    lineHeight: 24,
    flex: 1,
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumber: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionsText: { 
    fontSize: 16, 
    lineHeight: 24,
    flex: 1,
  },
  actionButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 16 
  },
  actionButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 14, 
    paddingHorizontal: 24, 
    borderRadius: 14, 
    flex: 0.48, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 3 
  },
  actionButtonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
});
