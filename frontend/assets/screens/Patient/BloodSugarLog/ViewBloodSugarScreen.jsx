import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getData } from "./dummyData";
import styles from "../../../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ViewBloodSugarScreen = ({ navigation }) => {
  const [bgRecords, setBGRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBGData() {
      try {
        // Fetch the token from storage
        const token = await AsyncStorage.getItem("accessToken");
        console.log("Token used in fetch: " + token);

        if (!token) {
          Alert.alert("Error", "User is not authenticated.");
          return;
        }

        // API call to fetch blood sugar logs
        const API_URL_BP = "http://yourpublicIP:8000/bg-reading/";
        const response = await axios.get(API_URL_BP, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", response.data);
        response.data.reverse();
        setBGRecords(response.data);
      } catch (error) {
        console.error("Error fetching blood sugar data:", error);
        Alert.alert("Error", "Failed to fetch blood sugar records.");
      } finally {
        setLoading(false);
      }
    }

    fetchBGData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.progressContainer}>
      <Text style={styles.date}>Date: {item.test_time}</Text>
      <Text style={styles.detail}>Blood Sugar Level: {item.test_result}</Text>
      <Text style={styles.detail}>Test Type: {item.test_type}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AddBloodSugar")}
      >
        <Text style={[styles.buttonText]}>Add New Record</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#C2E0F5" />
      ) : bgRecords.length === 0 ? (
        <Text style={styles.emptyMessage}>No records found.</Text>
      ) : (
        <FlatList
          data={bgRecords}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          style={styles.list}
        />
      )}
    </View>
  );
};

export default ViewBloodSugarScreen;
