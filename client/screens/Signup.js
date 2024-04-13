import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useDispatch } from "react-redux";
import { checkUser, signupUser } from "../actions/userActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "@react-navigation/native";

const SignupScreen = () => {
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
    });
    const { signUp, setActive } = useSignUp();
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
        const response = handleSendOTP(formData.phoneNumber);
    };

    const handleSendOTP = async (phoneNo) => {
        try {
            if (phoneNo.length !== 10) {
                setError("Invalid phone number");
                return;
            }

            const response = await checkUser({ phoneNumber: phoneNo });
            if (response.error) {
                alert(response.error);
                return;
            }
            await signUp.create({
                phoneNumber: `+91${phoneNo}`,
            });
            await signUp.preparePhoneNumberVerification();
            setOtpSent(!otpSent);
        } catch (error) {
            console.error("Error sending OTP:", error);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            await signUp
                .attemptPhoneNumberVerification({
                    code: otp,
                })
                .then(async (res) => {
                    const response = await dispatch(signupUser(formData));
                    if (response.error) {
                        alert(response.error);
                        return;
                    }
                    const JSONvalue = JSON.stringify(response.payload.user);
                    await AsyncStorage.setItem("user", JSONvalue);
                    await setActive({ session: signUp.createdSessionId });
                });
        } catch (error) {
            alert("Error verifying OTP:", error);
        }
    };

    return !otpSent ? (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Hello!! Register here to</Text>
                <Text style={styles.subText}>get started!</Text>
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
            <TextInput
                style={styles.input}
                placeholder="Enter your name"
                onChangeText={(value) => handleInputChange("name", value)}
                value={formData.name}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                onChangeText={(value) =>
                    handleInputChange("phoneNumber", value)
                }
                value={formData.phoneNumber}
                keyboardType="phone-pad"
            />

            <TextInput
                style={styles.input}
                placeholder="Enter your password"
                onChangeText={(value) => handleInputChange("password", value)}
                value={formData.password}
                secureTextEntry={true}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                onChangeText={(value) =>
                    handleInputChange("confirmPassword", value)
                }
                value={formData.confirmPassword}
                secureTextEntry={true}
            />

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.googleButtonContainer}>
                <View style={styles.googleButton}>
                    <Text style={[styles.buttonText, { color: "#1D4550" }]}>
                        Continue with Google
                    </Text>
                </View>
            </TouchableOpacity>
            <View
                style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "center",
                }}
            >
                <Text style={{ fontSize: 16, marginRight: 5 }}>
                    Already have an account?
                </Text>
                <TouchableOpacity>
                    <Link to="/Login" style={{ borderBottomWidth: 1 }}>
                        Login
                    </Link>
                </TouchableOpacity>
            </View>
        </View>
    ) : (
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
        marginTop: "15%",
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
    label: {
        marginBottom: 5,
    },
    input: {
        width: "100%",
        height: 45,
        borderColor: "#4CAF85",
        marginBottom: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: "#F6F6F6",
        marginBottom: 15,
    },
    error: {
        color: "red",
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
        backgroundColor: "#1D4550",
        width: "100%",
        borderRadius: 5,
        paddingVertical: 12,
        marginBottom: 20,
    },
    googleButtonContainer: {
        width: "100%",
        alignItems: "flex-start",
        borderBlockColor: "#1D4550",
    },
    googleButton: {
        width: "100%",
        borderRadius: 5,
        paddingVertical: 12,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "#1D4550",
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default SignupScreen;
