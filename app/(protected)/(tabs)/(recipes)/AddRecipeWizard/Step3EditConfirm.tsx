import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

import { uploadUserImage } from '@/utils/imageUpload';
import { detectIngredientsFromImage } from '@/utils/googleVision';
import { generateRecipeWithAI } from '@/utils/generateRecipeWithAI';
import { addRecipe } from '@/firebase/firestore';

import BackArrow from '@/components/BackArrow';

export default function Step3EditConfirm() {
  const { imageUri, mode } = useLocalSearchParams<{ imageUri?: string; mode?: string }>();

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

      Alert.alert('AI done', 'We used image + preferences => recipe');
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
    <View style={styles.container}>
      <BackArrow style={styles.backArrow} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          Step 3: {mode === 'ai' ? 'AI Edit & Confirm' : 'Manual Input'}
        </Text>

        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        )}

        {mode === 'ai' ? (
          <>
            {!aiGenerated && (
              <>
                <Text style={styles.subtitle}>Your Preferences</Text>
                <TextInput
                  style={styles.textArea}
                  multiline
                  value={userPreferences}
                  onChangeText={setUserPreferences}
                  placeholder={
                    imageUri
                      ? 'Optionally add more requests (spicy, low fat, etc)'
                      : 'No photo => must type some ingredients or preference'
                  }
                />
                <Button
                  title={aiLoading ? 'Generating...' : 'Generate with AI'}
                  onPress={handleGenerateAi}
                  disabled={aiLoading}
                />
              </>
            )}

            {aiGenerated && (
              <>
                <Text style={styles.subtitle}>AI Output</Text>
                <Text>Recipe Name</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} />

                <Text>Ingredients (comma-separated)</Text>
                <TextInput style={styles.input} value={ingredients} onChangeText={setIngredients} />

                <Text>Instructions</Text>
                <TextInput
                  style={[styles.input, { height: 80 }]}
                  multiline
                  value={instructions}
                  onChangeText={setInstructions}
                />
              </>
            )}
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>Manual Input</Text>
            <Text>Recipe Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <Text>Ingredients (comma-separated)</Text>
            <TextInput style={styles.input} value={ingredients} onChangeText={setIngredients} />

            <Text>Instructions</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              multiline
              value={instructions}
              onChangeText={setInstructions}
            />
          </>
        )}

        <View style={{ marginTop: 20 }}>
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" onPress={() => router.back()} color="#FF3B30" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backArrow: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -22 }],
    zIndex: 10,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 8,
    fontWeight: '600',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    minHeight: 80,
    marginVertical: 12,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 8,
    padding: 10,
  },
});