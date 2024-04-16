import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text, Animated } from 'react-native';

const fadeIn = new Animated.Value(0);
const SplashScreen = () => {

  useEffect(() => {
    // Start the fade in animation
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    })
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, { opacity: fadeIn }]}>
        Travelease
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    // Apply translation for horizontal movement
    transform: [
      {
        translateX: fadeIn.interpolate({
          inputRange: [0, 1],
          outputRange: [-100, 0], // Move from left (-100) to right (0)
        }),
      },
    ],
  },
});

export default SplashScreen;
