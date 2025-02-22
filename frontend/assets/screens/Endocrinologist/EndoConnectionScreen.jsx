import React, { useState, useEffect } from "react";
import { Text, View, FlatList, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../styles";
import axios from "axios";
import PendingPatients from "../../components/PendingPatients";
import { useNavigation } from "@react-navigation/native";

const EndoConnectionsScreen = () => {
  const [pendingPatients, setPendingPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = await AsyncStorage.getItem("accessToken");
        // console.log("Token used in fetch: " + token);

        if (!token) {
          Alert.alert("Error", "User is not authenticated.");
          return;
        }

        const API_URL =
          "http://yourpublicIP:8000/endo/get_patients?type=Pending";
        const response = await axios.get(API_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log("API Response:", response.data);
        console.log(response.data);
        setPendingPatients(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPatients();
  }, []);

  const handleAccept = async (user_id) => {
    const token = await AsyncStorage.getItem("accessToken");

    if (!token) {
      Alert.alert("Error", "User is not authenticated.");
      return;
    }

    const API_URL = `http://yourpublicIP:8000/endo/approve-reject-connection/${user_id}/`;
    const response = await axios.post(
      API_URL,
      {
        action: "approve",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Alert.alert("Approved", "Patient approved successfully!");
    navigation.navigate("EndoHome");
  };

  const handleReject = async (user_id) => {
    const token = await AsyncStorage.getItem("accessToken");

    if (!token) {
      Alert.alert("Error", "User is not authenticated.");
      return;
    }

    const API_URL = `http://yourpublicIP:8000/endo/approve-reject-connection/${user_id}/`;
    const response = await axios.post(
      API_URL,
      {
        action: "reject",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log(response.data);
    Alert.alert("Rejected", "Patient has been rejected!");
    navigation.navigate("EndoHome");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#C2E0F5" />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={[styles.errorText]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingHorizontal: 15, paddingTop: 20 }]}>
      <FlatList
        data={pendingPatients}
        keyExtractor={(item) => item.user_id}
        renderItem={({ item }) => (
          <PendingPatients
            name={item.first_name + " " + item.last_name}
            phone_number={item.phone_number}
            username={item.username}
            AcceptPress={() => handleAccept(item.user_id)}
            RejectPress={() => handleReject(item.user_id)}
          />
        )}
        ListEmptyComponent={
          <View style={{ padding: 10, alignItems: "center" }}>
            <Text style={[styles.emptyMessage]}>No pending requests.</Text>
          </View>
        }
      />
    </View>
  );
};

export default EndoConnectionsScreen;
