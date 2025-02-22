import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "../../styles";

const API_URL = "http://yourpublicIP:8000/register/";

const my_styles = StyleSheet.create({
  KeyboardContainer: {
    flex: 1,
  },
});
export default function SignUpScreen() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    nationalNumber: "",
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    email: "",
    birthDate: "",
    userType: "",
    diabetesType: "",
    gender: "",
    clinic_address: "",
  });
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);

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

    if (!form.userName) {
      errors.userName = "User Name is required";
      valid = false;
    } else if (form.userName.length < 5) {
      errors.userName = "User Name should be at least 5 characters";
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

    if (!form.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
      valid = false;
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    if (!form.phoneNumber) {
      errors.phoneNumber = "Phone Number is required";
      valid = false;
    } else if (!/^(079|077|078)\d{7}$/.test(form.phoneNumber)) {
      errors.phoneNumber =
        "Phone Number should be 10 digits tht start with 079, 077, or 078";
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

    if (!form.userType) {
      errors.userType = "Please select what type of user you are";
      valid = false;
    }

    if (form.userType === "patient") {
      if (!form.diabetesType) {
        errors.diabetesType = "Diabetes Type is required for patients";
        valid = false;
      }
      if (!form.gender) {
        errors.gender = "Gender is required for patients";
        valid = false;
      }
    }

    if (form.userType === "endocrinologist") {
      if (!form.clinic_address) {
        errors.clinic_address = "Address is required for endocrinologists";
        valid = false;
      }
    }

    setErrors(errors);
    return valid;
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || form.birthDate;
    setShowDatePicker(false);
    if (currentDate) {
      handleChange("birthDate", currentDate.toISOString().split("T")[0]);
    }
  };

  const handleSignUp = async () => {
    if (validate()) {
      Alert.alert(
        "Confirmation",
        "Are you sure of the entered values?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              try {
                let response;
                if (form.userType === "patient") {
                  response = await axios.post(API_URL, {
                    username: form.userName,
                    phone_number: form.phoneNumber,
                    national_number: form.nationalNumber,
                    password: form.password,
                    first_name: form.firstName,
                    last_name: form.lastName,
                    user_type: form.userType,
                    birthdate: form.birthDate,
                    email: form.email,
                    diabetes_type: form.diabetesType,
                    gender: form.gender,
                  });
                } else if (form.userType === "endocrinologist") {
                  response = await axios.post(API_URL, {
                    username: form.userName,
                    phone_number: form.phoneNumber,
                    national_number: form.nationalNumber,
                    password: form.password,
                    first_name: form.firstName,
                    last_name: form.lastName,
                    user_type: form.userType,
                    birthdate: form.birthDate,
                    email: form.email,
                    clinic_address: form.clinic_address,
                  });
                }

                console.log(response.data);
                if (response.status >= 200 && response.status < 300) {
                  console.log(response.data);
                  await AsyncStorage.setItem(
                    "accessToken",
                    response.data.tokens.access
                  );
                  await AsyncStorage.setItem(
                    "refreshToken",
                    response.data.tokens.refresh
                  );
                  // Navigate to respective screens
                  if (form.userType === "patient") {
                    navigation.navigate("MedicalInfoPatient");
                  } else if (form.userType === "endocrinologist") {
                    navigation.navigate("EndoHome");
                  }
                } else {
                  // Handle the case if the status is not 202
                  Alert.alert(
                    "Error",
                    `Unexpected response code: ${response.status}`,
                    [{ text: "OK" }]
                  );
                }
              } catch (error) {
                // Handle axios error
                if (error.response) {
                  const errorData = error.response.data;
                  if (errorData.national_number) {
                    Alert.alert(
                      "National Number Already Exists",
                      `${errorData.national_number.join(", ")}`
                    );
                  } else if (errorData.username) {
                    Alert.alert(
                      "Username Already Exists",
                      `${errorData.username.join(", ")}`
                    );
                  } else if (errorData.email) {
                    Alert.alert(
                      "Email Already Exists",
                      `${errorData.email.join(", ")}`
                    );
                  } else if (errorData.phone_number) {
                    Alert.alert(
                      "Phone Number Already Exists",
                      `${errorData.phone_number.join(", ")}`
                    );
                  }
                } else if (error.request) {
                  Alert.alert(
                    "Connection Timed-out",
                    "No response received from the server.",
                    [{ text: "OK" }]
                  );
                } else {
                  Alert.alert(
                    "Error",
                    `Error setting up request: ${error.message}`,
                    [{ text: "OK" }]
                  );
                }
              }
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={my_styles.KeyboardContainer}
    >
      <ScrollView style={styles.container}>
        {[
          { label: "National Number", field: "nationalNumber" },
          { label: "First Name", field: "firstName" },
          { label: "Last Name", field: "lastName" },
          { label: "User Name", field: "userName" },
          { label: "Password", field: "password", secureTextEntry: true },
          {
            label: "Confirm Password",
            field: "confirmPassword",
            secureTextEntry: true,
          },
          { label: "Phone Number", field: "phoneNumber" },
          { label: "Email", field: "email" },
          { label: "Birth Date", field: "birthDate", isDatePicker: true },
        ].map(({ label, field, secureTextEntry, isDatePicker }) => (
          <View style={styles.inputContainer} key={field}>
            <Text style={styles.label}>{label}</Text>
            {isDatePicker ? (
              <TouchableOpacity
                onPress={showDatePickerModal}
                style={styles.input}
              >
                <TextInput
                  style={styles.textInput}
                  onChangeText={(value) => handleChange(field, value)}
                  value={form[field]}
                  editable={false}
                />
                <TouchableOpacity onPress={showDatePickerModal}>
                  <Image
                    source={require("../../images/calendar.png")}
                    style={styles.dateIcon}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ) : (
              <TextInput
                style={styles.input}
                onChangeText={(value) => handleChange(field, value)}
                value={form[field]}
                secureTextEntry={secureTextEntry}
              />
            )}
            {errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
          </View>
        ))}

        <Text style={styles.label}>You are a?</Text>
        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={[
              styles.radio,
              form.userType === "patient" && styles.radioSelected,
            ]}
            onPress={() => handleChange("userType", "patient")}
          >
            <Text>Patient</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radio,
              form.userType === "endocrinologist" && styles.radioSelected,
            ]}
            onPress={() => handleChange("userType", "endocrinologist")}
          >
            <Text>Endocrinologist</Text>
          </TouchableOpacity>
        </View>
        {errors.userType && <Text style={styles.error}>{errors.userType}</Text>}

        {showDatePicker && (
          <DateTimePicker
            value={form.birthDate ? new Date(form.birthDate) : new Date()}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        {form.userType === "patient" && (
          <>
            <Text style={styles.label}>Diabetes Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.diabetesType}
                onValueChange={(value) => handleChange("diabetesType", value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Type" value="" />
                <Picker.Item label="Type 1" value="type1" />
                <Picker.Item label="Type 2" value="type2" />
              </Picker>
            </View>
            {errors.diabetesType && (
              <Text style={styles.error}>{errors.diabetesType}</Text>
            )}

            <TouchableOpacity
              onPress={() => navigation.navigate("DiabetesType")}
            >
              <Text style={styles.link}>Learn about diabetes types</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Gender</Text>
            <View style={styles.radioContainer}>
              <TouchableOpacity
                style={[
                  styles.radio,
                  form.gender === "male" && styles.radioSelected,
                ]}
                onPress={() => handleChange("gender", "male")}
              >
                <Text>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radio,
                  form.gender === "female" && styles.radioSelected,
                ]}
                onPress={() => handleChange("gender", "female")}
              >
                <Text>Female</Text>
              </TouchableOpacity>
            </View>
            {errors.gender && <Text style={styles.error}>{errors.gender}</Text>}
          </>
        )}

        {form.userType === "endocrinologist" && (
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
        )}

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
