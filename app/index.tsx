// app/index.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function MainPage() {
  const router = useRouter();

  // For demonstration, these are placeholders
  const sampleRecipes = [
    { id: '1', name: 'Recipe A' },
    { id: '2', name: 'Recipe B' },
    // ...
  ];
  const sampleNutritions = [
    { id: '1', name: 'Nutrition A' },
    { id: '2', name: 'Nutrition B' },
  ];

  /** Renders a single recipe card, tapping navigates to /recipes/[id] */
  function renderRecipeCard({ item }: { item: { id: string; name: string } }) {
    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          // for example: navigate to app/(tabs)/(recipes)/[id].tsx
          router.push(`/(tabs)/(recipes)`);
        }}
      >
        <Text style={styles.cardText}>{item.name}</Text>
      </Pressable>
    );
  }

  /** Renders a single nutrition card, tapping navigates to /nutritions/[id] */
  function renderNutritionCard({ item }: { item: { id: string; name: string } }) {
    return (
      <Pressable
        style={styles.card}
        onPress={() => {
          // for example: navigate to app/(tabs)/(nutritions)/[id].tsx
          router.push(`/(tabs)/(nutritions)/`);
        }}
      >
        <Text style={styles.cardText}>{item.name}</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      {/* Saved Recipes Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Saved Recipes</Text>
        <FlatList
          horizontal
          data={sampleRecipes}
          keyExtractor={(item) => item.id}
          renderItem={renderRecipeCard}
        />
      </View>

      {/* Saved Nutrition Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Saved Nutrition</Text>
        <FlatList
          horizontal
          data={sampleNutritions}
          keyExtractor={(item) => item.id}
          renderItem={renderNutritionCard}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  section: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card: {
    width: 120,
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    color: '#000000',
  },
});
