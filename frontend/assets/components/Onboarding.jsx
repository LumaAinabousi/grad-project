import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles';


const Onboarding = ({ image, title, description, onSkip }) => {
  return (
    <View style={styles.onboardingContainer}>
    <Image source={image} style={styles.onboardingImage} />
    <Text style={styles.onboardingTitle}>{title}</Text>
    <Text style={styles.onboardingDescription}>{description}</Text>
    <TouchableOpacity onPress={onSkip} style={styles.onboardingButton}>
      <Text style={styles.buttonText}>Lets Go ...</Text>
    </TouchableOpacity>
  </View>
  );
};

export default Onboarding;