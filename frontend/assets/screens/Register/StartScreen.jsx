import { useNavigation } from "@react-navigation/native";
import { Pressable, Text, View, Image } from "react-native";
import styles from "../../styles.js";

export default function StartScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.loadingcontainer}>
      <Image
        source={require("../../images/Logo.png")}
        style={styles.loadinglogo}
      />
      <Text style={styles.welcomeText}>Welcome to Sugarak!</Text>
      <Pressable
        onPress={() => navigation.navigate("SignUp")}
        style={styles.whitebutton}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate("SignIn")}
        style={styles.whitebutton}
      >
        <Text style={styles.buttonText}> Sign In </Text>
      </Pressable>
    </View>
  );
}
