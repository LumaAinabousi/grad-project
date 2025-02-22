import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import styles from "../../../styles";

export default function ProfileScreen({ navigation, route }) {
  const supervisor_info = route.params.supervisor_info;
  const [profileData, setProfileData] = useState(null);
  const [form, setForm] = useState({
    supervisor_first_name: "",
    supervisor_last_name: "",
    supervisor_phone_number: "",
    supervisor_email: "",
    supervisor_clinic_address: "",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      setForm({
        supervisor_first_name: supervisor_info.supervisor_first_name,
        supervisor_last_name: supervisor_info.supervisor_last_name,
        supervisor_phone_number:
          supervisor_info.supervisor_phone_number.toString(),
        supervisor_email: supervisor_info.supervisor_email,
        supervisor_clinic_address: supervisor_info.supervisor_clinic_address,
      });
      // const dummyData = {
      //   firstName: "Ahmad",
      //   lastName: "Mohammad",
      //   phoneNumber: "0791895456",
      //   email: "ahmad_mohammad@gmail.com",
      //   clinic_address: "123 Wasfi ALtal Street",
      // };
      // setProfileData(dummyData);
    };

    fetchProfileData();
  }, [supervisor_info]);

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

  if (!supervisor_info) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#C2E0F5" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          justifyContent: "center",
        },
      ]}
    >
      <Image
        source={require("../../../../assets/images/endo.png")}
        style={[
          {
            width: 250,
            height: 250,
            marginBottom: 20,
            justifyContent: "center",
            marginLeft: "12.5%",
          },
        ]}
      />
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
          {form.supervisor_first_name + " " + form.supervisor_last_name}
        </Text>
        <View style={styles.profileField}>
          {renderProfileField("Phone Number", form.supervisor_phone_number)}
          {renderProfileField("Email", form.supervisor_email)}
          {renderProfileField("Clinic Address", form.supervisor_clinic_address)}
        </View>
      </View>
    </ScrollView>
  );
}
