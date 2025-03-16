// firebase/firestore.ts
import { database } from './firebaseSetup';
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDocs,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

/**
 * Our basic Recipe interface. 
 * Extend it with whatever fields you need (e.g. isFavorite, photoUrl, etc.).
 */
export interface RecipeData {
  id?: string;           // Firestore doc ID (added after read)
  name: string;          // e.g. "Chicken Soup"
  ingredients: string[]; // e.g. ["chicken", "water", "salt", ...]
  instructions: string;  // e.g. "Mix everything..."
  photoUrl?: string;     // For uploaded image
  createdAt?: any;       // Firestore timestamp
  isFavorite?: boolean;
}

/**
 * Create (ADD) a new recipe 
 * @param recipe The recipe data to be added
 * @param collectionName The Firestore collection name, default "recipes"
 */
export async function addRecipe(
  recipe: Omit<RecipeData, 'id' | 'createdAt'>,
  collectionName: string = 'recipes'
) {
  try {
    const colRef = collection(database, collectionName);
    await addDoc(colRef, {
      ...recipe,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Error adding recipe:', err);
  }
}

/**
 * Read (GET) one recipe by doc ID
 * @param docId The recipe document ID
 * @param collectionName The Firestore collection name, default "recipes"
 * @returns A RecipeData object (with `id`) or null if not found
 */
export async function getRecipeById(
  docId: string,
  collectionName: string = 'recipes'
) {
  try {
    const docRef = doc(database, collectionName, docId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      console.warn(`No recipe found with ID: ${docId}`);
      return null;
    }
    return { ...snapshot.data(), id: snapshot.id } as RecipeData & { id: string };
  } catch (err) {
    console.error('Error reading recipe by ID:', err);
    return null;
  }
}

/**
 * Update a recipe by doc ID
 * @param docId The recipe document ID
 * @param updates A partial object containing the fields to update
 * @param collectionName The Firestore collection name, default "recipes"
 */
export async function updateRecipe(
  docId: string,
  updates: Partial<RecipeData>,
  collectionName: string = 'recipes'
) {
  try {
    const docRef = doc(database, collectionName, docId);
    await updateDoc(docRef, updates);
  } catch (err) {
    console.error('Error updating recipe:', err);
  }
}

/**
 * Delete a recipe by doc ID
 * @param docId The recipe document ID
 * @param collectionName The Firestore collection name, default "recipes"
 */
export async function deleteRecipe(
  docId: string,
  collectionName: string = 'recipes'
) {
  try {
    const docRef = doc(database, collectionName, docId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting recipe:', err);
  }
}

/**
 * Read all recipes (GET all)
 * @param collectionName The Firestore collection name, default "recipes"
 * @returns An array of RecipeData objects, each with an `id`
 */
export async function getAllRecipes(collectionName: string = 'recipes') {
  try {
    const colRef = collection(database, collectionName);
    const querySnapshot = await getDocs(colRef);
    if (querySnapshot.empty) return [];

    const recipes: (RecipeData & { id: string })[] = [];
    querySnapshot.forEach((docSnap) => {
      recipes.push({ ...docSnap.data(), id: docSnap.id } as RecipeData & { id: string });
    });
    return recipes;
  } catch (err) {
    console.error('Error reading all recipes:', err);
    return [];
  }
}

/**
 * Delete ALL documents in a given collection. 
 * Use with caution in production.
 * @param collectionName 
 */
export async function deleteAllRecipes(
  collectionName: string = 'recipes'
) {
  try {
    const querySnapshot = await getDocs(collection(database, collectionName));
    if (querySnapshot.empty) return;
    for (const docSnap of querySnapshot.docs) {
      await deleteDoc(doc(database, collectionName, docSnap.id));
    }
  } catch (err) {
    console.error('Error deleting all recipes:', err);
  }
}
