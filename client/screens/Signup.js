import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useDispatch } from "react-redux";
import { signupUser } from "../actions/userActions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignupScreen = () => {
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
    });
    const { signUp, setActive} = useSignUp();
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const handleInputChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleSignup = () => {
        const response = handleSendOTP(formData.phoneNumber)
    };

    const handleSendOTP = async (phoneNo) => {
        try {
            if (phoneNo.length !== 10) {
                setError("Invalid phone number");
                return;
            }
    
            const response = await fetch('http://10.0.2.2:5000/user/checkUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber: phoneNo }),
            });
    
            if (response.ok) {
                await signUp.create({
                    phoneNumber: `+91${phoneNo}`,
                });
                await signUp.preparePhoneNumberVerification();
                setOtpSent(!otpSent);
            } else {
                setError("Phone number already exists");
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            await signUp.attemptPhoneNumberVerification({
                code: otp,
            }).then( async (response) => {
                dispatch(signupUser(formData));
                if(response.payload && response.payload.user) {
                    const JSONvalue = JSON.stringify(response.payload.user);
                    await AsyncStorage.setItem("user", JSONvalue);
                }
            });
            
            await setActive({session: signUp.createdSessionId});
        } catch (error) {
            console.error('Error verifying OTP:', error);
        }
    }

    return (
        !otpSent ? (<View style={styles.container}>
            <Text style={styles.appTitle}>TravelEase</Text>
            {error && <Text style={styles.error}>{error}</Text>}
            <Text style={styles.label}>Name:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(value) => handleInputChange("name", value)}
                value={formData.name}
            />

            <Text style={styles.label}>Phone Number:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(value) =>
                    handleInputChange("phoneNumber", value)
                }
                value={formData.phoneNumber}
                keyboardType="phone-pad"
            />

            <Text style={styles.label}>Password:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(value) => handleInputChange("password", value)}
                value={formData.password}
                secureTextEntry={true}
            />

            <Text style={styles.label}>Confirm Password:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(value) =>
                    handleInputChange("confirmPassword", value)
                }
                value={formData.confirmPassword}
                secureTextEntry={true}
            />

            <Button title="Sign Up" onPress={handleSignup} />
        </View>) : (
            <View style={styles.otpContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={(value) => setOtp(value)}
                    value={formData.otp}
                    keyboardType="number-pad"
                />
                <Button title="Verify OTP" onPress={handleVerifyOTP} />
                <Button title="back" onPress={() => setOtpSent(!otpSent)} />
            </View>
        )
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    otpContainer: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    label: {
        marginBottom: 5,
    },
    input: {
        width: "100%",
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    appTitle: {
        fontSize: 30,
        marginBottom: 30,
        alignSelf: "center",
    },
    error: {
        color: "red",
        marginBottom: 10,
        alignSelf: "center",
    },
});

export default SignupScreen;
