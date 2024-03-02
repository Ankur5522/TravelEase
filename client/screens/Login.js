import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { useDispatch } from "react-redux";
import { loginUser } from "../actions/userActions";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Login = () => {
    const [formData, setFormData] = useState({ phoneNumber: "", password: "" });
    const [errorMsg, setErrorMsg] = useState(null);
    const dispatch = useDispatch();

    const handleLogin = async () => {
        const response = await dispatch(loginUser(formData));
        if(response.payload && response.payload.user) {
            const JSONvalue = JSON.stringify(response.payload.user);
            await AsyncStorage.setItem("user", JSONvalue);
        }
        if(response.error) {
          console.log(response.error)
            setErrorMsg("Invalid phone number or password");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.appTitle}>TravelEase</Text>
            <Text style={styles.error}>{errorMsg ? errorMsg : null}</Text>
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChangeText={(text) =>
                    setFormData({ ...formData, phoneNumber: text })
                }
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) =>
                    setFormData({ ...formData, password: text })
                }
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    appTitle: {
        fontSize: 30,
        marginBottom: 30,
    },
    error: {
        color: "red",
        marginBottom: 10,
        fontSize: 16,
    }
});

export default Login;
