import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ChatWindow from "../screens/ChatWindow";
import MyGroups from "../screens/MyGroups";

const Stack = createStackNavigator();

const MyGroupNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="MyGroup" component={MyGroups} />
            <Stack.Screen name="ChatWindow" component={ChatWindow} />
        </Stack.Navigator>
    );
};

export default MyGroupNavigator;
