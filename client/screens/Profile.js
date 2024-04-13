import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { View, Text, Touchable, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { logout } from '../Reducers/userReducer';
import { useDispatch } from 'react-redux';

const Profile = () => {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    dispatch(logout());
  }

  return (
    <View>
      <Text>Welcome to the Profile screen!</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  logoutButton: {
    alignItems: 'center',
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
  },
});