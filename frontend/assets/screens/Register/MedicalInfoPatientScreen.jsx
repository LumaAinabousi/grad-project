import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "../../styles";

const API_URL = "http://yourpublicIP:8000/medical-info/";

export default function MedicalInfoPatientScreen() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    weight: "",
    height: "",
    waistSize: "",
    bmi: "",
    kft: "",
    lft: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => {
      const updatedForm = { ...prev, [field]: value };
      // console.log(updatedForm);
      return updatedForm;
    });
    setForm((prev) => ({
      ...prev,
      [field]: value,
      bmi:
        field === "weight" || field === "height"
          ? calculateBMI(prev)
          : prev.bmi,
    }));
  };

  const calculateBMI = ({ weight, height }) => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const heightSquared = heightInMeters ** 2;
      return (weight / heightSquared).toFixed(2);
    }
    return "";
  };

  const validate = () => {
    const errors = {};
    let valid = true;

    if (!form.weight || isNaN(form.weight) || form.weight <= 0) {
      errors.weight = "Weight is required";
      valid = false;
    } else if (form.weight < 30 || form.weight > 350) {
      errors.weight = "Enter a valid weight";
      valid = false;
    }

    if (!form.height || isNaN(form.height) || form.height <= 0) {
      errors.height = "Height is required";
      valid = false;
    } else if (form.height < 50 || form.height > 250) {
      errors.height = "Enter a valid height";
      valid = false;
    }

    if (!form.waistSize || isNaN(form.waistSize) || form.waistSize <= 0) {
      errors.waistSize = "Waist size is required";
      valid = false;
    } else if (form.waistSize < 35 || form.waistSize > 150) {
      errors.waistSize = "Enter a valid waist size";
      valid = false;
    }

    if (form.kft && (form.kft < 0.6 || form.kft > 1.3)) {
      errors.kft = "Enter a valid value";
      valid = false;
    }

    if (form.lft && (form.lft < 7 || form.lft > 56)) {
      errors.lft = "Enter a valid value";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSave = async () => {
    if (validate()) {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        console.log("token used in medical info: " + token);

        if (!token) {
          Alert.alert("Error", "User is not authenticated.");
          return;
        }

        const response = await axios.post(
          API_URL,
          {
            weight: form.weight,
            height: form.height,
            waist_size: form.waistSize,
            bmi: form.bmi,
            kft: form.kft,
            lft: form.lft,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        navigation.navigate("Home");
      } catch (error) {
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
    <ScrollView style={styles.container}>
      {[
        { label: "Weight (kg)", field: "weight", placeholder: "Weight" },
        { label: "Height (cm)", field: "height", placeholder: "Height" },
        {
          label: "Waist Size (cm)",
          field: "waistSize",
          placeholder: "Waist Size",
        },
        { label: "KFT (mg/dL)", field: "kft", placeholder: "KFT" },
        { label: "LFT (U/L)", field: "lft", placeholder: "LFT" },
      ].map(({ label, field, placeholder }) => (
        <View style={styles.inputContainer} key={field}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => handleChange(field, value)}
            value={form[field]}
            placeholder={placeholder}
          />
          {errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
