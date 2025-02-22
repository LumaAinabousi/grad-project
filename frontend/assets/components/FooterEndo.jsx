import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import styles from "../styles";

const FooterEndo = ({}) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
        backgroundColor: "#C2E0F5",
        borderTopWidth: 1,
        borderTopColor: "#C2E0F5",
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("EndoHome")}>
        <Icon
          name="home"
          size={25}
          style={{ color: "black", paddingBottom: 10 }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("EndoConnection")}>
        <Icon
          name="people"
          size={25}
          style={{ color: "black", paddingBottom: 10 }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("EndoProfile")}>
        <Icon
          name="person"
          size={25}
          style={{ color: "black", paddingBottom: 10 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default FooterEndo;
