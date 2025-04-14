import axios from 'axios';
import { Alert } from 'react-native';

/**
 * Generate a recipe using OpenAI GPT model based on user preferences and photo URL (optional).
 * @param {Object} params
 * @param {string} params.prompt - User preference input (e.g., "low-carb spicy Korean dish")
 * @param {string} [params.photoUrl] - Optional uploaded image URL
 * @returns {Promise<{ name: string; ingredients: string[]; instructions: string }>}
 */
export async function generateRecipeWithAI({
  prompt,
  photoUrl,
}: {
  prompt: string;
  photoUrl?: string;
}): Promise<{ name: string; ingredients: string[]; instructions: string }> {
  const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API Key in env');
  }

  const userPrompt = `
  You are a professional recipe creator. Based on the following request and optional image, generate a recipe.
  
  Request: ${prompt}
  ${photoUrl ? `Image URL: ${photoUrl}` : ''}
  
  == Output Format (MUST follow strictly) ==
  
  Recipe Name: <name>
  
  Ingredients:
  - Each line must start with a dash (-).
  - Each ingredient must contain full information (quantity, item, preparation) on a single line.
  
  Instructions:
  1. <step1>
  2. <step2>
  ...
  `;
  

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional chef and recipe generator.',
          },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = response.data.choices?.[0]?.message?.content || '';
    console.log('GPT raw result:\n', result);

    const nameMatch = result.match(/Recipe Name:\s*(.+)/i);
    const ingredientsMatch = result.match(
      /Ingredients:\s*([\s\S]*?)\n(?:Instructions:|Directions:)/i
    );
    const instructionsMatch = result.match(
      /(?:Instructions|Directions):\s*([\s\S]*)/i
    );

    // const ingredients =
    // ingredientsMatch?.[1]
    //   ?.split('\n')
    //   .map((line: string) => line.replace(/^[-•\s]+/, '').trim())
    //   .filter(Boolean) || [];
  
    const ingredients = ingredientsMatch?.[1]
      ?.split(/\r?\n/) // Split by newline
      .map((line: string) => line.replace(/^[-•\s]+/, '').trim())
      .filter(Boolean) // Remove empty lines
      || [];

    return {
      name: nameMatch?.[1]?.trim() || 'Untitled Recipe',
      ingredients,
      instructions: instructionsMatch?.[1]?.trim() || '',
    };
  } catch (error: any) {
    console.error('OpenAI full error:', JSON.stringify(error?.response?.data, null, 2));
    Alert.alert('OpenAI Error', error?.response?.data?.error?.message || 'Failed to generate recipe');
    throw new Error('Failed to generate recipe with AI');
  }
}
