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
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "../../../styles";

export default function EndoEditProfileScreen({ navigation, route }) {
  const { profileData } = route.params;
  console.log(route.params);
  const [form, setForm] = useState({
    nationalNumber: "",
    firstName: "",
    lastName: "",
    userName: "",
    phoneNumber: "",
    email: "",
    birthDate: "",
    clinic_address: "",
  });
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setForm({
        nationalNumber: profileData.national_number.toString(),
        userName: profileData.username,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        phoneNumber: profileData.phone_number.toString(),
        email: profileData.email,
        birthDate: profileData.birthdate,
        clinic_address: profileData.clinic_address,
      });
    };
    fetchProfileData();
  }, [profileData]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const validate = () => {
    const errors = {};
    let valid = true;

    if (!form.firstName) {
      errors.firstName = "First Name is required";
      valid = false;
    } else if (!/^[A-Za-z\s-]+$/.test(form.firstName)) {
      errors.firstName = "First Name should contain only letters";
      valid = false;
    }

    if (!form.lastName) {
      errors.lastName = "Last Name is required";
      valid = false;
    } else if (!/^[A-Za-z\s-]+$/.test(form.lastName)) {
      errors.lastName = "Last Name should contain only letters";
      valid = false;
    }

    if (!form.phoneNumber) {
      errors.phoneNumber = "Phone Number is required";
      valid = false;
    } else if (!/^(079|077|078)\d{7}$/.test(form.phoneNumber)) {
      errors.phoneNumber =
        "Phone Number should be 10 digits that start with 079, 077, or 078";
      valid = false;
    }

    if (!form.email) {
      errors.email = "Email is required";
      valid = false;
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email)
    ) {
      errors.email = "Invalid email format";
      valid = false;
    }

    if (!form.birthDate || form.birthDate === "") {
      errors.birthDate = "Birth Date is required";
      valid = false;
    } else {
      const birthDate = new Date(form.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (
        age < 18 ||
        (age === 18 && monthDifference < 0) ||
        (age === 18 &&
          monthDifference === 0 &&
          today.getDate() < birthDate.getDate())
      ) {
        errors.birthDate =
          "You have to be at least 18 years old to be able to use this application";
        valid = false;
      }
    }

    if (!form.clinic_address) {
      errors.clinic_address = "Clinic address is required";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || form.birthDate;
    setShowDatePicker(false);
    if (currentDate) {
      handleChange("birthDate", currentDate.toISOString().split("T")[0]);
    }
  };

  const handleSave = async () => {
    if (validate()) {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        console.log("token used in edit food log: " + token);

        if (!token) {
          Alert.alert("Error", "User is not authenticated.");
          return;
        }

        const API_URL = "http://yourpublicIP:8000/endo/profile/";
        if (profileData.phone_number == form.phoneNumber) {
          const response = await axios.put(
            API_URL,
            {
              user: {
                first_name: form.firstName,
                last_name: form.lastName,
                // phone_number: form.phoneNumber,
                email: form.email,
                birth_date: form.birthDate,
                clinic_address: form.clinic_address,
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          const response = await axios.put(
            API_URL,
            {
              user: {
                first_name: form.firstName,
                last_name: form.lastName,
                phone_number: form.phoneNumber,
                email: form.email,
                birth_date: form.birthDate,
                clinic_address: form.clinic_address,
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        Alert.alert("Success", "Profile updated successfully!");
        navigation.navigate("EndoHome");
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
        { label: "National Number", field: "nationalNumber" },
        { label: "First Name", field: "firstName" },
        { label: "Last Name", field: "lastName" },
        { label: "User Name", field: "userName" },
        { label: "Phone Number", field: "phoneNumber" },
        { label: "Email", field: "email" },
      ].map(({ label, field }) => (
        <View style={styles.inputContainer} key={field}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={[
              styles.input,
              field === "nationalNumber" || field === "userName"
                ? styles.nonEditableInput
                : null,
            ]}
            onChangeText={(value) => handleChange(field, value)}
            value={form[field]}
            editable={field !== "nationalNumber" && field !== "userName"}
          />
          {errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
        </View>
      ))}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Birth Date</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={styles.input}
            value={form.birthDate}
            editable={false}
          />
        </TouchableOpacity>
        {errors.birthDate && (
          <Text style={styles.error}>{errors.birthDate}</Text>
        )}
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={new Date(form.birthDate || Date.now())}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Clinic Address</Text>
        <TextInput
          style={[styles.input, { height: 75 }]}
          multiline={true}
          numberOfLines={2}
          onChangeText={(value) => handleChange("clinic_address", value)}
          value={form.clinic_address}
        />
        {errors.clinic_address && (
          <Text style={styles.error}>{errors.clinic_address}</Text>
        )}
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
