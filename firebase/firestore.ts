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
import { RecipeData } from '@/types';

const userId = "testUser";


export async function addRecipe(
  recipe: Omit<RecipeData, 'id' | 'createdAt'>,
  collectionName: string = 'recipes'
) {
  try {
    const recipesRef = collection(doc(database, 'users', userId), collectionName);
    await addDoc(recipesRef, {
      ...recipe,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Error adding recipe:', err);
  }
}

export async function getRecipeById(
  docId: string,
  collectionName: string = 'recipes'
) {
  try {
    const docRef = doc(database, 'users', userId, collectionName, docId);
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

export async function updateRecipe(
  docId: string,
  updates: Partial<RecipeData>,
  collectionName: string = 'recipes'
) {
  try {
    const docRef = doc(database, 'users', userId, collectionName, docId);
    await updateDoc(docRef, updates);
  } catch (err) {
    console.error('Error updating recipe:', err);
  }
}

export async function deleteRecipe(
  docId: string,
  collectionName: string = 'recipes'
) {
  try {
    const docRef = doc(database, 'users', userId, collectionName, docId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting recipe:', err);
  }
}

export async function getAllRecipes(collectionName: string = 'recipes') {
  try {
    const colRef = collection(doc(database, 'users', userId), collectionName);
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

export async function deleteAllRecipes(
  collectionName: string = 'recipes'
) {
  try {
    const colRef = collection(doc(database, 'users', userId), collectionName);
    const querySnapshot = await getDocs(colRef);
    if (querySnapshot.empty) return;
    for (const docSnap of querySnapshot.docs) {
      await deleteDoc(doc(database, 'users', userId, collectionName, docSnap.id));
    }
  } catch (err) {
    console.error('Error deleting all recipes:', err);
  }
}
