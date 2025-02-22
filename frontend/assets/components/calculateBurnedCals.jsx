import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

let totalBurnedCalories = 0;
const calculateBurnedCalories = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");

    if (!token) {
      Alert.alert("Error", "User is not authenticated.");
      return 0;
    }

    const API_URL_ACTIVITY = "http://yourpublicIP:8000/exercise-log/";

    const response = await axios.get(API_URL_ACTIVITY, {
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

      const todaysActivities = response.data.filter((activity) => {
        const activityDate = activity.log_time.split(" ")[0];
        return activityDate === today;
      });

      let totalCalories = 0;

      if (todaysActivities.length > 0) {
        totalCalories = todaysActivities.reduce(
          (acc, activity) => acc + activity.calories_burned,
          0
        );
        totalBurnedCalories = totalCalories;
      } else {
        totalBurnedCalories = 0;
      }

      // console.log("Total Calories Burned from activities:", totalCalories);

      return totalBurnedCalories;
    } else {
      // console.error("Failed to fetch valid activity data:", response.data);
      return 0;
    }
  } catch (error) {
    // console.error("Error in calculateBurnedCalories:", error.message);
    return 0;
  }
};

export default calculateBurnedCalories;
