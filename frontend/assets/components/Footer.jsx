import React from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import styles from "../styles";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Footer = ({}) => {
  const navigation = useNavigation();

  const checkConnectionStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      console.log("Token used in fetch: " + token);

      if (!token) {
        Alert.alert("Error", "User is not authenticated.");
        return;
      }

      const API_URL = "http://yourpublicIP:8000/patient/profile/";
      const response = await axios.get(API_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      const supervisor_info = response.data;
      if (response.data.status === "Pending") {
        navigation.navigate("PendingConnection");
      } else if (response.data.status === "Approved") {
        navigation.navigate("EndoInformation", {
          supervisor_info: supervisor_info,
        });
      } else {
        navigation.navigate("Connections");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.error || "An error occurred";
      if (error?.response?.status === 401) {
        Alert.alert("Session Expired", "Please log in again.");
        navigation.navigate("SignIn");
      } else {
        Alert.alert("Error", errorMessage);
      }
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
        backgroundColor: "#C2E0F5",
        borderTopWidth: 1,
        borderTopColor: "#C2E0F5",
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Icon
          name="home"
          size={25}
          style={{ color: "black", paddingBottom: 10 }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={checkConnectionStatus}>
        <Icon
          name="people"
          size={25}
          style={{ color: "black", paddingBottom: 10 }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Reports")}>
        <Icon
          name="document-text"
          size={25}
          style={{ color: "black", paddingBottom: 10 }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Icon
          name="person"
          size={25}
          style={{ color: "black", paddingBottom: 10 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Footer;
