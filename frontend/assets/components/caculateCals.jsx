import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

let calsProgress = 0;
const calculateCals = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");

    if (!token) {
      Alert.alert("Error", "User is not authenticated.");
      return 0;
    }

    const API_URL_FOOD = "http://yourpublicIP:8000/food-log/";

    const response = await axios.get(API_URL_FOOD, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("API Response:", response);

    if (
      response.status === 200 &&
      response.data &&
      Array.isArray(response.data)
    ) {
      const today = new Date().toISOString().split("T")[0];

      const todaysMeals = response.data.filter((meal) => {
        const mealDate = meal.log_time.split(" ")[0];
        return mealDate === today;
      });

      let totalCalories = 0;

      if (todaysMeals.length > 0) {
        totalCalories = todaysMeals.reduce(
          (acc, meal) => acc + meal.calories,
          0
        );
        calsProgress = totalCalories;
      } else {
        calsProgress = 0;
      }

      // console.log("Total Calories from meals:", totalCalories);

      return calsProgress;
    } else {
      // console.error("Failed to fetch valid meal data:", response.data);
      return 0;
    }
  } catch (error) {
    // console.error("Error in calculateCals:", error.message);
    return 0;
  }
};

export default calculateCals;
