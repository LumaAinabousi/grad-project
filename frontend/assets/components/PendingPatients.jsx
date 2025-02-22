import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../styles";

const PendingPatients = ({
  name,
  username,
  phone_number,
  AcceptPress,
  RejectPress,
}) => {
  return (
    <View
      style={[
        styles.progressContainer,
        {
          alignItems: "center",
          justifyContent: "center",
          borderColor: "#C2E0F5",
        },
      ]}
    >
      <Image
        source={require("../images/profile.jpeg")}
        style={[styles.profilePicture, {}]}
      />
      <Text style={[styles.entryTitle, styles.textBold, styles.textCenter]}>
        {name}
      </Text>
      <Text
        style={[
          styles.entryTitle,
          styles.textBold,
          styles.textCenter,
          { fontSize: 15, color: "blue" },
        ]}
      >
        {phone_number}
      </Text>
      <Text style={styles.entryValue}>{username}</Text>
      <TouchableOpacity onPress={AcceptPress} style={styles.buttonPrimary}>
        <Text>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={RejectPress} style={styles.buttonPrimary}>
        <Text>Reject</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PendingPatients;
