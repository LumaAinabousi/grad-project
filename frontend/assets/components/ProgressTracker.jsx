import React from "react";
import { View, Text, StyleSheet } from "react-native";
import styles from "../styles";

const ProgressTracker = ({ label, value, maxValue }) => (
  <View style={[styles.progressContainer, {}]}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.progressValue}>
      {value} / {maxValue}
    </Text>
    <View style={styles.progressBar}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${Math.min((value / maxValue) * 100, 100)}%`,
            backgroundColor: value > maxValue ? "red" : "#C2E0F5",
          },
        ]}
      />
    </View>
  </View>
);

export default ProgressTracker;
