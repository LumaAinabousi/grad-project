import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "../../../styles";

export default function EditMedicalProfileScreen({ navigation, route }) {
  const medicalData = route.params.medicalData;
  // console.log(route.prams);
  const [form, setForm] = useState({
    weight: "",
    height: "",
    waistSize: "",
    bmi: "",
    kft: "",
    lft: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicalData = async () => {
      setForm({
        weight: medicalData.weight.toString(),
        height: medicalData.height.toString(),
        waistSize: medicalData.waist_size.toString(),
        bmi: medicalData.bmi.toString(),
        kft: medicalData.kft.toString(),
        lft: medicalData.lft.toString(),
      });
    };
    fetchMedicalData();
  }, [medicalData]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const calculateBMI = (weight, height) => {
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

    const numberFields = ["weight", "height", "waistSize", "kft", "lft"];
    numberFields.forEach((field) => {
      if (!form[field]) {
        errors[field] = `${field} is required`;
        valid = false;
      } else if (!/^\d+(\.\d{1,2})?$/.test(form[field])) {
        errors[field] = `${field} must be a valid number`;
        valid = false;
      }
    });

    setErrors(errors);
    return valid;
  };

  const handleSave = async () => {
    if (validate()) {
      setLoading(true);
      const new_bmi = calculateBMI(form.weight, form.height);
      try {
        const token = await AsyncStorage.getItem("accessToken");
        console.log("token used in edit food log: " + token);

        if (!token) {
          Alert.alert("Error", "User is not authenticated.");
          return;
        }

        const API_URL = "http://yourpublicIP:8000/medical-info/";
        const response = await axios.post(
          API_URL,
          {
            weight: form.weight,
            height: form.height,
            waist_size: form.waistSize,
            bmi: new_bmi,
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
        Alert.alert("Success", "Medical profile updated successfully!");
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

  return (
    <ScrollView style={styles.container}>
      {[
        { label: "Weight (kg)", field: "weight" },
        { label: "Height (cm)", field: "height" },
        { label: "Waist Size (cm)", field: "waistSize" },
        { label: "KFT", field: "kft" },
        { label: "LFT", field: "lft" },
      ].map(({ label, field }) => (
        <View style={styles.inputContainer} key={field}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => handleChange(field, value)}
            value={form[field]}
            // keyboardType={
            //   field === "kft" || field === "lft"
            //     ? "default"
            //     : "numeric"
            // }
          />
          {errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
