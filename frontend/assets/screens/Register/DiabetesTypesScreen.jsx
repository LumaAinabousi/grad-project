import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../../styles";

const DiabetesTypeScreen = ({ navigation }) => {
  return (
    <View
      style={[
        styles.container,
        {
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: "20%",
        },
      ]}
    >
      {/* <Text
        style={[
          styles.title,
          {
            textAlign: "center",
            fontSize: 24,
            marginBottom: 15,
          },
        ]}
      >
        Diabetes Types
      </Text> */}
      <View style={styles.progressContainer}>
        <Text
          style={[
            styles.typeDescriptionTitle,
            { textAlign: "center", fontSize: 20 },
          ]}
        >
          Type 1
        </Text>
        <Text
          style={[
            styles.typeDescriptionText,
            { fontSize: 15.5, textAlign: "center" },
          ]}
        >
          Type 1 diabetes is an autoimmune condition where the body's immune
          system attacks the insulin-producing cells in the pancreas.
          Individuals with Type 1 diabetes need insulin therapy for life.
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <Text
          style={[
            styles.typeDescriptionTitle,
            { textAlign: "center", fontSize: 20 },
          ]}
        >
          Type 2
        </Text>
        <Text
          style={[
            styles.typeDescriptionText,
            { fontSize: 15.5, textAlign: "center", marginTop: 10 },
          ]}
        >
          Type 2 diabetes occurs when the body becomes resistant to insulin or
          when the pancreas doesn't produce enough insulin. It is often managed
          through lifestyle changes, medications, and sometimes insulin therapy.
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DiabetesTypeScreen;
