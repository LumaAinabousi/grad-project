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
import { useFocusEffect } from "@react-navigation/native";
import { searchActivities, calculateCalories } from "./ActivityInfo";
import styles from "../../../styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { mergeDateTime } from "../../../components/DateTimeObject";

const AddActivityScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    activity: "",
    duration: "",
    date: "",
    time: "",
    burnedCalories: "",
    bloodSugar: "",
    testType: "",
  });
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [activitySuggestions, setActivitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setForm({
        activity: "",
        duration: "",
        date: "",
        time: "",
        burnedCalories: "",
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
    // console.log(sevenDaysAgo);
    return selectedDate >= sevenDaysAgo && selectedDate <= today;
  };

  const validate = () => {
    const newErrors = {};
    let valid = true;
    const floatRegex = /^[+]?\d{2,3}(\.\d+)?$/;

    if (!form.activity) {
      newErrors.activity = "Activity is required.";
      valid = false;
    }

    if (!form.duration) {
      newErrors.duration = "Duration is required.";
      valid = false;
    } else if (isNaN(form.duration)) {
      newErrors.duration = "Enter a valid number for duration.";
      valid = false;
    }

    if (!form.date) {
      newErrors.date = "Date is required.";
      valid = false;
    }
    // else {
    //   const selectedDate = new Date(form.date);
    //   // console.log(selectedDate);
    //   if (!isValidDate(selectedDate)) {
    //     newErrors.date = "Date cannot be earlier than 7 days or in the future.";
    //     valid = false;
    //   }
    // }

    if (!form.time) {
      newErrors.time = "Time is required.";
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
      const suggestions = await searchActivities(text);
      setActivitySuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleDurationChange = async (text) => {
    setForm((prevForm) => ({ ...prevForm, duration: text }));
  };

  const handleSubmit = async () => {
    if (validate()) {
      const calories = await calculateCalories(form.activity, form.duration);
      form.burnedCalories = calories;

      setForm((prevForm) => ({ ...prevForm, burnedCalories: calories }));
      if (!form.bloodSugar) {
        form.testType = "";
      }

      const formData = {
        activity: form.activity,
        duration: form.duration,
        date: form.date,
        time: form.time,
        burnedCalories: form.burnedCalories,
        bloodSugar: form.bloodSugar,
        testType: form.testType,
      };

      console.log(formData);

      const formattedTime = mergeDateTime(form.date, form.time);
      console.log(formattedTime);

      try {
        // post bg_reading + post activity-log
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

          const API_URL_ACTIVITY = "http://yourpublicIP:8000/exercise-log/";
          const response_activity = await axios.post(
            API_URL_ACTIVITY,
            {
              exercise_type: formData.activity,
              duration: formData.duration,
              calories_burned: formData.burnedCalories,
              log_time: formattedTime,
              bg_reading: response_bg_id,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response_activity.data);
        } else {
          const API_URL_ACTIVITY = "http://yourpublicIP:8000/exercise-log/";
          const response_activity = await axios.post(
            API_URL_ACTIVITY,
            {
              exercise_type: formData.activity,
              duration: formData.duration,
              calories_burned: formData.burnedCalories,
              log_time: formattedTime,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response_activity.data);
        }

        setForm({
          activity: "",
          duration: "",
          date: "",
          time: "",
          burnedCalories: "",
          bloodSugar: "",
          testType: "",
        });
        navigation.navigate("Home");
      } catch (error) {
        console.error(error.response_activity.data);
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

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
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

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View contentContainerStyle={{ flexGrow: 1 }}>
          <Text style={[styles.label, { marginBottom: 5 }]}>Activity</Text>

          <TextInput
            placeholder="Search for an activity"
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
              data={activitySuggestions}
              keyExtractor={(item, index) => item.id || index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.mealItem}
                  onPress={() => {
                    setForm({
                      ...form,
                      activity: item.name,
                      burnedCalories: item.calories,
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
                    No activities found. Try a different search term.
                  </Text>
                </View>
              }
            />
          )}

          {errors.activity && (
            <Text style={styles.error}>{errors.activity}</Text>
          )}

          <Text style={[styles.label, { marginBottom: 5 }]}>
            Duration (minutes)
          </Text>
          <TextInput
            placeholder="Duration"
            value={form.duration}
            onChangeText={handleDurationChange}
            // keyboardType="numeric"
            style={styles.input}
          />
          {errors.duration && (
            <Text style={styles.error}>{errors.duration}</Text>
          )}

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

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add this Record</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.whitebutton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={[styles.buttonText, styles.textUnderline]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddActivityScreen;
