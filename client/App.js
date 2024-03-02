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

const store = configureStore({
  reducer: {
    user: userReducer,
    groups: groupReducer,
  },
});

export default function App() {
  const [networkError, setNetworkError] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
        console.log(state)
      if (!state.isInternetReachable) {
        setNetworkError(false);
      } else {
        setNetworkError(true);
      }
    })
    unsubscribe();
  }, []);
  console.log(networkError)
  return (
    <ClerkProvider
      publishableKey={Constants.expoConfig.extra.clerkPublishableKey}
    >
      <NavigationContainer>
        <Provider store={store}>
          <View style={styles.container}>
            <TabNavigator networkError={networkError} setNetworkError={setNetworkError}/>
          </View>
        </Provider>
      </NavigationContainer>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  error: {
    position: "absolute",
    backgroundColor: "red",
    top: Constants.statusBarHeight + 10,
    left: 0,
    right: 0,
    backgroundColor: "red",
    color: "black",
    textAlign: "center",
    padding: 10,
    zIndex: 999
  },
});
