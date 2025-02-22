import React from "react";
import { View, Text, ScrollView } from "react-native";
import styles from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import EndoLogEntry from "../../../components/EndoLogEntry";
import EndoProgressTracker from "../../../components/EndoProgressTracker";
import patientsData from "../PatientsData";

const PatientInfoScreen = ({ route }) => {
  const navigation = useNavigation();
  const patient = route.params.patient;

  if (!patient) {
    return (
      <View>
        <Text style={{ fontStyle: "italic", color: "#999" }}>
          Patient not found.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { padding: 20 }]}>
      <View
        style={[
          styles.progressContainer,
          { padding: 10, marginBottom: 0, borderColor: "#c5c5c5" },
        ]}
      >
        <Text
          style={[styles.entryTitle, styles.textBold]}
        >{`${patient.first_name} ${patient.last_name}`}</Text>
        <Text style={styles.detail}>
          Diabetes Type: {patient.diabetes_type}
        </Text>
        <Text style={styles.detail}>Birthdate: {patient.birthdate}</Text>
        <Text style={styles.detail}>Phone Number: {patient.phone_number}</Text>
      </View>

      <View style={[styles.logSection, { padding: 0, marginVertical: 10 }]}>
        <EndoLogEntry
          title="Blood Sugar Tracking"
          description="Track your patient's blood sugar."
          icon={require("../../../images/BloodSugar.jpg")}
          ViewOnPress={() => {
            navigation.navigate("EndoViewBloodSugar", {
              patientID: patient.user_id,
            });
          }}
        />
        <EndoLogEntry
          title="Blood Pressure Tracking"
          description="Track your patient's blood pressure."
          icon={require("../../../images/BloodPressure.png")}
          ViewOnPress={() => {
            navigation.navigate("EndoViewBloodPressure", {
              patientID: patient.user_id,
            });
          }}
        />
        <EndoLogEntry
          title="Food Tracking"
          description="Track your patient's food."
          icon={require("../../../images/Meals.png")}
          ViewOnPress={() => {
            navigation.navigate("EndoViewFood", { patientID: patient.user_id });
          }}
        />
        <EndoLogEntry
          title="Activity Tracking"
          description="Track your patient's activities."
          icon={require("../../../images/Activity.png")}
          ViewOnPress={() => {
            navigation.navigate("EndoViewActivity", {
              patientID: patient.user_id,
            });
          }}
        />
        <EndoLogEntry
          title="Medication Tracking"
          description="Track your patient's medications."
          icon={require("../../../images/Medication.png")}
          ViewOnPress={() => {
            navigation.navigate("EndoViewMedication", {
              patientID: patient.user_id,
            });
          }}
        />
        <EndoLogEntry
          title="Reports Tracking"
          description="Track your patient's reports."
          icon={require("../../../images/Reports.png")}
          ViewOnPress={() => {
            navigation.navigate("EndoReports", { patientID: patient.user_id });
          }}
        />
      </View>
    </ScrollView>
  );
};

export default PatientInfoScreen;
