import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import styles from "../../../styles";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function EndoViewMedicationScreen({ route }) {
  const [medicationRecords, setMedicationRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const patientID = route.params.patientID;
  // console.log(patientID);

  useEffect(() => {
    async function fetchMedicationData() {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        console.log("Token used in fetch: " + token);

        if (!token) {
          Alert.alert("Error", "User is not authenticated.");
          return;
        }

        let formData = [
          {
            test_type: "N/A",
            test_result: "N/A",
            medication_name: "",
            dosage_value: "",
            dosage_unit: "",
            log_time: "",
            bg_reading: "",
            id: "",
          },
        ];
        const API_URL_MEDICATION = `http://yourpublicIP:8000/patients/${patientID}/logs/medication-log/`;
        const response = await axios.get(API_URL_MEDICATION, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", response.data);

        const medicationData = response.data;

        for (let i = 0; i < medicationData.length; i++) {
          const medication = medicationData[i];
          formData[i] = {
            test_type: "N/A",
            test_result: "N/A",
            medication_name: medicationData[i].medication_name,
            dosage_value: medicationData[i].dosage_value,
            dosage_unit: medicationData[i].dosage_unit,
            log_time: medicationData[i].log_time,
            bg_reading: medicationData[i].bg_reading,
            id: medicationData[i].id,
          };

          if (medication.bg_reading) {
            const bgReadingID = medication.bg_reading;
            console.log("Reading ID:", bgReadingID);
            const API_URL_BG_READING = `http://yourpublicIP:8000/patients/${patientID}/logs/bg-reading/${bgReadingID}/`;

            try {
              const bgResponse = await axios.get(API_URL_BG_READING, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });

              formData[i].test_result = bgResponse.data.test_result;
              formData[i].test_type = bgResponse.data.test_type;
            } catch (error) {
              console.error("Error fetching medication data:", error);
            }
          }
        }

        formData.reverse();
        setMedicationRecords(formData);
      } catch (error) {
        console.error("Error fetching medication data:", error);
        Alert.alert("Error", "Failed to fetch medication records.");
      } finally {
        setLoading(false);
      }
    }

    fetchMedicationData();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#C2E0F5" />
      ) : medicationRecords.length === 0 ? (
        <Text style={styles.emptyMessage}>No records found.</Text>
      ) : (
        <FlatList
          data={medicationRecords}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.progressContainer}>
              <Text style={styles.date}>Date: {item.log_time}</Text>
              <Text style={styles.detail}>
                Medicine: {item.medication_name}
              </Text>
              <Text style={styles.detail}>
                Dosage: {item.dosage_value} {item.dosage_unit}
              </Text>
              <Text style={styles.detail}>
                Blood Sugar: {item.test_result || "N/A"}
              </Text>
              <Text style={styles.detail}>
                Test Type: {item.test_type || "N/A"}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
