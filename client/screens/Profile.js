import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Reducers/userReducer';
import UserAvatar from 'react-native-user-avatar';
import { enterUpi } from '../actions/userActions';

const Profile = () => {
  const [upi, setUpi] = useState('');
  const [user, setUser] = useState({});
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    dispatch(logout());
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await AsyncStorage.getItem('user');
      if(user) {
        newUser = JSON.parse(user);
        setUser(newUser);
      }
    }
    fetchUser();
  }, []);

  const handleSubmitUPI = async () => {
    if(!upi) return alert('Please enter UPI ID')
    if(!upi.includes('@')) return alert('Invalid UPI ID');
    const response = await enterUpi({upi, userId: user._id});
    if(!response.message) return alert('Error adding UPI ID');
    console.log(response);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.profileText}>Profile</Text>
      <View style={styles.profileContainer}>
        <ImageBackground source={require("../assets/upperPartBg.png")} imageStyle={{borderTopRightRadius: 20, borderTopLeftRadius: 20}} style={styles.imageBackground}>
          <UserAvatar
            size={140}
            name="john doe"
            style={styles.avatar}
          />
        </ImageBackground>
        <Text style={styles.userName}>{user.name}</Text>
        <View style={styles.upiContainer}>
          {user.upi || upi ? (
            <Text style={{fontSize: 18}}>UPI: {user.upi || upi}</Text>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter UPI ID"
                value={upi}
                onChangeText={setUpi}
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmitUPI}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Help</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 20,
  },
  profileText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  profileContainer: {
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    marginTop: 20,
    paddingBottom: 20,
    elevation: 5,
  },
  imageBackground: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    zIndex: 1,
  },
  userName: {
    fontSize: 28,
    marginTop: 10,
  },
  upiContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 10,
    fontSize: 18,
  },
  submitButton: {
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginRight: 10
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#1D4550',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "90%",
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
