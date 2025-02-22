import React, { useEffect, useState, useCallback } from "react";
import { View, ScrollView, Text } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import LogEntry from "../../components/LogEntry";
import ProgressTracker from "../../components/ProgressTracker";
import styles from "../../styles";
import calculateCals from "../../components/caculateCals";
import calculateCalIntake from "../../components/calculateCalsIntake";
import calculateBurnedCalGoal from "../../components/calculateBurnedCalsGoal";
import calculateBurnedCalories from "../../components/calculateBurnedCals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [calsProgress, setCalsProgress] = useState(0);
  const [calsProgress1, setCalsProgress1] = useState(0);
  const [bmr, setBmr] = useState(0);
  const [burned, setburned] = useState(0);
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchBmr = async () => {
      try {
        const bmrValue = await calculateCalIntake();
        setBmr(bmrValue);
      } catch (error) {
        console.error("Error fetching BMR:", error.message);
      }
    };

    const fetchBurned = async () => {
      try {
        const burnedValue = await calculateBurnedCalGoal();
        setburned(burnedValue);
      } catch (error) {
        console.error("Error fetching Burned calories:", error.message);
      }
    };

    fetchBmr();
    fetchBurned();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const name = async () => {
        const token = await AsyncStorage.getItem("accessToken");
        console.log("Token used in fetch: " + token);

        if (!token) {
          Alert.alert("Error", "User is not authenticated.");
          return;
        }
        const API_URL = "http://yourpublicIP:8000/patient/profile/";
        const response = await axios.get(API_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log("name", response.data);
        const user_name =
          response.data.first_name + " " + response.data.last_name;
        // console.log("name2", response.data.first_name);
        setName(user_name);
      };
      const fetchCalories = async () => {
        try {
          const totalCalories = await calculateCals();
          setCalsProgress(totalCalories);
        } catch (error) {
          console.error("Error fetching calories:", error.message);
        }
      };
      const fetchBurnedCalories = async () => {
        try {
          const totalburnedCalories = await calculateBurnedCalories();
          setCalsProgress1(totalburnedCalories);
        } catch (error) {
          console.error("Error fetching burned calories:", error.message);
        }
      };

      fetchCalories();
      fetchBurnedCalories();
      name();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.greeting}>Hello {name} :)</Text>
        <Text style={styles.subText}>
          Log your information for better insights!
        </Text>
      </View>

      <View style={styles.progressSection}>
        <ProgressTracker
          label="Calories Intake"
          value={calsProgress}
          maxValue={bmr}
        />
        <ProgressTracker
          label="Calories Burned"
          value={calsProgress1}
          maxValue={burned}
        />
      </View>

      <View style={styles.logSection}>
        <LogEntry
          title="Blood Sugar Logging"
          description="Keep tracked of your blood sugar."
          icon={require("../../images/BloodSugar.jpg")}
          AddOnPress={() => {
            navigation.navigate("AddBloodSugar");
          }}
          ViewOnPress={() => {
            navigation.navigate("ViewBloodSugar");
          }}
        />
        <LogEntry
          title="Blood Pressure Logging"
          description="Keep tracked of your blood pressure."
          icon={require("../../images/BloodPressure.png")}
          AddOnPress={() => {
            navigation.navigate("AddBloodPressure");
          }}
          ViewOnPress={() => {
            navigation.navigate("ViewBloodPressure");
          }}
        />
        <LogEntry
          title="Food Logging"
          description="Log your meals and keep tracking it."
          icon={require("../../images/Meals.png")}
          AddOnPress={() => {
            navigation.navigate("AddFood");
          }}
          ViewOnPress={() => {
            navigation.navigate("ViewFood");
          }}
        />
        <LogEntry
          title="Activity Logging"
          description="Save your activities."
          icon={require("../../images/Activity.png")}
          AddOnPress={() => {
            navigation.navigate("AddActivity");
          }}
          ViewOnPress={() => {
            navigation.navigate("ViewActivity");
          }}
        />
        <LogEntry
          title="Medication Logging"
          description="Save your insulin doses and medication."
          icon={require("../../images/Medication.png")}
          AddOnPress={() => {
            navigation.navigate("AddMedication");
          }}
          ViewOnPress={() => {
            navigation.navigate("ViewMedication");
          }}
        />
      </View>
    </ScrollView>
  );
}
