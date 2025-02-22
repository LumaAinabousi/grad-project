import { Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles";
export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome!</Text>
    </View>
  );
}
