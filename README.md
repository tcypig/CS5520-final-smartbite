# 🍽️ SmartBite - Iteration Summary

## 1. Data Model & Collections  
We have structured our Firestore database to ensure **efficient data retrieval, scalability, and user-specific data security**.

### **Top-Level Collection:**  
- **`users`** → Each user has their own data.

### **Sub-Collections (under `users/{userId}`):**  
- **`meals`** → Stores meal logs for each user (`{mealId}` document). When a meal is added, its nutrition is automatically analyzed 
and stored within the meal document. Each document ({mealId}) represents a meal, allowing users to add, edit, and delete meals as needed.
  - ✅ **Create** meals using `writeMealToDB()`.  
  - ✅ **Read** meals and their nutrition using `fetchMeals()`.  
  - ✅ **Update** meals using `updateMealToDB()`.  
  - ✅ **Delete** meals using `deleteMealFromDB()`.  
- **`recipes`** → Stores saved recipes for each user (`{recipeId}` document).  
Users can create, edit, delete, and mark recipes as favorite. Each document (`{recipeId}`) represents an individual recipe, containing ingredients, instructions, and timestamps.
  - ✅ **Create** recipes using addRecipe().
  - ✅ **Read** recipes using getAllRecipes() or getRecipeById().
  - ✅ **Update** recipes using updateRecipe().
  - ✅ **Delete** recipes using deleteRecipe().

 

📌 **Database structure may change as needed** based on further requirements and optimizations.

---



## 2. Current Application State with Screenshots  

### 🥗 Nutrition Features  

We've implemented the core nutrition tracking functionalities, including:  

1. **Displaying all meals and their nutrition** for a selected date.  
2. **Adding new meals**, with automatic nutrition analysis.  
3. **Viewing detailed nutrition breakdown** for each meal.  
4. **Editing or deleting meals** as needed.  


#### Nutrition Screenshot:  
<img src="assets/nutritionPhoto/allNutritions.png" alt="all Meals & Nutrition" width="20%"/>
<img src="assets/nutritionPhoto/addMeal.png" alt="Add Meals" width="20%"/>
<img src="assets/nutritionPhoto/mealDetail.png" alt="Meals Detail" width="20%"/>
<img src="assets/nutritionPhoto/editMeal.png" alt="Edit Meals" width="20%"/>

#### Recipe Screenshot:  
<img src="assets/nutritionPhoto/allRecipes.png" alt="all Meals & Nutrition" width="20%"/>
<img src="assets/nutritionPhoto/addRecipe.png" alt="Add Recipes" width="20%"/>
<img src="assets/nutritionPhoto/recipeDetail.png" alt="Recipes Detail" width="20%"/>
<img src="assets/nutritionPhoto/editRecipe.png" alt="Edit Recipe" width="20%"/>

---

## 3. Team Contributions  
| **Team Member** | **Contributions** |
|----------------|------------------|
| **Yuan Tian** |  **Responsible for the nutrition part.** 1) Designed and optimized the nutrition database structure and queries to efficiently store, retrieve, and update meal nutrition data in Firestore.  2) Developed screen layouts and UI components for nutrition parts, including `AllNutrition.tsx`, `AddMeal.tsx`, `EditMeal.tsx`, and `MealDetail.tsx`.  3) Implemented automatic nutrition analysis using an external API when adding meals, ensuring seamless integration with Firestore. |
| **[Member 2]** | 1) Designed and structured the **recipe database** in Firestore to efficiently manage user-created recipes, ensuring seamless CRUD operations.  
2) Developed screen layouts and UI components for the recipe sections, including `index.tsx`(all recipe screen), `[id].tsx`(recipe detail screen), `Add.tsx`(add recipe screen), and `Edit.tsx`(edit recipe screen).  
3) Implemented **favorite functionality**, allowing users to mark and unmark recipes as favorite, storing this preference in Firestore for persistence, and allowing display filters to conditionally render recipe cards in the screen.
4) Applied theme changing functionality throughout the entire application.
4) Ensured data consistency by aligning the recipe structure with the meal storage model, keeping Firestore operations efficient and unified. 



---

## 4. Next Steps  
- Integrate **camera functionality** for recipe and meal photo uploads.
- Implement **notifications** to allow users to schedule reminders. 
- Add **user authentication** to enable secure login and personalized data storage.
- Improve **UI & Styling** for a better user experience.


