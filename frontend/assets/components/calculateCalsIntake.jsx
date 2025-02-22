import { Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const calculateCalIntake = async () => {
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

    if (!latestRecord || !latestRecord.weight || !latestRecord.height) {
      Alert.alert("Error", "Insufficient data to calculate BMR.");
      return 0;
    }

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

    let BMR = 0;

    if (response_profile.data.gender === "female") {
      BMR = 655 + 9.6 * weight + 1.8 * height - 4.7 * age;
    } else if (response_profile.data.gender === "male") {
      BMR = 66 + 13.7 * weight + 5 * height - 6.8 * age;
    } else {
      Alert.alert("Error", "Invalid gender data.");
      return 0;
    }

    BMR = Math.ceil(BMR);

    // console.log("Rounded BMR:", BMR);
    return BMR;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      Alert.alert("Error", "Request timed out. Please try again.");
    } else {
      // console.error("Error in calculateCalIntake:", error.message);
      Alert.alert(
        "Error",
        "An error occurred while fetching data. Please try again."
      );
    }
    return 0;
  }
};

export default calculateCalIntake;
