import { Pressable, Text, StyleSheet, Image, View } from 'react-native';
import { RecipeData } from '../firebase/firestore';

interface RecipeCardProps {
  recipe: RecipeData & { id: string };
  onPress: () => void;
}

export default function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      {recipe.photoUrl ? (
        <Image source={{ uri: recipe.photoUrl }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text>No Image</Text>
        </View>
      )}
      <Text style={styles.title}>{recipe.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fafafa',
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
  title: { fontSize: 16, fontWeight: 'bold' },
});
