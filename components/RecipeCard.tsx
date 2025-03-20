import React, { memo } from 'react';
import { Pressable, Text, StyleSheet, Image, View } from 'react-native';
import { RecipeData } from '@/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

interface RecipeCardProps {
  recipe: RecipeData & { id: string };
  onPress: () => void;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
}

const RecipeCard = memo(({ 
  recipe, 
  onPress, 
  isFavorite = false,
  onFavoritePress 
}: RecipeCardProps) => {
  const { theme } = useContext(ThemeContext);

  const handleFavoritePress = (e: React.BaseSyntheticEvent) => {
    e.stopPropagation();
    if (onFavoritePress) {
      onFavoritePress();
    }
  };

  const starColor = isFavorite ? "#FFD700" : theme.cardText;

  return (
    <Pressable 
      onPress={onPress} 
      style={[
        styles.card, 
        { 
          backgroundColor: theme.cardBackground,
          borderColor: theme.background === '#131313' ? '#333' : '#ddd'
        }
      ]}
    >
      <View style={styles.imageContainer}>
        {recipe.photoUrl ? (
          <Image source={{ uri: recipe.photoUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ color: theme.cardText }}>No Image</Text>
          </View>
        )}
        <Pressable 
          onPress={handleFavoritePress}
          style={[
            styles.favoriteButton,
            { 
              backgroundColor: theme.background === '#131313' 
                ? 'rgba(50, 50, 50, 0.8)' 
                : 'rgba(255, 255, 255, 0.8)'
            }
          ]}
        >
          <Ionicons 
            name={isFavorite ? "star" : "star-outline"} 
            size={24} 
            color={starColor} 
          />
        </Pressable>
      </View>
      <Text style={[styles.title, { color: theme.cardText }]}>{recipe.name}</Text>
    </Pressable>
  );
});

RecipeCard.displayName = 'RecipeCard';

export default RecipeCard;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderWidth: 1,
    marginBottom: 16,
    borderRadius: 8,
    padding: 8,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 6,
    marginBottom: 8,
  },
  placeholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc',
    borderRadius: 6,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    borderRadius: 12,
    padding: 4,
  },
});
