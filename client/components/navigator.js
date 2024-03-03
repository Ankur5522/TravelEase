import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import BottomTabNavigator from "./bottomTabNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorModal from "./errorModal";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Login";
import SignupScreen from "../screens/Signup";

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = ({ networkError, setNetworkError }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const userState = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const existingUser = await AsyncStorage.getItem("user");
        if (existingUser) {
          setUser(JSON.parse(existingUser));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userState]);

  if (loading) {
    return <Text>Fetching data</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <ErrorModal visible={networkError} onClose={() => setNetworkError(false)} />
      {user ? <BottomTabNavigator /> : <AuthStack />}
    </View>
  );
};

export default TabNavigator;
