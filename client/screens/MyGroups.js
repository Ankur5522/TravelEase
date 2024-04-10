import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyGroups = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Groups</Text>
      <View></View>
    </View>
  );
};

export default MyGroups;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
  }
});
