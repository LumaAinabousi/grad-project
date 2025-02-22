import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import styles from "../../../styles";

export default function PendingConnectionScreen() {
  return (
    <View style={[styles.loadingcontainer, {}]}>
      <Image
        source={require("../../../../assets/images/Logo.png")}
        style={[styles.loadinglogo, { marginBottom: "10%" }]}
      />
      <Text style={[styles.title, { marginBottom: 15 }]}>Pending ...</Text>
      <Text style={[styles.subtitle, { textAlign: "center", fontSize: 14 }]}>
        Your request is sent successfully.
      </Text>
    </View>
  );
}
