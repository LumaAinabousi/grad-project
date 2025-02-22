import React from 'react';
import { Image } from 'react-native';
import styles from '../styles';

const Logo = () => (
  <Image
    source={require('../images/small_Logo.png')}
    style={styles.logo}
    resizeMode="contain"
  />
);

export default Logo;
