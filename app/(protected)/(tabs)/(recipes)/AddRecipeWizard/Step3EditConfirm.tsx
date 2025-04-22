import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { uploadUserImage } from '@/utils/imageUpload';
import { detectIngredientsFromImage } from '@/utils/googleVision';
import { generateRecipeWithAI } from '@/utils/generateRecipeWithAI';
import { addRecipe } from '@/firebase/firestore';
import { ThemeContext } from '@/ThemeContext';
import Colors from '@/constants/styles';

export default function Step3EditConfirm() {
  const { imageUri, mode } = useLocalSearchParams<{ imageUri?: string; mode?: string }>();
  const { theme } = useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  const [userPreferences, setUserPreferences] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [aiUploadedUrl, setAiUploadedUrl] = useState('');

  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  async function handleGenerateAi() {
    if (!imageUri && !userPreferences.trim()) {
      Alert.alert('Missing Info', 'You need either a photo or typed preferences');
      return;
    }
    setAiLoading(true);

    try {
      let recognizedLabels: string[] = [];
      let finalPhotoUrl = '';

      if (imageUri) {
        finalPhotoUrl = await uploadUserImage(imageUri, `recipeAi_${Date.now()}`);
        setAiUploadedUrl(finalPhotoUrl);
        recognizedLabels = await detectIngredientsFromImage(finalPhotoUrl);
        console.log('Vision recognized:', recognizedLabels);
      }

      let prompt = userPreferences.trim();
      if (recognizedLabels.length) {
        prompt += `\nDetected from photo: ${recognizedLabels.join(', ')}`;
      }
      if (!prompt) {
        prompt = 'Please generate a general recipe.';
      }

      const aiData = await generateRecipeWithAI({ prompt });

      if (!aiData || !aiData.name) {
        throw new Error('AI failed to return a valid recipe');
      }

      setName(aiData.name);
      setIngredients(aiData.ingredients.join(', '));
      setInstructions(aiData.instructions);
      setAiGenerated(true);

      Alert.alert('AI Generation Complete', 'Your recipe has been created based on your image and preferences');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.message || 'Failed');
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSave() {
    if (!name && !ingredients && !instructions) {
      Alert.alert('No data', 'Please generate or type something');
      return;
    }

    try {
      let finalPhotoUrl = aiUploadedUrl;
      if (!finalPhotoUrl && imageUri) {
        finalPhotoUrl = await uploadUserImage(imageUri, `recipeFinal_${Date.now()}`);
      }

      const ingrArr = ingredients.split(',').map(i => i.trim()).filter(Boolean);
      await addRecipe({
        name,
        ingredients: ingrArr,
        instructions,
        photoUrl: finalPhotoUrl,
      });

      Alert.alert('Saved', 'Your recipe has been saved');
      router.replace('/(tabs)/(recipes)');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message || 'Save failed');
    }
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: currentTheme.background}]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {mode === 'ai' ? (
            <>
              <Text style={[styles.stepDescription, {color: currentTheme.text}]}>
                {imageUri ? 'Use AI to generate a recipe from your image' : 'Generate a recipe with AI'}
              </Text>
              
              {imageUri && (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                  {!aiGenerated && (
                    <Text style={[styles.imageCaptionText, {color: currentTheme.text}]}>
                      AI will analyze this image for ingredients
                    </Text>
                  )}
                </View>
              )}
            </>
          ) : (
            <>
              <Text style={[styles.stepDescription, {color: currentTheme.text}]}>
                Enter your recipe details
              </Text>
              
              {imageUri && (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                </View>
              )}
            </>
          )}

          {mode === 'ai' ? (
            !aiGenerated ? (
              <View style={styles.aiInputContainer}>
                <Text style={[styles.subtitle, {color: currentTheme.text}]}>
                  <Ionicons name="bulb-outline" size={18} color={Colors.primaryPurple} /> Your Ingredients or Preferences
                </Text>
                <TextInput
                  style={[styles.textArea, {
                    backgroundColor: currentTheme.cardBackground,
                    color: currentTheme.cardText,
                    borderColor: Colors.lightGray
                  }]}
                  multiline
                  value={userPreferences}
                  onChangeText={setUserPreferences}
                  placeholder={
                    imageUri
                      ? 'Optionally add more requests (spicy, low fat, etc)'
                      : 'No photo → describe ingredients or preferences'
                  }
                  placeholderTextColor={Colors.mediumGray}
                />
                <Pressable 
                  style={({ pressed }) => [
                    styles.button, 
                    {backgroundColor: Colors.primaryPurple},
                    pressed && styles.buttonPressed
                  ]} 
                  onPress={handleGenerateAi}
                  disabled={aiLoading}
                >
                  {aiLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator color="#fff" size="small" />
                      <Text style={styles.buttonText}>Generating...</Text>
                    </View>
                  ) : (
                    <View style={styles.buttonContent}>
                      <Ionicons name="flash-outline" size={18} color="#fff" />
                      <Text style={styles.buttonText}>Generate with AI</Text>
                    </View>
                  )}
                </Pressable>
              </View>
            ) : (
              <View style={styles.formContainer}>
                <Text style={[styles.subtitle, {color: currentTheme.text}]}>
                  <Ionicons name="create-outline" size={18} color={Colors.primaryPurple} /> Edit Recipe Details
                </Text>
                
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, {color: currentTheme.text}]}>Recipe Name</Text>
                  <TextInput 
                    style={[styles.input, {
                      backgroundColor: currentTheme.cardBackground,
                      color: currentTheme.cardText,
                      borderColor: Colors.lightGray
                    }]} 
                    value={name} 
                    onChangeText={setName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, {color: currentTheme.text}]}>
                    Ingredients <Text style={styles.inputHelper}>(comma-separated)</Text>
                  </Text>
                  <TextInput 
                    style={[styles.input, {
                      backgroundColor: currentTheme.cardBackground,
                      color: currentTheme.cardText,
                      borderColor: Colors.lightGray
                    }]} 
                    value={ingredients} 
                    onChangeText={setIngredients}
                    multiline
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, {color: currentTheme.text}]}>Instructions</Text>
                  <TextInput
                    style={[styles.input, styles.instructionsInput, {
                      backgroundColor: currentTheme.cardBackground,
                      color: currentTheme.cardText,
                      borderColor: Colors.lightGray
                    }]}
                    multiline
                    value={instructions}
                    onChangeText={setInstructions}
                  />
                </View>
              </View>
            )
          ) : (
            <View style={styles.formContainer}>
              <Text style={[styles.subtitle, {color: currentTheme.text}]}>
                <Ionicons name="create-outline" size={18} color={Colors.primaryPurple} /> Recipe Details
              </Text>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, {color: currentTheme.text}]}>Recipe Name</Text>
                <TextInput 
                  style={[styles.input, {
                    backgroundColor: currentTheme.cardBackground,
                    color: currentTheme.cardText,
                    borderColor: Colors.lightGray
                  }]} 
                  value={name} 
                  onChangeText={setName}
                  placeholder="Enter recipe name"
                  placeholderTextColor={Colors.mediumGray}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, {color: currentTheme.text}]}>
                  Ingredients <Text style={styles.inputHelper}>(comma-separated)</Text>
                </Text>
                <TextInput 
                  style={[styles.input, {
                    backgroundColor: currentTheme.cardBackground,
                    color: currentTheme.cardText,
                    borderColor: Colors.lightGray
                  }]} 
                  value={ingredients} 
                  onChangeText={setIngredients}
                  placeholder="e.g. 2 eggs, 1 cup flour, 1/2 tsp salt"
                  placeholderTextColor={Colors.mediumGray}
                  multiline
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, {color: currentTheme.text}]}>Instructions</Text>
                <TextInput
                  style={[styles.input, styles.instructionsInput, {
                    backgroundColor: currentTheme.cardBackground,
                    color: currentTheme.cardText,
                    borderColor: Colors.lightGray
                  }]}
                  multiline
                  value={instructions}
                  onChangeText={setInstructions}
                  placeholder="Step by step cooking instructions..."
                  placeholderTextColor={Colors.mediumGray}
                />
              </View>
            </View>
          )}

          <View style={styles.actionButtonsContainer}>
            <Pressable 
              style={({ pressed }) => [
                styles.button, 
                {backgroundColor: Colors.primaryPurple},
                pressed && styles.buttonPressed
              ]} 
              onPress={handleSave}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="save-outline" size={18} color="#fff" />
                <Text style={styles.buttonText}>Save Recipe</Text>
              </View>
            </Pressable>

            <Pressable 
              style={({ pressed }) => [
                styles.button, 
                styles.cancelButton,
                pressed && styles.buttonPressed
              ]} 
              onPress={() => router.back()}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="close-outline" size={18} color="#fff" />
                <Text style={styles.buttonText}>Cancel</Text>
              </View>
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
  scrollContent: {
    padding: 20,
  },
  stepDescription: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 25,
    paddingHorizontal: 15,
    lineHeight: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  imagePreview: {
    width: 250,
    height: 250,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  imageCaptionText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.mediumGray,
  },
  aiInputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  inputHelper: {
    fontSize: 14,
    fontWeight: 'normal',
    color: Colors.mediumGray,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 12,
    minHeight: 100,
    padding: 12,
    marginBottom: 16,
    width: '100%',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 12,
    padding: 12,
    width: '100%',
    fontSize: 16,
  },
  instructionsInput: {
    minHeight: 150,
    textAlignVertical: 'top',
  },
  actionButtonsContainer: {
    gap: 14,
    marginTop: 20,
    marginBottom: 30,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
  subtitle: {
    fontSize: 20,
    marginVertical: 16,
    fontWeight: '600',
    paddingHorizontal: 5,
  },
});
