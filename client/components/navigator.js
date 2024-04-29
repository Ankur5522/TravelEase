import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import BottomTabNavigator from "./bottomTabNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorModal from "./errorModal";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Login";
import SignupScreen from "../screens/Signup";
import { useDispatch } from "react-redux";

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
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const existingUser = await AsyncStorage.getItem("user");
        setUser(JSON.parse(existingUser));
        if (existingUser) {
          dispatch({ type: "user/setUser", payload: JSON.parse(existingUser) });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } 
    };

    fetchUser();
  }, [userState]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.someText}>Travel<Text style={styles.easeText}>Ease</Text></Text>
      </View>
    )
  }
  
  return (
    <View style={{ flex: 1 }}>
      <ErrorModal visible={networkError} onClose={() => setNetworkError(false)} />
      {user  ? <BottomTabNavigator /> : <AuthStack />}
    </View>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black"
  },
  someText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white"
  },
  easeText: {
    color: "#4c948c",
  }
});