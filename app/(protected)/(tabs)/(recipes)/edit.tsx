import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getRecipeById, updateRecipe } from '@/firebase/firestore';
import { ThemeContext } from '@/ThemeContext';
import Colors from '@/constants/styles';
import { Ionicons } from '@expo/vector-icons';
import BackArrow from '@/components/BackArrow';

export default function EditRecipeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const { theme } = useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) return;
      const data = await getRecipeById(id as string);
      if (data) {
        setName(data.name);
        setIngredients(data.ingredients.join(', '));
        setInstructions(data.instructions);
      }
    };
    loadRecipe();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    try {
      const ingArr = ingredients
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean);

      await updateRecipe(id as string, {
        name,
        ingredients: ingArr,
        instructions,
      });

      router.back();
    } catch (err) {
      console.log('Error updating recipe:', err);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.header, { color: currentTheme.text }]}>✏️ Edit Recipe</Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: currentTheme.text }]}>Recipe Name</Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: currentTheme.cardBackground,
                color: currentTheme.cardText,
                borderColor: Colors.lightGray
              }]}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Chocolate Pancakes"
              placeholderTextColor={Colors.mediumGray}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: currentTheme.text }]}>Ingredients (comma-separated)</Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: currentTheme.cardBackground,
                color: currentTheme.cardText,
                borderColor: Colors.lightGray
              }]}
              value={ingredients}
              onChangeText={setIngredients}
              placeholder="e.g. 2 eggs, 1 cup milk"
              placeholderTextColor={Colors.mediumGray}
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: currentTheme.text }]}>Instructions</Text>
            <TextInput
              style={[styles.input, styles.instructionsInput, {
                backgroundColor: currentTheme.cardBackground,
                color: currentTheme.cardText,
                borderColor: Colors.lightGray
              }]}
              value={instructions}
              onChangeText={setInstructions}
              multiline
              placeholder="e.g. Mix all ingredients, cook on low heat..."
              placeholderTextColor={Colors.mediumGray}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: Colors.primaryPurple },
                pressed && styles.buttonPressed
              ]}
              onPress={handleSave}
            >
              <Ionicons name="save-outline" size={18} color="#fff" />
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                pressed && styles.buttonPressed
              ]}
              onPress={() => router.back()}
            >
              <Ionicons name="close-outline" size={18} color="#fff" />
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backArrow: {
    position: 'absolute',
    left: 16,
    top: 60,
    zIndex: 10,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 80,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  instructionsInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 24,
    gap: 14,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
});
