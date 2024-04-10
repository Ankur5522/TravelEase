import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../screens/Profile';
import Trips from '../screens/Home';
import Form from '../screens/Form';
import Home from '../screens/Home';

const Stack = createStackNavigator();

const HomeNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Trips" component={Home} options={{ headerShown: false }}/> 
            <Stack.Screen name="Form" component={Form} options={{ headerShown: false }}/>
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
        </Stack.Navigator>
    );
};

export default HomeNavigator;