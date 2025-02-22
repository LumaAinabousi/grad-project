import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../styles";

const API_URL = "http://yourpublicIP:8000/forgot-password/";

export default function ForgetPassScreen() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const validate = () => {
    const errors = {};
    let valid = true;

    if (!form.email) {
      errors.email = "Email is required";
      valid = false;
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email)
    ) {
      errors.email = "Invalid email format";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSignIn = async () => {
    if (validate()) {
      try {
        const response = await axios.post(API_URL, {
          email: form.email,
        });

        console.log(response.status);
        Alert.alert("Reset Password Email Sent", "Please check your inbox");
        navigation.navigate("SignIn");
      } catch (error) {
        Alert.alert(
          "Sign In Failed",
          error.response?.data?.error || "An error occurred"
        );
      }
      // navigation.navigate("Home");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { marginBottom: 5 }]}>
          Enter your email
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleChange("email", value)}
          value={form.email}
          keyboardType="email-address"
        />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>

      <View>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text
            style={[
              styles.textUnderline,
              styles.textBold,
              styles.textCenter,
              styles.marginMedium,
            ]}
          >
            Don't have an account?
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
