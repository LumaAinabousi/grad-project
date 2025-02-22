import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const calculateBurnedCalGoal = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");

    if (!token) {
      Alert.alert("Error", "User is not authenticated.");
      return 0;
    }

    const API_URL_PROFILE = "http://yourpublicIP:8000/patient/profile/";
    const response_profile = await axios.get(API_URL_PROFILE, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log(response_profile.data);

    if (
      !response_profile.data ||
      !response_profile.data.gender ||
      !response_profile.data.birthdate
    ) {
      Alert.alert("Error", "Missing profile information.");
      return 0;
    }

    const API_URL = "http://yourpublicIP:8000/medical-info/";
    const response = await axios.get(API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const latestRecord = response.data.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )[0];

    // console.log(latestRecord);

    const birthDate = new Date(response_profile.data.birthdate);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    // console.log("Gender:", response_profile.data.gender);
    // console.log("Weight:", latestRecord.weight);
    // console.log("Height:", latestRecord.height);
    // console.log("Age:", age);

    const weight = latestRecord.weight;
    const height = latestRecord.height / 100;

    let goal = 0;
    if (response_profile.data.gender === "female") {
      goal = 7.38 * weight + 607 * height - 2.31 * age + 43;
    } else if (response_profile.data.gender === "male") {
      goal = 9.65 * weight + 573 * height - 5.08 * age + 260;
    }
    goal = Math.ceil(goal);

    return goal;
  } catch (error) {
    // console.error("Error in calculateCalIntake:", error.message);
    return 0;
  }
};

export default calculateBurnedCalGoal;
