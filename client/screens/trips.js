import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const Trips = () => {
  return (
    <View styles={styles.container}>
        <View style={styles.searchContainer}>
          
        </View>
        <View style={styles.tripsContainer}>

        </View>
    </View>
  )
}

export default Trips;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 5,
    elevation: 5
  }
});

