import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../styles";

const LogEntry = ({ title, description, icon, AddOnPress, ViewOnPress }) => {
  return (
    <View style={[styles.entryContainer, styles.backgroundPrimary]}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} />
      </View>
      <Text style={[styles.entryTitle, styles.textBold]}>{title}</Text>
      <Text style={styles.entryValue}>{description}</Text>
      <TouchableOpacity onPress={AddOnPress} style={styles.buttonPrimary}>
        <Text>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={ViewOnPress} style={styles.buttonPrimary}>
        <Text>View</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LogEntry;
