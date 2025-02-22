import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getActivityData } from "./ActivityInfo";
import styles from "../../../styles";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function ViewActivityScreen({ navigation }) {
  const [activityRecords, setActivityRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivityData() {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        console.log("Token used in fetch: " + token);

        if (!token) {
          Alert.alert("Error", "User is not authenticated.");
          return;
        }

        let formData = [
          {
            test_type: "N/A",
            test_result: "N/A",
            exercise_type: "",
            duration: "",
            calories_burned: "",
            log_time: "",
            bg_reading: "",
            id: "",
          },
        ];
        const API_URL_ACTIVITY = "http://yourpublicIP:8000/exercise-log/";
        const response = await axios.get(API_URL_ACTIVITY, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", response.data);

        const activityData = response.data;

        for (let i = 0; i < activityData.length; i++) {
          const activity = activityData[i];
          formData[i] = {
            test_type: "N/A",
            test_result: "N/A",
            exercise_type: activity.exercise_type,
            duration: activity.duration,
            calories_burned: activity.calories_burned,
            log_time: activity.log_time,
            bg_reading: activity.bg_reading,
            id: activityData[i].id,
          };

          if (activity.bg_reading) {
            const bgReadingID = activity.bg_reading;
            console.log("Reading ID:", bgReadingID);
            const API_URL_BG_READING = `http://yourpublicIP:8000/bg-reading/${bgReadingID}/`;

            try {
              const bgResponse = await axios.get(API_URL_BG_READING, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });

              formData[i].test_result = bgResponse.data.test_result;
              formData[i].test_type = bgResponse.data.test_type;
            } catch (error) {
              console.error("Error fetching blood sugar data:", error);
            }
          }
        }

        formData.reverse();
        setActivityRecords(formData);
      } catch (error) {
        console.error("Error fetching exercise data:", error);
        Alert.alert("Error", "Failed to fetch exercise records.");
      } finally {
        setLoading(false);
      }
    }

    fetchActivityData();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AddActivity")}
      >
        <Text style={styles.buttonText}>Add New Activity</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#C2E0F5" />
      ) : activityRecords.length === 0 ? (
        <Text style={styles.emptyMessage}>No records found.</Text>
      ) : (
        <FlatList
          data={activityRecords}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.progressContainer}>
              <Text style={styles.date}>{item.exercise_type}</Text>
              <Text style={styles.detail}>Date, Time: {item.log_time}</Text>
              <Text style={styles.detail}>
                Duration: {item.duration} minutes
              </Text>
              <Text style={styles.detail}>
                Burned Calories: {item.calories_burned} kcal
              </Text>
              <Text style={styles.detail}>
                Blood Sugar: {item.test_result || "N/A"}
              </Text>
              <Text style={styles.detail}>
                Test Type: {item.test_type || "N/A"}
              </Text>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    paddingVertical: 0,
                    width: "15%",
                    borderRadius: 5,
                    borderWidth: 1,
                  },
                ]}
                onPress={() =>
                  navigation.navigate("EditActivity", { item: item })
                }
              >
                <Text
                  style={[
                    styles.buttonText,
                    // styles.textUnderline,
                    { fontSize: 12 },
                  ]}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
