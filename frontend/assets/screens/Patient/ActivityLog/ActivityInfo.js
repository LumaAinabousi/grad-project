const API_KEY = "";
const BASE_URL = "https://api.api-ninjas.com/v1/caloriesburned";

let activityData = [];

export const searchActivities = async (activityName, duration) => {
  try {
    const response = await fetch(
      `${BASE_URL}?activity=${encodeURIComponent(activityName)}`,
      {
        headers: {
          "X-Api-Key": API_KEY,
        },
      }
    );
    const data = await response.json();
    console.log("Fetched activities data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};

export const getAvailableActivities = async () => {
  try {
    const activityNames = [];
    const availableActivities = [];

    for (const activity of activityNames) {
      const activities = await searchActivities(activity, 1);
      if (activities.length > 0) {
        availableActivities.push({
          id: availableActivities.length + 1,
          name: activity,
          caloriesPerMinute: activities[0].calories_per_hour / 60,
        });
      }
    }

    return availableActivities;
  } catch (error) {
    console.error("Error fetching available activities:", error);
    return [];
  }
};

export const calculateCalories = async (activityName, duration) => {
  try {
    const activities = await searchActivities(activityName, duration);

    if (activities.length > 0) {
      const apiActivity = activities[0];
      const caloriesBurned = (apiActivity.calories_per_hour / 60) * duration;
      return Math.round(caloriesBurned);
    }
    return 0;
  } catch (error) {
    console.error("Error calculating calories:", error);
    return 0;
  }
};

export const addActivityData = (
  activity,
  duration,
  date,
  time,
  calories,
  bloodSugar,
  testType
) => {
  activityData.push({
    id: activityData.length + 1,
    activity,
    duration,
    date,
    time,
    calories,
    bloodSugar,
    testType,
  });
};

export const getActivityData = () => {
  return activityData;
};
