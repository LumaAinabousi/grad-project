import React from "react";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { records } from "./reportsData";
import RecordComponent from "../../../components/Report";
import styles from "../../../styles";

export default function ReportsScreen() {
  const navigation = useNavigation();

  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const handlePress = (record) => {
    navigation.navigate("ReportDetails", { record });
  };

  return (
    <ScrollView style={styles.container}>
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
