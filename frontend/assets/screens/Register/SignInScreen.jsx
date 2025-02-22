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

const API_URL = "http://yourpublicIP:8000/login/";

export default function SignInScreen() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    nationalNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const validate = () => {
    const errors = {};
    let valid = true;

    if (!form.nationalNumber) {
      errors.nationalNumber = "National Number is required";
      valid = false;
    } else if (!/^\d{10}$/.test(form.nationalNumber)) {
      errors.nationalNumber = "National Number should be exactly 10 digits";
      valid = false;
    }

    if (!form.password) {
      errors.password = "Password is required";
      valid = false;
    } else if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[_@*$])[A-Za-z\d_@*$]{8,}$/.test(form.password)
    ) {
      errors.password =
        "Password should be at least 8 characters long, contain at least one uppercase letter, one digit, and one special character (_, @, *, $)";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSignIn = async () => {
    if (validate()) {
      // navigation.navigate("Home");
      try {
        const response = await axios.post(API_URL, {
          username: form.nationalNumber,
          password: form.password,
        });

        await AsyncStorage.setItem("accessToken", response.data.access);
        await AsyncStorage.setItem("refreshToken", response.data.refresh);

        const user_type = response.data.user_type;

        console.log("token from login: " + response.data.access);
        console.log(" from login: " + response);

        console.log(
          "token from accessToken: " +
            (await AsyncStorage.getItem("accessToken"))
        );

        if (user_type === "patient") {
          navigation.navigate("Home");
        } else if (user_type === "endocrinologist") {
          navigation.navigate("EndoHome");
        } else {
          Alert.alert("Role Not Recognized", "Please contact support.");
        }
      } catch (error) {
        if (error.response) {
          const errorData = error.response.data;
          console.log("Errors:", errorData);
          if (errorData.non_field_errors) {
            Alert.alert(
              "Log In Failed",
              `${errorData.non_field_errors.join(", ")}`
            );
          } else if (errorData.error) {
            Alert.alert("User Not Found", `${errorData.error}`);
          } else {
            Alert.alert("Error", "An unknown error occurred.");
          }
        } else {
          Alert.alert(
            "Connection Timed-out",
            "A network error occurred. Please try again."
          );
        }
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
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

      <View style={styles.inputContainer}>
        <Text style={styles.label}>National Number</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleChange("nationalNumber", value)}
          value={form.nationalNumber}
          keyboardType="numeric"
        />
        {errors.nationalNumber && (
          <Text style={styles.error}>{errors.nationalNumber}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleChange("password", value)}
          value={form.password}
          secureTextEntry
        />
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ForgetPass")}>
        <Text
          style={[
            styles.error,
            styles.textUnderline,
            styles.textBold,
            styles.textCenter,
          ]}
        >
          Forget Password?
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
