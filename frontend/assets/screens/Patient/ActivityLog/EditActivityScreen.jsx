import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  searchActivities,
  calculateCalories,
  getActivityData,
} from "./ActivityInfo";
import styles from "../../../styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { mergeDateTime } from "../../../components/DateTimeObject";
import { splitDateTime } from "../../../components/SplitDateTime";

const EditActivityScreen = ({ navigation, route }) => {
  const activityData = route.params.item;

  // console.log(activityData.log_time);
  const { date, time } = splitDateTime(activityData.log_time);
  // console.log(date);
  // console.log(time);

  const [form, setForm] = useState({
    activity: "",
    duration: "",
    date: "",
    time: "",
    burnedCalories: "",
  });

  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState(
    activityData.exercise_type || ""
  );
  const [activitySuggestions, setActivitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setForm({
        activity: activityData.exercise_type,
        duration: activityData.duration.toString(),
        date: date,
        time: time,
        burnedCalories: activityData.calories_burned,
      });
    };

    fetchData();
  }, [activityData]);

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
      setLoading(true);
      const calories = await calculateCalories(form.activity, form.duration);
      form.burnedCalories = calories;
      setForm((prevForm) => ({ ...prevForm, burnedCalories: calories }));

      const formData = {
        activity: form.activity,
        duration: form.duration,
        date: form.date,
        time: form.time,
        burnedCalories: form.burnedCalories,
      };
      console.log(formData);
      const formattedTime = mergeDateTime(form.date, form.time);
      console.log(formattedTime);
      try {
        // put bg_reading + put activity-log
        const token = await AsyncStorage.getItem("accessToken");
        console.log("token used in add food log: " + token);
        if (!token) {
          Alert.alert("Error", "User is not authenticated.");
          return;
        }
        console.log(formattedTime);
        const API_URL_ACTIVITY = `http://yourpublicIP:8000/exercise-log/${activityData.id}/`;
        const response_activity = await axios.put(
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

        Alert.alert("Success", "Activity updated successfully.");
        navigation.navigate("Home");
      } catch (error) {
        console.error(error);
        const errorMessage =
          error?.response?.data?.error || "An error occurred";
        if (error?.response?.status === 401) {
          Alert.alert("Session Expired", "Please log in again.");
          navigation.navigate("SignIn");
        } else {
          Alert.alert("Error", errorMessage);
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

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Update this Record</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.whitebutton}
            onPress={() => navigation.goBack()}
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

export default EditActivityScreen;
