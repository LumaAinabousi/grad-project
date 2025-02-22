import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "../../../styles";

export default function ViewFoodScreen({ navigation }) {
  const [mealRecords, setMealRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMealData() {
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
            fat: "",
            protein: "",
            fiber: "",
            calories: "",
            carbs: "",
            log_time: "",
            sugar: "",
            serving_size: "",
            bg_reading: "",
            food_name: "",
            meal_type: "",
            id: "",
          },
        ];
        const API_URL_FOOD = "http:/yourpublicIP:8000/food-log/";
        const response = await axios.get(API_URL_FOOD, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", response.data);

        const mealData = response.data;

        for (let i = 0; i < mealData.length; i++) {
          const meal = mealData[i];
          formData[i] = {
            test_type: "N/A",
            test_result: "N/A",
            fat: mealData[i].fat,
            protein: mealData[i].protein,
            fiber: mealData[i].fiber,
            calories: mealData[i].calories,
            carbs: mealData[i].carbs,
            log_time: mealData[i].log_time,
            sugar: mealData[i].sugar,
            serving_size: mealData[i].serving_size,
            bg_reading: mealData[i].bg_reading,
            food_name: mealData[i].food_name,
            meal_type: mealData[i].meal_type,
            id: mealData[i].id,
          };

          if (meal.bg_reading) {
            const bgReadingID = meal.bg_reading;
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
        setMealRecords(formData);
      } catch (error) {
        console.error("Error fetching meal data:", error);
        Alert.alert("Error", "Failed to fetch meal records.");
      } finally {
        setLoading(false);
      }
    }

    fetchMealData();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AddFood")}
      >
        <Text style={styles.buttonText}>Add New Record</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#C2E0F5" />
      ) : mealRecords.length === 0 ? (
        <Text style={styles.emptyMessage}>No records found.</Text>
      ) : (
        <FlatList
          data={mealRecords}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.progressContainer}>
              <Text style={styles.date}>
                {item.food_name} - ({item.log_time})
              </Text>
              <Text style={styles.detail}>
                Grams: {item.serving_size || "N/A"} g
              </Text>
              <Text style={styles.detail}>
                Calories: {item.calories || "N/A"} kcal
              </Text>
              <Text style={styles.detail}>Fats: {item.fat || "N/A"} g</Text>
              <Text style={styles.detail}>
                Protein: {item.protein || "N/A"} g
              </Text>
              <Text style={styles.detail}>Carbs: {item.carbs || "N/A"} g</Text>
              <Text style={styles.detail}>Fiber: {item.fiber || "N/A"} g</Text>
              <Text style={styles.detail}>Sugar: {item.sugar || "N/A"} g</Text>
              <Text style={styles.detail}>
                Meal Type: {item.meal_type || "N/A"}
              </Text>

              <Text style={styles.detail}>
                Blood Sugar: {item.test_result ? item.test_result : "N/A"}
              </Text>
              <Text style={styles.detail}>
                Test Type: {item.test_type ? item.test_type : "N/A"}
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
                onPress={() => navigation.navigate("EditFood", { item: item })}
              >
                <Text style={[styles.buttonText, { fontSize: 12 }]}>Edit</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
