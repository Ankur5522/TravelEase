import { StyleSheet, View, Text } from "react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Reducers/userReducer";
import groupReducer from "./Reducers/groupReducer";
import TabNavigator from "./components/navigator";
import { NavigationContainer } from "@react-navigation/native";
import Constants from "expo-constants";
import { ClerkProvider } from "@clerk/clerk-expo";
import NetInfo from "@react-native-community/netinfo";
import { useState, useEffect } from "react";
import SplashScreen from "./screens/SplashScreen";

const store = configureStore({
  reducer: {
    user: userReducer,
    groups: groupReducer,
  },
});

export default function App() {
  const [networkError, setNetworkError] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isInternetReachable) {
        setNetworkError(true);
      } else {
        setNetworkError(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <ClerkProvider
      publishableKey={Constants.expoConfig.extra.clerkPublishableKey}
    >
      <NavigationContainer>
        <Provider store={store}>
          <View style={styles.container}>
            <TabNavigator
              networkError={networkError}
              setNetworkError={setNetworkError}
            />
            {networkError && (
              <Text style={styles.error}>Network connection error</Text>
            )}
          </View>
        </Provider>
      </NavigationContainer>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 10,
  },
  error: {
    position: "absolute",
    top: Constants.statusBarHeight + 15,
    left: 0,
    right: 0,
    backgroundColor: "red",
    color: "black",
    textAlign: "center",
    padding: 10,
    zIndex: 999,
  },
});
