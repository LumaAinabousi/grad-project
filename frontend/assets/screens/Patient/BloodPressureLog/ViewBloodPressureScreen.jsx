import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import styles from "../../../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ViewBloodPressureScreen = ({ navigation }) => {
  const [bpRecords, setBPRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBPData() {
      try {
        // Fetch the token from storage
        const token = await AsyncStorage.getItem("accessToken");
        console.log("Token used in fetch: " + token);

        if (!token) {
          Alert.alert("Error", "User is not authenticated.");
          return;
        }

        // API call to fetch blood pressure logs
        const API_URL_BP = "http://yourpublicIP:8000/bp-log/";
        const response = await axios.get(API_URL_BP, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", response.data);
        response.data.reverse();
        setBPRecords(response.data);
      } catch (error) {
        console.error("Error fetching blood pressure data:", error);
        Alert.alert("Error", "Failed to fetch blood pressure records.");
      } finally {
        setLoading(false);
      }
    }

    fetchBPData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.progressContainer}>
      <Text style={styles.date}>Date: {item.log_time}</Text>
      <Text style={styles.detail}>Systolic Pressure: {item.s_pressure}</Text>
      <Text style={styles.detail}>Diastolic Pressure: {item.d_pressure}</Text>
      <Text style={styles.detail}>Test Type: {item.bp_test_type}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AddBloodPressure")}
      >
        <Text style={[styles.buttonText]}>Add New Record</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#C2E0F5" />
      ) : bpRecords.length === 0 ? (
        <Text style={styles.emptyMessage}>No records found.</Text>
      ) : (
        <FlatList
          data={bpRecords}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          style={styles.list}
        />
      )}
    </View>
  );
};

export default ViewBloodPressureScreen;
