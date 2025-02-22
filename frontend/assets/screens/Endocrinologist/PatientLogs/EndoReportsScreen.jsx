import React from "react";
import { ScrollView } from "react-native";
import { records } from "../../Patient/Reports/reportsData";
import RecordComponent from "../../../components/Report";
import styles from "../../../styles";

export default function EndoReportsScreen({ route }) {
  const patientID = route.params.patientID;
  // console.log(patientID);

  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const handlePress = (record) => {
    navigation.navigate("ReportDetails", { record });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {sortedRecords.map((record) => (
        <RecordComponent
          key={record.id}
          record={record}
          onPress={handlePress}
        />
      ))}
    </ScrollView>
  );
}
