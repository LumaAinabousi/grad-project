import axios from "axios";

const API_KEY = "";
const BASE_URL = "https://api.spoonacular.com/food";

export const searchMeals = async (mealName) => {
  try {
    const response = await fetch(
      `${BASE_URL}/ingredients/autocomplete?query=${encodeURIComponent(
        mealName
      )}&apiKey=${API_KEY}`
    );
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      return data.map((item) => ({
        id: item.id || Math.random().toString(),
        name: item.name || "Unknown",
      }));
    } else {
      console.warn("No valid suggestions found.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching meals:", error);
    return [];
  }
};
const BASE_URL2 = "https://api.api-ninjas.com/v1/nutrition";
const API_KEY2 = "";

export const calculateMealNutrition = async (mealName, grams) => {
  try {
    const response = await axios.get(
      `${BASE_URL2}?query=${encodeURIComponent(
        mealName
      )}&grams=${encodeURIComponent(grams)}`,
      {
        headers: { "X-Api-Key": API_KEY2 },
      }
    );
    const data = response.data;
    console.log(data);
    if (data.length === 0) {
      console.error("No data found for the provided meal.");
      return { calories: 0, protein: 0, carbs: 0, fiber: 0 };
    }

    const selectedMeal = data[0];
    const calories = selectedMeal.calories;
    const protein = selectedMeal.protein_g;
    const carbs = selectedMeal.carbohydrates_total_g;
    const fiber = selectedMeal.fiber_g;
    const sugar = selectedMeal.sugar_g;
    const fats = selectedMeal.fat_total_g;
    console.log(calories);

    return {
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fiber: Math.round(fiber),
      sugar: Math.round(sugar),
      fats: Math.round(fats),
    };
  } catch (error) {
    console.error("Error calculating meal nutrition:", error);
    return { calories: 0, protein: 0, carbs: 0, fiber: 0, sugar: 0, fats: 0 };
  }
};
