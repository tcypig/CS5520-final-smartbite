import axios from 'axios';
export async function detectIngredientsFromImage(imageUrl: string): Promise<string[]> {
  const GOOGLE_CLOUD_VISION_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY;
  if (!GOOGLE_CLOUD_VISION_API_KEY) {
    throw new Error('Google Vision API Key not found in env!');
  }

  const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`;

  try {
    // "LABEL_DETECTION" attempts to identify general objects, categories.
    const requestBody = {
      requests: [
        {
          image: {
            source: { imageUri: imageUrl },
          },
          features: [{ type: 'LABEL_DETECTION', maxResults: 15 }], 
        },
      ],
    };

    const response = await axios.post(endpoint, requestBody, {
      headers: { 'Content-Type': 'application/json' },
    });

    // e.g. response.data:
    // {
    //   responses: [
    //     {
    //       labelAnnotations: [
    //         { description: 'Food', score: 0.98, ... },
    //         { description: 'Tomato', score: 0.94, ... },
    //         ...
    //       ]
    //     }
    //   ]
    // }
    const labelAnnotations = response.data.responses?.[0]?.labelAnnotations || [];
    console.log('Vision labelAnnotations:', labelAnnotations);

    // Extract just the description
    const labels = labelAnnotations.map((anno: any) => anno.description);

    // later will filter out things only related to foood
    //  maybe filter score > 0.5
    return labels;
  } catch (err: any) {
    console.error('Google Vision error:', err.response?.data || err.message);
    throw new Error('Failed to detect ingredients from image');
  }
}
