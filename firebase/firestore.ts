// // import { database } from './firebaseSetup';
// // import {
// //   collection,
// //   addDoc,
// //   doc,
// //   deleteDoc,
// //   getDocs,
// //   getDoc,
// //   updateDoc,
// //   serverTimestamp,
// // } from 'firebase/firestore';
// // import { RecipeData } from '@/types';
// // import { auth } from "@/firebase/firebaseSetup"

// // const user = auth.currentUser;

// // const userId = user.uid;


// // export async function addRecipe(
// //   recipe: Omit<RecipeData, 'id' | 'createdAt'>,
// //   collectionName: string = 'recipes'
// // ) {
// //   try {
// //     const recipesRef = collection(doc(database, 'users', userId), collectionName);
// //     await addDoc(recipesRef, {
// //       ...recipe,
// //       createdAt: serverTimestamp(),
// //     });
// //   } catch (err) {
// //     console.error('Error adding recipe:', err);
// //   }
// // }

// // export async function getRecipeById(
// //   docId: string,
// //   collectionName: string = 'recipes'
// // ) {
// //   try {
// //     const docRef = doc(database, 'users', userId, collectionName, docId);
// //     const snapshot = await getDoc(docRef);
// //     if (!snapshot.exists()) {
// //       console.warn(`No recipe found with ID: ${docId}`);
// //       return null;
// //     }
// //     return { ...snapshot.data(), id: snapshot.id } as RecipeData & { id: string };
// //   } catch (err) {
// //     console.error('Error reading recipe by ID:', err);
// //     return null;
// //   }
// // }

// // export async function updateRecipe(
// //   docId: string,
// //   updates: Partial<RecipeData>,
// //   collectionName: string = 'recipes'
// // ) {
// //   try {
// //     const docRef = doc(database, 'users', userId, collectionName, docId);
// //     await updateDoc(docRef, updates);
// //   } catch (err) {
// //     console.error('Error updating recipe:', err);
// //   }
// // }

// // export async function deleteRecipe(
// //   docId: string,
// //   collectionName: string = 'recipes'
// // ) {
// //   try {
// //     const docRef = doc(database, 'users', userId, collectionName, docId);
// //     await deleteDoc(docRef);
// //   } catch (err) {
// //     console.error('Error deleting recipe:', err);
// //   }
// // }

// // export async function getAllRecipes(collectionName: string = 'recipes') {
// //   try {
// //     const colRef = collection(doc(database, 'users', userId), collectionName);
// //     const querySnapshot = await getDocs(colRef);
// //     if (querySnapshot.empty) return [];

// //     const recipes: (RecipeData & { id: string })[] = [];
// //     querySnapshot.forEach((docSnap) => {
// //       recipes.push({ ...docSnap.data(), id: docSnap.id } as RecipeData & { id: string });
// //     });
// //     return recipes;
// //   } catch (err) {
// //     console.error('Error reading all recipes:', err);
// //     return [];
// //   }
// // }

// // export async function deleteAllRecipes(
// //   collectionName: string = 'recipes'
// // ) {
// //   try {
// //     const colRef = collection(doc(database, 'users', userId), collectionName);
// //     const querySnapshot = await getDocs(colRef);
// //     if (querySnapshot.empty) return;
// //     for (const docSnap of querySnapshot.docs) {
// //       await deleteDoc(doc(database, 'users', userId, collectionName, docSnap.id));
// //     }
// //   } catch (err) {
// //     console.error('Error deleting all recipes:', err);
// //   }
// // }

// import { database } from './firebaseSetup';
// import {
//   collection,
//   addDoc,
//   doc,
//   deleteDoc,
//   getDocs,
//   getDoc,
//   updateDoc,
//   serverTimestamp,
//   setDoc
// } from 'firebase/firestore';
// import { RecipeData } from '@/types';
// import { auth } from '@/firebase/firebaseSetup';
// import { User } from '@/types';

// /**
//  * add new recipe
//  */
// export async function addRecipe(
//   recipe: Omit<RecipeData, 'id' | 'createdAt'>,
//   collectionName: string = 'recipes'
// ) {
//   const user = auth.currentUser;
//   if (!user) {
//     console.error('No user logged in, cannot add recipe');
//     return;
//   }

//   try {
//     const recipesRef = collection(doc(database, 'users', user.uid), collectionName);
//     await addDoc(recipesRef, {
//       ...recipe,
//       createdAt: serverTimestamp(),
//     });
//   } catch (err) {
//     console.error('Error adding recipe:', err);
//   }
// }

// /**
//  * get a single recipe
//  */
// export async function getRecipeById(
//   docId: string,
//   collectionName: string = 'recipes'
// ) {
//   const user = auth.currentUser;
//   if (!user) {
//     console.error('No user logged in, cannot read recipe');
//     return null;
//   }

//   try {
//     const docRef = doc(database, 'users', user.uid, collectionName, docId);
//     const snapshot = await getDoc(docRef);
//     if (!snapshot.exists()) {
//       console.warn(`No recipe found with ID: ${docId}`);
//       return null;
//     }
//     return { ...snapshot.data(), id: snapshot.id } as RecipeData & { id: string };
//   } catch (err) {
//     console.error('Error reading recipe by ID:', err);
//     return null;
//   }
// }

// /**
//  * update a recipe
//  */
// export async function updateRecipe(
//   docId: string,
//   updates: Partial<RecipeData>,
//   collectionName: string = 'recipes'
// ) {
//   const user = auth.currentUser;
//   if (!user) {
//     console.error('No user logged in, cannot update recipe');
//     return;
//   }

//   try {
//     const docRef = doc(database, 'users', user.uid, collectionName, docId);
//     await updateDoc(docRef, updates);
//   } catch (err) {
//     console.error('Error updating recipe:', err);
//   }
// }

// /**
//  * delete single recipe
//  */
// export async function deleteRecipe(
//   docId: string,
//   collectionName: string = 'recipes'
// ) {
//   const user = auth.currentUser;
//   if (!user) {
//     console.error('No user logged in, cannot delete recipe');
//     return;
//   }

//   try {
//     const docRef = doc(database, 'users', user.uid, collectionName, docId);
//     await deleteDoc(docRef);
//   } catch (err) {
//     console.error('Error deleting recipe:', err);
//   }
// }

// /**
//  * read all recipes
//  */
// export async function getAllRecipes(collectionName: string = 'recipes') {
//   const user = auth.currentUser;
//   if (!user) {
//     console.error('No user logged in, cannot read recipes');
//     return [];
//   }

//   try {
//     const colRef = collection(doc(database, 'users', user.uid), collectionName);
//     const querySnapshot = await getDocs(colRef);
//     if (querySnapshot.empty) return [];

//     const recipes: (RecipeData & { id: string })[] = [];
//     querySnapshot.forEach((docSnap) => {
//       recipes.push({
//         ...docSnap.data(),
//         id: docSnap.id,
//       } as RecipeData & { id: string });
//     });
//     return recipes;
//   } catch (err) {
//     console.error('Error reading all recipes:', err);
//     return [];
//   }
// }

// /**
//  * delete all recipes
//  */
// export async function deleteAllRecipes(collectionName: string = 'recipes') {
//   const user = auth.currentUser;
//   if (!user) {
//     console.error('No user logged in, cannot delete recipes');
//     return;
//   }

//   try {
//     const colRef = collection(doc(database, 'users', user.uid), collectionName);
//     const querySnapshot = await getDocs(colRef);
//     if (querySnapshot.empty) return;

//     for (const docSnap of querySnapshot.docs) {
//       await deleteDoc(doc(database, 'users', user.uid, collectionName, docSnap.id));
//     }
//   } catch (err) {
//     console.error('Error deleting all recipes:', err);
//   }
// }

// export async function saveUserProfile(profile: { nickname: string; photoUrl: string }) {
//     const user = auth.currentUser;
//     if (!user) throw new Error('No authenticated user');
  
//     const userRef = doc(database, 'users', user.uid);
//     await setDoc(userRef, {
//       nickname: profile.nickname,
//       photoUrl: profile.photoUrl,
//       email: user.email,
//     }, { merge: true });
//   }
//   export async function getUserProfile(userId: string): Promise<User | null> {
//     try {
//       const userRef = doc(database, 'users', userId);
//       const docSnap = await getDoc(userRef);
  
//       if (docSnap.exists()) {
//         return docSnap.data() as User;
//       } else {
//         return null;
//       }
//     } catch (error) {
//       console.error('Error getting user profile:', error);
//       return null;
//     }
//   }
  
//   export async function updateUserProfile(userId: string, data: Partial<User>) {
//     const userRef = doc(database, "users", userId);
//     await setDoc(userRef, data, { merge: true });
//   }
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
  setDoc
} from 'firebase/firestore';
import { RecipeData } from '@/types';
import { auth } from '@/firebase/firebaseSetup';
import { User } from '@/types';

/**
 * Add new recipe
 */
export async function addRecipe(
  recipe: Omit<RecipeData, 'id' | 'createdAt'>,
  collectionName: string = 'recipes'
) {
  const user = auth.currentUser;
  if (!user) {
    console.error('No user logged in, cannot add recipe');
    return;
  }

  try {
    const recipesRef = collection(doc(database, 'users', user.uid), collectionName);
    await addDoc(recipesRef, {
      ...recipe,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Error adding recipe:', err);
  }
}

/**
 * Get a single recipe
 */
export async function getRecipeById(
  docId: string,
  collectionName: string = 'recipes'
) {
  const user = auth.currentUser;
  if (!user) {
    console.error('No user logged in, cannot read recipe');
    return null;
  }

  try {
    const docRef = doc(database, 'users', user.uid, collectionName, docId);
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
 * Update a recipe
 */
export async function updateRecipe(
  docId: string,
  updates: Partial<RecipeData>,
  collectionName: string = 'recipes'
) {
  const user = auth.currentUser;
  if (!user) {
    console.error('No user logged in, cannot update recipe');
    return;
  }

  try {
    const docRef = doc(database, 'users', user.uid, collectionName, docId);
    await updateDoc(docRef, updates);
  } catch (err) {
    console.error('Error updating recipe:', err);
  }
}

/**
 * Delete a single recipe
 */
export async function deleteRecipe(
  docId: string,
  collectionName: string = 'recipes'
) {
  const user = auth.currentUser;
  if (!user) {
    console.error('No user logged in, cannot delete recipe');
    return;
  }

  try {
    const docRef = doc(database, 'users', user.uid, collectionName, docId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting recipe:', err);
  }
}

/**
 * Read all recipes
 */
export async function getAllRecipes(collectionName: string = 'recipes') {
  const user = auth.currentUser;
  if (!user) {
    console.error('No user logged in, cannot read recipes');
    return [];
  }

  try {
    const colRef = collection(doc(database, 'users', user.uid), collectionName);
    const querySnapshot = await getDocs(colRef);
    if (querySnapshot.empty) return [];

    const recipes: (RecipeData & { id: string })[] = [];
    querySnapshot.forEach((docSnap) => {
      recipes.push({
        ...docSnap.data(),
        id: docSnap.id,
      } as RecipeData & { id: string });
    });
    return recipes;
  } catch (err) {
    console.error('Error reading all recipes:', err);
    return [];
  }
}

/**
 * Delete all recipes
 */
export async function deleteAllRecipes(collectionName: string = 'recipes') {
  const user = auth.currentUser;
  if (!user) {
    console.error('No user logged in, cannot delete recipes');
    return;
  }

  try {
    const colRef = collection(doc(database, 'users', user.uid), collectionName);
    const querySnapshot = await getDocs(colRef);
    if (querySnapshot.empty) return;

    for (const docSnap of querySnapshot.docs) {
      await deleteDoc(doc(database, 'users', user.uid, collectionName, docSnap.id));
    }
  } catch (err) {
    console.error('Error deleting all recipes:', err);
  }
}

/**
 * Save user profile info
 */
export async function saveUserProfile(profile: { nickname: string; photoUrl: string }) {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user');

  const userRef = doc(database, 'users', user.uid);
  await setDoc(userRef, {
    nickname: profile.nickname,
    photoUrl: profile.photoUrl,
    email: user.email,
  }, { merge: true });
}

/**
 * Get another user's profile
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const userRef = doc(database, 'users', userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return docSnap.data() as User;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, data: Partial<User>) {
  const userRef = doc(database, 'users', userId);
  await setDoc(userRef, data, { merge: true });
}
