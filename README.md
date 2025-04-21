# 🍽️ SmartBite - Iteration Summary

## 1. Data Model & Collections  
We have structured our Firestore database to ensure **efficient data retrieval, scalability, and user-specific data security**.

### **Top-Level Collection:**  
- **`users`** → Each user has their own data.
- Contains 3 sub-collections:
  - meals
  - recipes
  - notification *(new)*

### **Sub-Collections (under `users/{userId}`):**  
- **`meals`** → Stores meal logs for each user (`{mealId}` document). When a meal is added, its nutrition is automatically analyzed 
and stored within the meal document. Each document ({mealId}) represents a meal, allowing users to add, edit, and delete meals as needed.

    ```ts
    meals Schema
    {
      id: string;
      date: Timestamp;
      type: string;            // type of the meal (e.g., "Breakfast")
      image?: string;
      ingredients: string[];
      analyzed: boolean;
      nutrition?: Nutrition;
    }

    ```
  - ✅ **Create** meals using `writeMealToDB()`.  
  - ✅ **Read** meals and their nutrition using `fetchMeals()`.  
  - ✅ **Update** meals using `updateMealToDB()`.  
  - ✅ **Delete** meals using `deleteMealFromDB()`.  

- **`recipes`** → Stores saved recipes for each user (`{recipeId}` document).  
Users can create, edit, delete, and mark recipes as favorite. Each document (`{recipeId}`) represents an individual recipe, containing ingredients, instructions, and timestamps.

  ```ts
  recipes Schema
  {
    id?: string;
    name: string;
    ingredients: string[];
    instructions: string;
    photoUrl?: string;
    createdAt?: any;
    isFavorite?: boolean;
  }
  ```

  - ✅ **Create** recipes using `addRecipe()`, profile using `saveUserProfile()`.
  - ✅ **Read** recipes using `getAllRecipes()` or `getRecipeById()`, profile using `getUserProfile()`.
  - ✅ **Update** recipes using `updateRecipe()`, profile using `updateUserProfile`.
  - ✅ **Delete** recipes using `deleteRecipe()` or `deleteAllRecipes()`.

- **`notification`** → New collection to manage daily calorie reminders.

  ```ts
  notification Schema (document: dailyCalories)
  {
    calorieLimit: number;
    notificationEnabled: boolean;
    lastNotificationDate: string | null;
  }
  ```
  - ✅ **Create/Update** with `writeDailyCalorieToDB()`
  - ✅ **Update notification history** with `updateLastNotificationDate()`

---



## 2. Current Application State with Screenshots  

### 🥗 Nutrition Features  

We've implemented the core nutrition tracking functionalities, including:  

1. **Displaying all meals and their nutrition** for a selected date.  
2. **Adding new meals**, with automatic nutrition analysis powered by an external API.  
3. **Viewing detailed nutrition breakdown** for each meal.  
4. **Editing or deleting meals** as needed.  
5. **Uploading meal images** using the device camera, with image storage integrated via Firebase Storage.
6. **Showing history daily calorie totals and nutrient breakdown** over time.
7. **Setting calorie goals with optional notifications**, including daily reminders when limit is exceeded.  


#### Nutrition Screenshot:  
<img src="assets/nutritionPhoto/allNutritions.png" alt="all Meals & Nutrition" width="20%"/>
<img src="assets/nutritionPhoto/emptyMeal.png" alt="all Meals & Nutrition" width="20%"/>
<img src="assets/nutritionPhoto/addMeal.png" alt="Add Meals" width="20%"/>
<img src="assets/nutritionPhoto/editMeal.png" alt="Edit Meals" width="20%"/>
<img src="assets/nutritionPhoto/mealDetail.png" alt="Meals Detail" width="20%"/>
<img src="assets/nutritionPhoto/setGoal.png" alt="Set Calorie Goal" width="20%"/>
<img src="assets/nutritionPhoto/nutritionHistory.png" alt="Nutrition History Chart" width="20%"/>

### 🍳 Recipe Features  

We've implemented the core recipe management functionalities, including:  

1. **Displaying all saved recipes**, with support for filtering favorites.  
2. **Creating new recipes**, either manually or through AI-powered generation using image and text inputs.  
3. **Editing or deleting existing recipes**, with real-time updates in Firestore.  
4. **Favoriting recipes**, allowing users to mark/unmark and view favorite recipes separately.  
5. **Uploading recipe images** from the device or camera, stored securely via Firebase Storage.  
6. **Storing user preferences and avatars**, with support for nickname edits and profile photo uploads.  
7. **Partially enabling secure authentication**, including login, register, and password reset via email.  
8. **Integrating external AI services**, using Google Vision API and OpenAI to intelligently generate full recipes from photos and custom inputs.

#### Recipe Screenshot:  
<img src="assets/recipePhoto/all_recipes.png" alt="all Meals & Nutrition" width="20%"/>
<img src="assets/recipePhoto/add_recipe_transition.png" alt="Add Recipes" width="20%"/>
<img src="assets/recipePhoto/add_recipe_step1.png" alt="Add Recipes" width="20%"/>
<img src="assets/recipePhoto/add_recipe_step2.png" alt="Add Recipes" width="20%"/>
<img src="assets/recipePhoto/add_recipe_step3_ai.png" alt="Add Recipes" width="20%"/>
<img src="assets/recipePhoto/add_recipe_step3_manual.png" alt="Add Recipes" width="20%"/>
<img src="assets/recipePhoto/ai_generated_recipe.png" alt="Recipes Detail" width="20%"/>
<img src="assets/recipePhoto/editRecipe.png" alt="Edit Recipe" width="20%"/>


#### Others Screenshot:
<img src="assets/recipePhoto/others.png" alt="settings" width="20%"/>

#### Map Screenshot:
<img src="assets/recipePhoto/map.png" alt="map" width="20%"/>

#### Profile Screenshot:
<img src="assets/profile.png" alt="profile" width="20%"/>


#### Login/Register/Forgot/Password_Strength Screenshot:
<img src="assets/login.png" alt="login" width="20%"/>
<img src="assets/register.png" alt="register" width="20%"/>
<img src="assets/forgot_password.png" alt="forgot" width="20%"/>
<img src="assets/password_strength.png" alt="strength" width="20%"/>
<img src="assets/rest_password_link.png" alt="reset" width="20%"/>

#### Welcome Screenshot:
<img src="assets/welcome_page.png" alt="welcome" width="20%"/>

#### Guest Screenshot:
<img src="assets/guest_screen.png" alt="welcome" width="20%"/>


---

## 3. Team Contributions  
### 👩‍💻 Yuan Tian  
**Role**: Nutrition Feature Lead  
- Designed and optimized the nutrition database structure and queries for Firestore.  
- Developed UI screens: `AllNutrition.tsx`, `AddMeal.tsx`, `EditMeal.tsx`, and `MealDetail.tsx`.  
- Implemented automatic nutrition analysis using an external API.  
- Integrated image upload functionality for meals via Firebase Storage.
- Developed the `NutritionHistory.tsx` screen to visualize calories and nutrient breakdown history using line charts.
- Added calorie goal setting with notification reminders via Expo Notifications.
- Built the `notification` collection schema and listeners to avoid duplicate popups.  
- Designed and implemented a user-friendly guestScreen.tsx for unlogged users to explore features and preview popular recipes.  

---

### 👩‍🍳 Yue Wang  
**Role**: Recipe Feature Lead & System Integration 
- Designed and structured the **recipe database** in Firestore to efficiently manage user-created recipes, ensuring seamless CRUD operations.  
- Developed screen layouts and UI components for the recipe sections, including `index.tsx`(all recipe screen), `[id].tsx`(recipe detail screen), `Add.tsx`(add recipe screen), and `Edit.tsx`(edit recipe screen).  
- Implemented **favorite functionality**, allowing users to mark and unmark recipes as favorite, storing this preference in Firestore for persistence, and allowing display filters to conditionally render recipe cards in the screen.
- Applied theme changing functionality throughout the entire application. 
- Ensured data consistency by aligning the recipe structure with the meal storage model, keeping Firestore operations efficient and unified. 
- Created **profile** portal in settings screen, allowing users to click area and navigate to profile screen, in `app/(protected)/(others)/profile.tsx`; allowing sign out functionality in settings page, `app/(protected)/(others)/index.tsx`; allowing users to take or upload a photo as their profile avatar and make their own nickname on profile, making sure the data consistency with firesbase database; 
- Partially implemented **authentication** login/register/forgot password screens and functionalities in `app/(auth)`, user can now have their real time individual data that can be stored on firebase and retrirvable relating to their account, also they will be asked to input strong password through `utils/validatePassword` to make sure strong password, they will also receive password reset link from their email to reset. 
- Achieved two **external AI apis** to work as a pipeline for generated texts, using google cloud vision api to recognized from photo,`utils/googleVision`, then combine preference input to be a comprehensive prompt to OPENAI api, model: gpt-4o-mini to generate recipes,`utils/generateRecipeWithAI`. The comprehensive logic is in `app/(protected)/(recipes)/AddRecipeWizard/Step3EditConfirm`. 
- Applied a partial done **Welcome** page for users that are not registered or not logged in to browse limited contents.   !!!Note the APIs I was using are all paid usage, if you just want to see the workflow, please degrade my model selection from gpt4o to something free.
- Achieved **Location** page for users to search their desired groceries. Used "Google Places API", to match exact items user search and reflect on the google map embedded in the screen. Allow range filter and information browsing functionality.
- Created "Emoji Generator" to dynamically update the recipe photo if user does not upload any photo. It will make prompt to AI API so the emoji can be determined by AI base on the Recipe Name. 
- Applied uniform UI/UX improvement, updated layout for the entire pages of recipe and others part, now the entire app's UI is outstanding. 




---

## 5. Firebase Rules
```js
rules_version = '2';

service cloud.firestore {

  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Meals subcollection
      match /meals/{mealId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      // Recipes subcollection
      match /recipes/{recipeId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      // Notification subcollection
      match /notification/{notifId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}