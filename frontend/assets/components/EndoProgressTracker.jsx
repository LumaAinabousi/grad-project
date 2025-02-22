import React from "react";
import { View, Text, StyleSheet } from "react-native";
import styles from "../styles";

const EndoProgressTracker = ({ label, value, maxValue }) => (
  <View
    style={[
      {
        marginBottom: 5,
      },
    ]}
  >
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.progressValue}>
      {value} / {maxValue}
    </Text>
    <View style={styles.progressBar}>
      <View
        style={[styles.progressFill, { width: `${(value / maxValue) * 100}%` }]}
      />
    </View>
  </View>
);

export default EndoProgressTracker;
