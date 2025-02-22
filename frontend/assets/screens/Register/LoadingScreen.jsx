import React from "react";
import { View, Image } from "react-native";
import styles from "../../styles";

const LoadingScreen = () => {
  return (
    <View style={styles.loadingcontainer}>
      <Image
        source={require("../../images/Logo.png")}
        style={styles.loadinglogo}
      />
    </View>
  );
};

export default LoadingScreen;
