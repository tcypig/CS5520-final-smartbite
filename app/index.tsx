// import { Redirect } from 'expo-router';

// export default function MainPage() {
//   return <Redirect href="/(tabs)/(recipes)" />;
// }


// // app/index.tsx
// import { Redirect } from 'expo-router';

// export default function Index() {
//   return <Redirect href="/(auth)/login" />;
// }

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import { router } from 'expo-router';
import { auth } from '@/firebase/firebaseSetup';
import RecipeCard from '@/components/RecipeCard';
import { RecipeData } from '@/types';

export default function IndexScreen() {
  const sampleRecipes: (RecipeData & { id: string })[] = [
    {
      id: '1',
      name: 'Spicy Chickpea Bowl',
      ingredients: [],
      instructions: '',
    },
    {
      id: '2',
      name: 'Avocado Toast',
      ingredients: [],
      instructions: '',
    },
    {
      id: '3',
      name: 'Quinoa Salad',
      ingredients: [],
      instructions: '',
    },
  ];

  const recipeImages = [
    require('../assets/recipePhoto/spicy_chicken_bowl.png'),
    require('../assets/recipePhoto/avocado_toast.png'),
    require('../assets/recipePhoto/quinoa_salad.png'),
  ];

  function handleViewAllRecipes() {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Login Required', 'Please log in to access your personalized recipes.', [
        { text: 'Go to Login', onPress: () => router.push('/(auth)/login') },
      ]);
    } else {
      router.replace('/(protected)/(tabs)/(recipes)');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SmartBite</Text>
      <Text style={styles.subtitle}>
        Your AI-powered recipe assistant. Discover delicious and healthy meals tailored for you!
      </Text>

      <Text style={styles.sectionTitle}>Sample Recipes</Text>
      {sampleRecipes.map((recipe, index) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onPress={() => {}}
          localImage={recipeImages[index]}
        />
      ))}

      <View style={{ marginTop: 20 }}>
        <Button title="View All Recipes" onPress={handleViewAllRecipes} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
    padding: 24,
    paddingTop: 64, // 👈 Add this line to push content down
    alignItems: 'center',
    backgroundColor: '#fff',
    },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#8A4FFF',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
});
