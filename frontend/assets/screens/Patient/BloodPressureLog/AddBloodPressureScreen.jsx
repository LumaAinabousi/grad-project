import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addData } from "./BloodPressureRecords";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { mergeDateTime } from "../../../components/DateTimeObject";
import styles from "../../../styles";

const AddBloodPressureScreen = () => {
  const [form, setForm] = useState({
    systolic: "",
    diastolic: "",
    testType: "",
    date: "",
    time: "",
  });
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const navigation = useNavigation();
  const floatRegex = /^[+]?\d{1,3}$/;

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

  const validate = () => {
    const errors = {};
    let valid = true;

    if (!form.systolic) {
      errors.systolic = "Systolic pressure is required";
      valid = false;
    } else if (
      !floatRegex.test(form.systolic) ||
      form.systolic < 10 ||
      form.systolic > 200
    ) {
      errors.systolic = "Enter a valid systolic pressure";
      valid = false;
    }

    if (!form.diastolic) {
      errors.diastolic = "Diastolic pressure is required";
      valid = false;
    } else if (
      !floatRegex.test(form.diastolic) ||
      form.diastolic < 40 ||
      form.diastolic > 350
    ) {
      errors.diastolic = "Enter a valid diastolic pressure";
      valid = false;
    }

    if (!form.date) {
      errors.date = "Date is required";
      valid = false;
    }

    if (!form.time) {
      errors.time = "Time is required";
      valid = false;
    }

    if (!form.testType) {
      errors.testType = "Test Type is required";
      valid = false;
    }

    // if (form.systolic.toString() > form.diastolic.toString()) {
    //   alert("Please check the values you entered.");
    //   valid = false;
    // }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async () => {
    if (validate()) {
      const formattedTime = mergeDateTime(form.date, form.time);
      console.log(formattedTime);

      try {
        // post bp-log
        const token = await AsyncStorage.getItem("accessToken");
        console.log("token used in add blood pressure log: " + token);

        if (!token) {
          Alert.alert("Error", "User is not authenticated.");
          return;
        }

        const API_URL_BP = "http://yourpublicIP:8000/bp-log/";
        const response_bp = await axios.post(
          API_URL_BP,
          {
            s_pressure: form.systolic,
            d_pressure: form.diastolic,
            bp_test_type: form.testType,
            log_time: formattedTime,
            // bg_reading: response_bg_id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response_bp.data);
        setForm({
          systolic: "",
          diastolic: "",
          testType: "",
          date: "",
          time: "",
        });
        navigation.navigate("Home");
      } catch (error) {
        console.error(error.response_bp.data);
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
      <Text style={styles.label}>Systolic Pressure</Text>
      <TextInput
        style={styles.input}
        placeholder="Systolic Pressure"
        value={form.systolic}
        onChangeText={(value) => handleChange("systolic", value)}
        // keyboardType="numeric"
      />
      {errors.systolic && <Text style={styles.error}>{errors.systolic}</Text>}

      <Text style={styles.label}>Diastolic Pressure</Text>
      <TextInput
        style={styles.input}
        placeholder="Diastolic Pressure"
        value={form.diastolic}
        onChangeText={(value) => handleChange("diastolic", value)}
        // keyboardType="numeric"
      />
      {errors.diastolic && <Text style={styles.error}>{errors.diastolic}</Text>}

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
            form.testType === "Resting" && styles.radioSelected,
          ]}
          onPress={() => handleChange("testType", "Resting")}
        >
          <Text>Resting</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.radio,
            form.testType === "Active" && styles.radioSelected,
          ]}
          onPress={() => handleChange("testType", "Active")}
        >
          <Text>Active</Text>
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

export default AddBloodPressureScreen;
