import { addDoc, collection, deleteDoc, doc, DocumentData, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { database } from "./firebaseSetup";
import { Alert } from "react-native";


export async function writeMealToDB(userId:string, data: DocumentData) {
  try {
    const userRef = doc(database, "users", userId);
    const mealsRef = collection(userRef, 'meals');
    const docRef = await addDoc(mealsRef, data);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

export async function analyzeNutrition(userId: string, mealId: string, ingredients: string[]) {
    const API_ID = process.env.EDAMAM_APP_ID;
    const API_KEY = process.env.EDAMAM_APP_KEY;
  
    try {
      const response = await fetch(
        `https://api.edamam.com/api/nutrition-details?app_id=${API_ID}&app_key=${API_KEY}`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            // "Edamam-Account-User": API_ID 
          },
          body: JSON.stringify({ ingr: ingredients }),
        }
      );
      
      if (!response.ok) {
        const responseText = await response.text();
        // console.error("API Error:", response.status, responseText);

        Alert.alert(
          "Nutrition Analysis Failed",
          // "We couldn't analyze the meal. Please enter ingredients clearly. Include **quantity and unit** (e.g., 1 cup coffee)",
          response.status === 555 || response.status === 400
            ? "Please check that each ingredient includes a quantity and unit."
            : `Something went wrong. \nTry again later. \n\nDetails:\n${responseText}.`,
          [{ text: "OK" }]
        );
        return;
      }

      const nutritionData = await response.json();
      if (!nutritionData.totalNutrients || !nutritionData.totalDaily) {
        throw new Error("Invalid response from API");
      }
  
      await writeNutritionToDB(userId, mealId, nutritionData);
    } catch (error) {
      console.error("Error analyzing nutrition:", error);
    }
  }

export async function writeNutritionToDB(userId: string, mealId: string, nutritionData: DocumentData) {
  try {
    const mealRef = doc(database, "users", userId, "meals", mealId);
    const nutritionRef = collection(mealRef, "nutrition"); 
    // await addDoc(nutritionRef, nutritionData);
    // await setDoc(doc(mealRef, "nutrition", "nutritionDetails"), nutritionData);
    await updateDoc(mealRef, { nutrition: nutritionData, analyzed: true });
    console.log("Nutrition data saved!");
  } catch (error) {
    console.error("Error saving nutrition data:", error);
  }
}

export async function updateMealToDB(userId:string, mealId:string, data: DocumentData) {
  try {
    const mealRef = doc(database, "users", userId, "meals", mealId);
    await setDoc(mealRef, data);
    await analyzeNutrition(userId, mealId, data.ingredients);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

export async function deleteMealFromDB(userId:string, mealId: string) {
  try {
    const mealRef = doc(database, "users", userId, "meals", mealId);
    await deleteDoc(mealRef);
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
}


export async function writeDailyCalorieToDB(userId: string, limit: number, enableNotification: boolean) {
  try {
    const notificationRef = doc(database, 'users', userId, 'notification', 'dailyCalories');

    await setDoc(notificationRef, {
      calorieLimit: limit,
      notificationEnabled: enableNotification,
      lastNotificationDate: null, // or keep previous if needed
    }, { merge: true });

    console.log('Daily calorie reminder saved to users/{userId}/notification');
  } catch (error) {
    console.error('Error saving calorie reminder:', error);
    throw error;
  }
}

export async function updateLastNotificationDate(userId: string, dateString: string) {
  try {
    const ref = doc(database, 'users', userId, 'notification', 'dailyCalories');
    await setDoc(ref, { lastNotificationDate: dateString }, { merge: true });
    console.log('lastNotificationDate updated to:', dateString);
  } catch (error) {
    console.error('Error updating lastNotificationDate:', error);
    throw error;
  }
}


