import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useDispatch } from "react-redux";
import { loginUser } from "../actions/userActions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
    const [formData, setFormData] = useState({ phoneNumber: "", password: "" });
    const [otpVisible, setOtpVisible] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [errorMsg, setErrorMsg] = useState(null);
    const dispatch = useDispatch();

    const handleLogin = async () => {
        if (!otpVisible) {
            setOtpVisible(true);
            return;
        }
        
        const otpValue = otp.join("");
        const response = await dispatch(loginUser({ ...formData, otp: otpValue }));
        if(response.payload && response.payload.user) {
            const JSONvalue = JSON.stringify(response.payload.user);
            await AsyncStorage.setItem("user", JSONvalue);
        }
        if(response.error) {
            setErrorMsg("Invalid phone number or password");
        }
    };

    const handleChangeOtp = (index, value) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome Back! Glad to</Text>
                <Text style={styles.subText}>see you Again!</Text>
            </View>
            <View style={styles.inputContainer}>
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
                {otpVisible && (
                    <View style={styles.otpContainer}>
                        {[...Array(6)].map((_, index) => (
                            <TextInput
                                key={index}
                                style={styles.otpInput}
                                placeholder="•"
                                maxLength={1}
                                keyboardType="numeric"
                                value={otp[index]}
                                onChangeText={(text) => handleChangeOtp(index, text)}
                            />
                        ))}
                    </View>
                )}
                    <TouchableOpacity>
                        <Text style={styles.forgotPassword}>Forget Password</Text>
                    </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>{otpVisible ? "Verify OTP" : "Send OTP"}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonContainer}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>Continue with Google</Text>
                </View>
            </TouchableOpacity>
            
                <View style={styles.signUpContainer}>
                    <Text style={{marginRight: 5}}>Don't have an account?</Text>
                    <TouchableOpacity>
                        <Text style={styles.signUpLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: 16,
        backgroundColor: "white",
    },
    header: {
        marginTop:'15%',
        alignItems: "flex-start",
        marginBottom: 35,
    },
    welcomeText: {
        fontSize: 35,
        fontWeight: "bold",
    },
    subText: {
        fontSize: 35,
        fontWeight: "bold",
    },
    inputContainer: {
        width: "100%",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 45,
        borderColor: "#4CAF85",
        marginBottom: 12,
        paddingHorizontal: 16,
        borderRadius: 5,
        backgroundColor: "#F6F6F6",
    },
    forgotPassword: {
        textAlign: "right",
        color: "#296962",
        textDecorationLine: "underline",
        marginBottom:30,
    },
    buttonContainer: {
        width: "100%",
        alignItems: "flex-start",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#1D4550",
        width: "100%",
        borderRadius: 5,
        paddingVertical: 12,
        marginBottom:20,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
    },
    signUpContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        bottom: '5%',
        width: "100%",
    },
    signUpLink: {
        color: "#4CAF85",
        textDecorationLine: "underline",
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 12,
    },
    otpInput: {
        width: "15%",
        height: 45,
        borderColor: "#4CAF85",
        paddingHorizontal: 16,
        borderRadius: 5,
        backgroundColor: "#F6F6F6",
        textAlign: "center",
    },
});

export default Login;
