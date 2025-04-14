import React, { memo, useContext, useEffect, useState } from 'react';
import { Pressable, Text, StyleSheet, Image, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { getEmojiFromName } from '@/utils/emojiGenerator';
import { RecipeData } from '@/types';
import { ThemeContext } from '../ThemeContext';

interface RecipeCardProps {
  recipe: RecipeData & { id: string };
  onPress: () => void;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
  localImage?: number;
}

const RecipeCard = memo(({
  recipe,
  onPress,
  isFavorite = false,
  onFavoritePress,
  localImage
}: RecipeCardProps) => {
  const { theme } = useContext(ThemeContext);
  const [emoji, setEmoji] = useState('🍽️');

  useEffect(() => {
    if (!recipe.photoUrl && recipe.name) {
      getEmojiFromName(recipe.name, recipe.id).then((res) => {
        if (res) setEmoji(res);
      });
    }
  }, [recipe.name, recipe.id, recipe.photoUrl]);

  const handleFavoritePress = (e: React.BaseSyntheticEvent) => {
    e.stopPropagation();
    onFavoritePress?.();
  };

  const starColor = isFavorite ? "#FFD700" : theme.cardText;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.background === '#131313' ? '#333' : '#ddd',
        },
      ]}
    >
      <View style={styles.imageContainer}>
        {localImage ? (
          <Image source={localImage} style={styles.image} />
        ) : recipe.photoUrl ? (
          <Image source={{ uri: recipe.photoUrl }} style={styles.image} />
        ) : (
          <LinearGradient
            colors={[
              theme.background === '#131313' ? '#333' : '#f0e9f9',
              '#c7c6ec',
            ]}
            style={styles.placeholder}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </LinearGradient>
        )}

        <Pressable
          onPress={handleFavoritePress}
          style={[
            styles.favoriteButton,
            {
              backgroundColor:
                theme.background === '#131313'
                  ? 'rgba(50, 50, 50, 0.8)'
                  : 'rgba(255, 255, 255, 0.8)',
            },
          ]}
        >
          <Ionicons
            name={isFavorite ? 'star' : 'star-outline'}
            size={24}
            color={starColor}
          />
        </Pressable>
      </View>
      <Text style={[styles.title, { color: theme.cardText }]}>
        {recipe.name}
      </Text>
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
    borderRadius: 6,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
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
