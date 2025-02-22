import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "../../styles";

const EndoHomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApprovedPatients = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await AsyncStorage.getItem("accessToken");
        // console.log("Token used in fetch: " + token);

        if (!token) {
          Alert.alert("Error", "User is not authenticated.");
          return;
        }

        const API_URL = "http://yourpublicIP:8000/endo/get_patients/";
        const response = await axios.get(API_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data);
        setPatients(response.data);
      } catch (err) {
        setError(err);
        Alert.alert("Error", "Failed to fetch approved patients.");
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedPatients();
  }, []);

  const filteredPatients = patients
    .filter(
      (patient) =>
        patient.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${patient.first_name} ${patient.last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.first_name.localeCompare(b.first_name));

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#C2E0F5" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "red" }}>
          Failed to load data. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: 15,
          paddingTop: 20,
          paddingBottom: 0,
        },
      ]}
    >
      <TextInput
        style={styles.input}
        placeholder="Search for a patient..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <FlatList
        style={[styles.progressContainer, { borderWidth: 0, padding: 0 }]}
        data={filteredPatients}
        keyExtractor={(item) => item.user_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.mealItem}
            onPress={() =>
              navigation.navigate("PatientInfo", { patient: item })
            }
          >
            <Text style={styles.textBold}>
              {item.first_name} {item.last_name}
            </Text>
            <Text style={styles.patientDetails}>
              Birth Date: {item.birthdate}
            </Text>
            <Text style={styles.patientDetails}>
              Diabetes Type: {item.diabetes_type}
            </Text>
            <Text style={styles.patientDetails}>
              Phone: {item.phone_number}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ padding: 10, alignItems: "center" }}>
            <Text style={{ fontStyle: "italic", color: "#999" }}>
              No patients found. Try a different search term.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default EndoHomeScreen;
