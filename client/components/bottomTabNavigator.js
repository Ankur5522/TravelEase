import React, { useState } from 'react';
import { View, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

import HomeNavigator from './HomeNavigator';
import Transactions from '../screens/Transactions';
import MyGroupNavigator from './myGroupNavigator';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          width: '80%',
          position: 'absolute',
          left: '10%',
          bottom: 10,
          elevation: 10,
          borderRadius: 30,
          padding: 10,
          borderTopWidth: 0,
          paddingBottom: 9,
          backgroundColor: '#f2f2f2',
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'grey',
        tabBarShowLabel: false,
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      {/* Slide buttons in from left and right on press */}
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={{ position: 'relative' }}>
              <Entypo name="home" size={24} color={color} />
            </View>
          ),
          tabBarPressColor: 'green',
          tabBarPress: () => handleTabPress('Home'),
          tabBarButtonContainerStyle: {
            opacity: 0, // Hide button container visually
          },
        }}
      />

      <Tab.Screen
        name="MyGroups"
        component={MyGroupNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={{ position: 'relative' }}>
              <FontAwesome6 name="people-group" size={24} color={color} />
            </View>
          ),
          tabBarPressColor: '#4c948c',
          tabBarButtonContainerStyle: {
            opacity: 1, // Restore container opacity for hit detection
          },
        }}
      />

      <Tab.Screen
        name="Transactions"
        component={Transactions}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={{ position: 'relative' }}>
              <Ionicons name="receipt" size={24} color={color} />
            </View>
          ),
          tabBarPressColor: 'black',
          tabBarButtonContainerStyle: {
            opacity: 1,
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
