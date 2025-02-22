import React from "react";
import { TouchableOpacity, Text, View, Image } from "react-native";
import styles from "../styles";

const RecordComponent = ({ record, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.progressContainer,
        {
          alignItems: "center",
          justifyContent: "center",
          borderColor: "#C2E0F5",
          marginBottom: 0,
        },
      ]}
      onPress={() => onPress(record)}
    >
      <Image
        source={require("../images/Reports.png")}
        style={[
          styles.profilePicture,
          {
            margin: 10,
            borderWidth: 0,
            borderRadius: 0,
            height: 50,
            width: 50,
          },
        ]}
      />
      <Text style={[styles.entryTitle, styles.textBold, styles.textCenter]}>
        {record.name}
      </Text>
      <Text style={[styles.entryValue, { fontSize: 12 }]}>{record.date}</Text>
    </TouchableOpacity>
  );
};

export default RecordComponent;
