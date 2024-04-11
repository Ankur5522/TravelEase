import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeNavigator from './HomeNavigator';
import Transactions from '../screens/Transactions';
import MyGroupNavigator from './myGroupNavigator';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
            <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    width: "100%",
                    elevation: 10,
                    borderRadius: 10,
                    padding: 10,
                    borderTopWidth: 0,
                    backgroundColor: 'white',
                },
                headerShown: false
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeNavigator}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="MyGroups"
                component={MyGroupNavigator}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Transactions"
                component={Transactions}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default BottomTabNavigator;
