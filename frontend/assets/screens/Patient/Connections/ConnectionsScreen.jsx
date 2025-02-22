import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../../styles";

export default function ConnectionsScreen({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState("");

  const handleConnectPress = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setUsername("");
  };

  const handleOk = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Error", "User is not authenticated.");
        navigation.navigate("SignIn");
        return;
      }

      const API_URL = "http://yourpublicIP:8000/patient/link-patient/";
      const response = await axios.post(
        API_URL,
        {
          username: username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(response.data);

      navigation.navigate("Home");
      // if (response.data.status === "Pending") {
      //   Alert.alert("Request Sent", "Your connection request is pending.");
      //   navigation.navigate("PendingConnection");
      // } else if (response.data.status === "Approved") {
      //   Alert.alert(
      //     "Connection Established",
      //     "You are now connected with your endocrinologist."
      //   );
      //   navigation.navigate("EndoInformation");
      // } else {
      //   Alert.alert(
      //     "Error",
      //     "Unexpected response from the server. Please try again."
      //   );
      // }
      setModalVisible(false);
      setUsername("");
    } catch (error) {
      console.error(error);
      const errorMessage =
        error?.response?.data?.error || "An error occurred while connecting.";
      if (error?.response?.status === 404) {
        Alert.alert(
          "Invalid Username",
          "No endocrinologist found with this username."
        );
      } else if (error?.response?.status === 401) {
        Alert.alert("Session Expired", "Please log in again.");
        navigation.navigate("SignIn");
      } else {
        Alert.alert("Error", errorMessage);
      }
      setModalVisible(false);
      setUsername("");
    }
  };

  return (
    <View style={styles.onboardingContainer}>
      <Text style={[styles.title, { marginBottom: 20 }]}>Start Now</Text>
      <Text
        style={[
          {
            fontSize: 16,
            textAlign: "center",
            marginBottom: 20,
          },
        ]}
      >
        Get expert advice and feedback on your logs and readings with your
        endocrinologist.
      </Text>
      <Image
        source={require("../../../../assets/images/endo.png")}
        style={[
          {
            width: 250,
            height: 250,
            marginBottom: 20,
          },
        ]}
      />
      <Text
        style={[
          styles.detail,
          styles.textUnderline,
          { fontWeight: "bold", marginTop: 15, color: "black", fontSize: 13 },
        ]}
      >
        Know your endocrinologist's username?
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleConnectPress}>
        <Text style={[styles.buttonText, { fontSize: 16 }]}>Connect</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your endocrinologist username..."
              value={username}
              onChangeText={setUsername}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.okButton]}
                onPress={handleOk}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
