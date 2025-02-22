import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import Onboarding from "../../components/Onboarding";
import styles from "../../styles";

import { Dimensions } from "react-native"; //this line +

const onboardingData = [
  {
    image: require("../../images/BloodSugar.jpg"),
    title: " Blood Sugar Logging",
    description: "You will easily track your Blood Sugar.",
  },
  {
    image: require("../../images/Meals.png"),
    title: "Food Logging",
    description: "You will track your food and activities.",
  },
  {
    image: require("../../images/Medication.png"),
    title: "Medication Logging",
    description: "You will track your Insulin and medication.",
  },
  {
    image: require("../../images/Reports.png"),
    title: "Reports Generator",
    description: "You will get continuous medical reports.",
  },
];

const Dots = ({ currentScreen }) => {
  return (
    <View style={styles.dotsContainer}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[styles.dot, currentScreen === index && styles.activeDot]}
        />
      ))}
    </View>
  );
};

const OnboardingScreens = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState(0);

  const handleSkip = () => navigation.replace("Sugarak");

  return (
    <View style={styles.onboardingWrapper}>
      <ScrollView
        horizontal
        pagingEnabled
        onScroll={(e) => {
          const pageIndex = Math.round(
            e.nativeEvent.contentOffset.x /
              e.nativeEvent.layoutMeasurement.width
          );
          setCurrentScreen(pageIndex);
          //HERE ALSOO
        }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          width: Dimensions.get("window").width * onboardingData.length,
        }}
      >
        {onboardingData.map((item, index) => (
          <Onboarding
            key={index}
            image={item.image}
            title={item.title}
            description={item.description}
            onSkip={handleSkip}
          />
        ))}
      </ScrollView>
      <Dots currentScreen={currentScreen} />
    </View>
  );
};

export default OnboardingScreens;
