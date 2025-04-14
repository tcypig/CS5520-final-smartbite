// utils/emojiGenerator.ts
import axios from 'axios';

const emojiCache: Record<string, string> = {};

// 简化版 hash 函数（你也可以改用 md5）
function hashName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '').trim();
}

export async function getEmojiFromName(name: string, recipeId?: string): Promise<string> {
  const key = recipeId ? `${recipeId}_${hashName(name)}` : hashName(name);
  if (emojiCache[key]) return emojiCache[key];

  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) return '🍽️';

  const prompt = `Based on the following food name, return the most fitting emoji (just one emoji only, no text):\n\nFood: "${name}"`;

  try {
    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 5,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const emoji = res.data.choices?.[0]?.message?.content?.trim() || '🍽️';
    emojiCache[key] = emoji;
    return emoji;
  } catch (err) {
    console.error('Emoji generation error:', err);
    return '🍽️';
  }
}
