import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../styles";

const EndoLogEntry = ({ title, description, icon, ViewOnPress }) => {
  return (
    <View style={[styles.entryContainer, styles.backgroundPrimary]}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} />
      </View>
      <Text style={[styles.entryTitle, styles.textBold]}>{title}</Text>
      <Text style={styles.entryValue}>{description}</Text>
      <TouchableOpacity onPress={ViewOnPress} style={styles.buttonPrimary}>
        <Text>View</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EndoLogEntry;
