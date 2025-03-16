import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getAllRecipes } from '../../../firebase/firestore';
import { RecipeData } from '../../../firebase/firestore';
import RecipeCard from '../../../components/RecipeCard';
import PressableButton from '@/components/PressableButton';
import { ThemeContext } from '../../../ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function RecipesMainScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Array<RecipeData & { id: string }>>([]);
  const { theme } = React.useContext(ThemeContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllRecipes();
        setRecipes(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Saved Recipes</Text>
      </View>
      <PressableButton
        pressedHandler={() => router.navigate('/(tabs)/(recipes)/add')}
      >
        <Ionicons name="add" size={24} color={theme.navigationTextColor} />
        <Text style={{ color: theme.navigationTextColor, marginLeft: 8 }}>Add Recipe</Text>
      </PressableButton>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onPress={() => router.push(`/(tabs)/(recipes)/${item.id}`)}
          />
        )}
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
});
