import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../../styles";

export default function EndoProfileScreen() {
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        console.log("Token used in fetch: " + token);

        if (!token) {
          Alert.alert("Error", "User is not authenticated.");
          return;
        }

        const API_URL = "http://yourpublicIP:8000/endo/profile/";
        const response = await axios.get(API_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data);
        setProfileData(response.data);
      } catch (error) {
        console.error(error);
        const errorMessage =
          error?.response?.data?.error || "An error occurred";
        if (error?.response?.status === 401) {
          Alert.alert("Session Expired", "Please log in again.");
          navigation.navigate("SignIn");
        } else {
          Alert.alert("Error", errorMessage);
        }
      }
    }

    fetchProfileData();
  }, []);

  const renderProfileField = (label, value) => (
    <View style={styles.row}>
      <Text
        style={[
          styles.label,
          {
            borderRightWidth: 1,
            borderColor: "#C2E0F5",
            marginRight: 10,
            marginTop: 5,
          },
        ]}
      >
        {label}
      </Text>
      <Text style={[styles.value, { marginTop: 5 }]}>
        {value || "Not provided"}
      </Text>
    </View>
  );

  console.log(profileData);
  if (!profileData) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#C2E0F5" />
      </View>
    );
  }

  const handleSignOut = () => {
    Alert.alert("Confirmation", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          try {
            console.log(AsyncStorage.getItem("accessToken"));
            await AsyncStorage.removeItem("accessToken");
            await AsyncStorage.removeItem("refreshToken");
            console.log(AsyncStorage.getItem("accessToken"));
            navigation.navigate("Sugarak");
          } catch (error) {
            console.log(error);
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Picture */}
      <View
        style={[
          {
            backgroundColor: "#fff",
            borderRadius: 20,
            borderColor: "#C2E0F5",
            borderWidth: 1,
            marginBottom: 25,
            // padding: 10,
            alignItems: "center",
          },
        ]}
      >
        <Image
          source={require("../../../images/profile.jpeg")}
          style={styles.profilePicture}
        />
        <Text style={styles.profileName}>
          {profileData.first_name} {profileData.last_name}
        </Text>
      </View>

      {/* General Information */}
      <View
        style={[
          {
            backgroundColor: "#fff",
            borderRadius: 20,
            borderColor: "#C2E0F5",
            borderWidth: 1,
            marginBottom: 25,
          },
        ]}
      >
        <Text
          style={[
            styles.sectionHeader,
            {
              textAlign: "center",
              borderColor: "#C2E0F5",
              borderBottomWidth: 1,
              paddingBottom: 10,
              marginBottom: 10,
            },
          ]}
        >
          Personal Information
        </Text>
        <View style={styles.profileField}>
          {renderProfileField("National Number", profileData.national_number)}
          {/* {renderProfileField(
            "Name",
            profileData.firstName + " " + profileData.lastName
          )} */}
          {renderProfileField("User Name", profileData.username)}
          {renderProfileField("Phone Number", profileData.phone_number)}
          {renderProfileField("Email", profileData.email)}
          {renderProfileField("Birth Date", profileData.birthdate)}
          {renderProfileField("Address", profileData.clinic_address)}
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("EndoEditProfile", { profileData: profileData })
          }
        >
          <Text
            style={[
              styles.textUnderline,
              styles.textBold,
              styles.textCenter,
              { marginVertical: 10 },
            ]}
          >
            Edit my Profile
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, { marginTop: 0, marginBottom: 25 }]}
        onPress={() => handleSignOut()}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
