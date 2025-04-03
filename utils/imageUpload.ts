import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/firebase/firebaseSetup';

export async function uploadUserImage(uri: string, userId: string): Promise<string> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const imageRef = ref(storage, `profileImages/${userId}.jpg`);
    const snapshot = await uploadBytesResumable(imageRef, blob);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return downloadUrl;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw new Error('Failed to upload image');
  }
}
