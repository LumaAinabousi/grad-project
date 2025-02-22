import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import styles from "../../../styles";
import { addData } from "./records";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { mergeDateTime } from "../../../components/DateTimeObject";

export default function AddMedicationRecordScreen({ navigation }) {
  const [form, setForm] = useState({
    medicine: "",
    dosage: "",
    date: "",
    time: "",
    bloodSugar: "",
    testType: "",
  });
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const dosageOptions = {
    Insulin: [
      { label: "10 units", value: "10 units" },
      { label: "20 units", value: "20 units" },
      { label: "30 units", value: "30 units" },
    ],
    Glucophage: [
      { label: "500 mg", value: "500 mg" },
      { label: "850 mg", value: "850 mg" },
      { label: "1000 mg", value: "1000 mg" },
    ],
  };

  const isValidDate = (selectedDate) => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    // console.log(sevenDaysAgo);
    return selectedDate >= sevenDaysAgo && selectedDate <= today;
  };

  const floatRegex = /^[+]?\d{2,3}(\.\d+)?$/;
  const validate = () => {
    const newErrors = {};
    let valid = true;

    if (!form.medicine) {
      newErrors.medicine = "Medicine is required";
      valid = false;
    }

    if (!form.dosage) {
      newErrors.dosage = "Dosage is required";
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
      newErrors.time = "Time is required";
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

  const parseDosage = (dosage) => {
    const match = dosage.match(/^(\d+)(?:\s*)([a-zA-Z]+)$/);
    if (match) {
      return { value: parseInt(match[1], 10), unit: match[2] };
    }
    return { value: null, unit: null };
  };

  const handleSubmit = async () => {
    if (validate()) {
      if (!form.bloodSugar) {
        form.testType = "";
      }

      const formattedTime = mergeDateTime(form.date, form.time);
      console.log(formattedTime);

      const { value: dosageValue, unit: dosageUnit } = parseDosage(form.dosage);
      console.log(dosageValue);
      console.log(dosageUnit);

      try {
        // post bg_reading + post medication-log
        const token = await AsyncStorage.getItem("accessToken");
        console.log("token used in add medication log: " + token);

        if (!token) {
          Alert.alert("Error", "User is not authenticated.");
          return;
        }

        if (form.bloodSugar) {
          const API_URL_BG = "http://yourpublicIP:8000/bg-reading/";
          const response_bg = await axios.post(
            API_URL_BG,
            {
              test_type: form.testType,
              test_result: form.bloodSugar,
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

          const response_bg_id = response_bg.data.id;
          console.log(response_bg_id);

          const API_URL_MEDICATION = "http://yourpublicIP:8000/medication-log/";
          const response_medication = await axios.post(
            API_URL_MEDICATION,
            {
              medication_name: form.medicine,
              dosage_value: dosageValue,
              dosage_unit: dosageUnit,
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
          console.log(response_medication.data);
        } else {
          const API_URL_MEDICATION = "http://yourpublicIP:8000/medication-log/";
          const response_medication = await axios.post(
            API_URL_MEDICATION,
            {
              medication_name: form.medicine,
              dosage_value: dosageValue,
              dosage_unit: dosageUnit,
              log_time: formattedTime,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response_medication.data);
        }

        setForm({
          medicine: "",
          dosage: "",
          date: "",
          time: "",
          bloodSugar: "",
          testType: "",
        });
        navigation.navigate("Home");
      } catch (error) {
        console.error(error.response_medication.data);
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
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Medicine Name</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.medicine}
          onValueChange={(value) => setForm({ ...form, medicine: value })}
          style={styles.picker}
        >
          <Picker.Item label="Select Medicine" value="" />
          <Picker.Item label="Insulin" value="Insulin" />
          <Picker.Item label="Glucophage" value="Glucophage" />
        </Picker>
      </View>
      {errors.medicine && <Text style={styles.error}>{errors.medicine}</Text>}

      {form.medicine && (
        <>
          <Text style={styles.label}>Dosage</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.dosage}
              onValueChange={(value) => setForm({ ...form, dosage: value })}
              style={styles.picker}
            >
              <Picker.Item label="Select Dosage" value="" />
              {(dosageOptions[form.medicine] || []).map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
          {errors.dosage && <Text style={styles.error}>{errors.dosage}</Text>}
        </>
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
      {errors.testType && <Text style={styles.error}>{errors.testType}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add this Record</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.whitebutton}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.buttonText, styles.textUnderline]}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
