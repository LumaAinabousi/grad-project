import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../../../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { mergeDateTime } from "../../../components/DateTimeObject";

const AddBloodSugarScreen = () => {
  const [form, setForm] = useState({
    bloodSugarReading: "",
    testType: "",
    date: "",
    time: "",
  });
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const navigation = useNavigation();
  const floatRegex = /^[+]?\d{2,3}(\.\d+)?$/;

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

  const isValidDate = (selectedDate) => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    console.log(sevenDaysAgo);
    return selectedDate >= sevenDaysAgo && selectedDate <= today;
  };

  const validate = () => {
    const newErrors = {};
    let valid = true;

    if (!form.bloodSugarReading) {
      newErrors.bloodSugarReading = "Blood Sugar Reading is required";
      valid = false;
    } else if (!floatRegex.test(form.bloodSugarReading)) {
      newErrors.bloodSugarReading = "Enter a valid blood sugar reading";
      valid = false;
    }

    if (!form.testType) {
      newErrors.testType = "Test Type is required";
      valid = false;
    }

    if (!form.date) {
      newErrors.date = "Date is required.";
      valid = false;
    }
    //  else {
    //   const selectedDate = new Date(form.date);
    //   // console.log(selectedDate);
    //   if (!isValidDate(selectedDate)) {
    //     newErrors.date = "Date cannot be earlier than 7 days or in the future.";
    //     valid = false;
    //   }
    // }

    if (!form.time) {
      newErrors.time = "Time is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (validate()) {
      const formattedTime = mergeDateTime(form.date, form.time);
      console.log(formattedTime);

      try {
        // post bg_reading
        const token = await AsyncStorage.getItem("accessToken");
        console.log("token used in add food log: " + token);

        if (!token) {
          Alert.alert("Error", "User is not authenticated.");
          return;
        }

        const API_URL_BG = "http://yourpublicIP:8000/bg-reading/";
        const response_bg = await axios.post(
          API_URL_BG,
          {
            test_type: form.testType,
            test_result: form.bloodSugarReading,
            test_time: formattedTime,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response_bg.data);

        setForm({
          bloodSugarReading: "",
          testType: "",
          date: "",
          time: "",
        });
        navigation.navigate("Home");
      } catch (error) {
        console.error(error.response_bg.data);
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

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Blood Sugar Level</Text>
      <TextInput
        style={styles.input}
        placeholder="Blood Sugar Level"
        value={form.bloodSugarReading}
        onChangeText={(value) => handleChange("bloodSugarReading", value)}
      />
      {errors.bloodSugarReading && (
        <Text style={styles.error}>{errors.bloodSugarReading}</Text>
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
      {errors.testType && <Text style={styles.error}>{errors.testType}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add this Record</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.whitebutton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={[styles.buttonText, styles.textUnderline]}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddBloodSugarScreen;
