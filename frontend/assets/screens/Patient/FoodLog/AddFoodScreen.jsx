import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import { searchMeals, calculateMealNutrition } from "./MealsInfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { mergeDateTime } from "../../../components/DateTimeObject";
import styles from "../../../styles";

const AddFoodScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    meal: "",
    grams: "",
    date: "",
    time: "",
    calories: "",
    protein: "",
    carbs: "",
    fiber: "",
    sugar: "",
    fats: "",
    mealType: "",
    bloodSugar: "",
    testType: "",
  });
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [mealSuggestions, setMealSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const floatRegex = /^[+]?\d{2,3}(\.\d+)?$/;

  useFocusEffect(
    React.useCallback(() => {
      setForm({
        meal: "",
        grams: "",
        date: "",
        time: "",
        calories: "",
        protein: "",
        carbs: "",
        fiber: "",
        sugar: "",
        fats: "",
        mealType: "",
        bloodSugar: "",
        testType: "",
      });
      setErrors({});
      setSearchText("");
      setShowSuggestions(false);
    }, [])
  );

  const isValidDate = (selectedDate) => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    return selectedDate >= sevenDaysAgo && selectedDate <= today;
  };

  const validate = () => {
    const newErrors = {};
    let valid = true;

    if (!form.meal) {
      newErrors.meal = "This field is required";
      valid = false;
    }

    if (!form.grams) {
      newErrors.grams = "This field is required";
      valid = false;
    } else if (isNaN(form.grams)) {
      newErrors.grams = "Enter a valid amount in grams";
      valid = false;
    }

    if (!form.date) {
      newErrors.date = "Date is required.";
      valid = false;
    } else {
      const selectedDate = new Date(form.date);
      // console.log(selectedDate);
      if (!isValidDate(selectedDate)) {
        newErrors.date = "Date cannot be earlier than 7 days or in the future.";
        valid = false;
      }
    }

    if (!form.time) {
      newErrors.time = "Time is required";
      valid = false;
    }

    if (!form.mealType) {
      newErrors.mealType = "Select a meal type";
      valid = false;
    }

    if (form.bloodSugar) {
      if (!floatRegex.test(form.bloodSugar)) {
        newErrors.bloodSugar = "Enter a valid blood sugar reading";
        valid = false;
      }
      if (!form.testType) {
        newErrors.testType = "Select a test type";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSearch = async (text) => {
    setSearchText(text);

    if (text.length > 2) {
      console.log("Searching meals for:", text);
      const suggestions = await searchMeals(text);
      console.log("Meal suggestions fetched:", suggestions);
      setMealSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleGramsChange = async (text) => {
    setForm((prevForm) => ({ ...prevForm, grams: text }));
  };

  const handleSubmit = async () => {
    if (validate()) {
      const nutrition = await calculateMealNutrition(form.meal, form.grams);
      console.log(nutrition);
      console.log(nutrition.calories);

      if (!form.bloodSugar) {
        form.testType = "";
      }

      const formData = {
        meal: form.meal,
        grams: form.grams,
        date: form.date,
        time: form.time,
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fiber: nutrition.fiber,
        sugar: nutrition.sugar,
        fats: nutrition.fats,
        mealType: form.mealType,
        bloodSugar: form.bloodSugar,
        testType: form.testType,
      };

      // console.log(formData);
      // console.log(typeof form.date);
      // console.log(typeof form.time);

      const formattedTime = mergeDateTime(form.date, form.time);
      console.log(formattedTime);

      try {
        // post bg_reading + post food-log
        const token = await AsyncStorage.getItem("accessToken");
        console.log("token used in add food log: " + token);

        if (!token) {
          Alert.alert("Error", "User is not authenticated.");
          return;
        }

        if (form.bloodSugar) {
          const API_URL_BG = "http://yourpublicIP:8000/bg-reading/";
          const response_bg = await axios.post(
            API_URL_BG,
            {
              test_type: formData.testType,
              test_result: formData.bloodSugar,
              test_time: formattedTime,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // console.log(response_bg.data);
          const response_bg_id = response_bg.data.id;
          //console.log(response_bg_id);
          const API_URL_FOOD = "http://yourpublicIP:8000/food-log/";
          const response_food = await axios.post(
            API_URL_FOOD,
            {
              food_name: formData.meal,
              serving_size: formData.grams,
              log_time: formattedTime,
              calories: formData.calories,
              protein: formData.protein,
              carbs: formData.carbs,
              fiber: formData.fiber,
              sugar: formData.sugar,
              fat: formData.fats,
              meal_type: formData.mealType,
              bg_reading: response_bg_id,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response_food.data);
        } else {
          const API_URL_FOOD = "http://yourpublicIP:8000/food-log/";
          const response_food = await axios.post(
            API_URL_FOOD,
            {
              food_name: formData.meal,
              serving_size: formData.grams,
              log_time: formattedTime,
              calories: formData.calories,
              protein: formData.protein,
              carbs: formData.carbs,
              fiber: formData.fiber,
              sugar: formData.sugar,
              fat: formData.fats,
              meal_type: formData.mealType,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response_food.data);
        }

        setForm({
          meal: "",
          grams: "",
          date: "",
          time: "",
          calories: "",
          protein: "",
          carbs: "",
          fiber: "",
          sugar: "",
          fats: "",
          mealType: "",
          bloodSugar: "",
          testType: "",
        });
        navigation.navigate("Home");
      } catch (error) {
        console.error(error.response_food.data);
        if (error.response?.status === 401) {
          Alert.alert("Session Expired", "Please log in again.");
          navigation.navigate("SignIn");
        } else {
          Alert.alert(
            "Error",
            error.response?.data?.message || "An error occurred"
          );
        }
      }
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setForm({ ...form, date: formattedDate });
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setForm({
        ...form,
        time: selectedTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View contentContainerStyle={{ flexGrow: 1 }}>
          {/* Meal Search */}
          <Text style={[styles.label, { marginBottom: 5 }]}>Meal</Text>
          <TextInput
            placeholder="Search for your meal"
            style={styles.input}
            value={searchText}
            onChangeText={handleSearch}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              if (!searchText) setShowSuggestions(false);
            }}
          />
          {showSuggestions && (
            <FlatList
              style={[styles.progressContainer, { maxHeight: 150 }]}
              data={mealSuggestions}
              keyExtractor={(item, index) => item.id || index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.mealItem}
                  onPress={() => {
                    setForm({
                      ...form,
                      meal: item.name,
                      calories: item.calories,
                    });
                    setSearchText(item.name);
                    setShowSuggestions(false);
                  }}
                >
                  <Text style={styles.mealText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={{ padding: 10, alignItems: "center" }}>
                  <Text style={{ fontStyle: "italic", color: "#999" }}>
                    No meals found. Try a different search term.
                  </Text>
                </View>
              }
            />
          )}
          {errors.meal && <Text style={styles.error}>{errors.meal}</Text>}

          {/* Meal Type */}
          <Text style={styles.label}>Meal Type</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[
                styles.radio,
                form.mealType === "breakfast" && styles.radioSelected,
              ]}
              onPress={() => handleChange("mealType", "breakfast")}
            >
              <Text>Breakfast</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radio,
                form.mealType === "lunch" && styles.radioSelected,
              ]}
              onPress={() => handleChange("mealType", "lunch")}
            >
              <Text>Lunch</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radio,
                form.mealType === "dinner" && styles.radioSelected,
              ]}
              onPress={() => handleChange("mealType", "dinner")}
            >
              <Text>Dinner</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radio,
                form.mealType === "snack" && styles.radioSelected,
              ]}
              onPress={() => handleChange("mealType", "snack")}
            >
              <Text>Snack</Text>
            </TouchableOpacity>
          </View>
          {errors.mealType && (
            <Text style={styles.error}>{errors.mealType}</Text>
          )}

          {/* Grams */}
          <Text style={styles.label}>Grams (g)</Text>
          <TextInput
            placeholder="Enter grams"
            style={styles.input}
            value={form.grams}
            // keyboardType="numeric"
            onChangeText={handleGramsChange}
          />
          {errors.grams && <Text style={styles.error}>{errors.grams}</Text>}

          {/* Date */}
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Date"
              value={form.date}
              editable={false}
            />
            <Image
              source={require("../../../images/calendar.png")}
              style={styles.dateIcon}
            />
          </TouchableOpacity>
          {errors.date && <Text style={styles.error}>{errors.date}</Text>}
          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <Text style={styles.label}>Time</Text>
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={styles.input}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Time"
              value={form.time}
              editable={false}
            />
            <Image
              source={require("../../../images/clock.png")}
              style={styles.dateIcon}
            />
          </TouchableOpacity>
          {errors.time && <Text style={styles.error}>{errors.time}</Text>}
          {showTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}

          <Text style={styles.label}>Blood Sugar Level</Text>
          <TextInput
            placeholder="Blood Sugar Level (optional)"
            style={styles.input}
            value={form.bloodSugar}
            onChangeText={(value) => setForm({ ...form, bloodSugar: value })}
          />
          {errors.bloodSugar && (
            <Text style={styles.error}>{errors.bloodSugar}</Text>
          )}

          <Text style={styles.label}>Test Type</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[
                styles.radio,
                form.testType === "fasting" && styles.radioSelected,
              ]}
              onPress={() => handleChange("testType", "fasting")}
            >
              <Text>Fasting</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radio,
                form.testType === "random" && styles.radioSelected,
              ]}
              onPress={() => handleChange("testType", "random")}
            >
              <Text>Random</Text>
            </TouchableOpacity>
          </View>
          {errors.testType && (
            <Text style={styles.error}>{errors.testType}</Text>
          )}

          {/* Submit Button */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add Food</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddFoodScreen;
