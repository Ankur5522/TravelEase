import React, { useState, useRef } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useDispatch } from "react-redux";
import { useSignUp } from "@clerk/clerk-expo";
import { Link } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../actions/userActions";

const Login = () => {
    const [formData, setFormData] = useState({ phoneNumber: "", password: "" });
    const [otpVisible, setOtpVisible] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [errorMsg, setErrorMsg] = useState(null);
    const dispatch = useDispatch();
    const { signUp, setActive} = useSignUp();
    const otpInputs = useRef([]);

    const handleLogin = async () => {
        try {
            const response = await dispatch(loginUser(formData));
            if(response.payload.error) {
                setErrorMsg(response.payload.error);
                return;
            }
            if (response && response.payload.user) {
                await signUp.create({
                    phoneNumber: `+91${formData.phoneNumber}`,
                });
                await signUp.preparePhoneNumberVerification();
                setOtpVisible(true);
            } else {
                setErrorMsg("Invalid phone number or password");
            }
        } catch (error) {
            console.log(error)
            setErrorMsg("An error occurred while logging in");
        }
    };
    

    const handleVerifyOTP = async () => {
        try {
            const newOtp = otp.join("");
            
            await signUp.attemptPhoneNumberVerification({
                code: newOtp,
            }).then( async (response) => {
                const res = await dispatch(loginUser(formData))
                if(res.payload && res.payload.user) {
                    const JSONvalue = JSON.stringify(res.payload.user);
                    await AsyncStorage.setItem("user", JSONvalue);
                }
            }).catch((error) => {
                setErrorMsg("Invalid OTP");
            });
            
            await setActive({session: signUp.createdSessionId});
        } catch (error) {
            console.error('Error verifying OTP:', error);
        }
    }

    const handleChangeOtp = (index, value) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        // If value is entered and there are more OTP inputs, focus on the next input
        if (value && index < otpInputs.current.length - 1) {
            otpInputs.current[index + 1].focus();
        }
    };

    const handleClick = () => {
        if (!otpVisible) {
            handleLogin();
        } else {
            handleVerifyOTP();
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome Back! Glad to</Text>
                <Text style={styles.subText}>see you Again!</Text>
            </View>
            <Text>{errorMsg}</Text>
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
                <TouchableOpacity>
                        <Text style={styles.forgotPassword}>Forget Password</Text>
                    </TouchableOpacity>
                {otpVisible && (
                    <View style={styles.otpContainer}>
                        {[...Array(6)].map((_, index) => (
                            <TextInput
                                ref={(ref) => (otpInputs.current[index] = ref)}
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
            </View>
            <TouchableOpacity style={styles.buttonContainer} onPress={handleClick}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>{otpVisible ? "Verify OTP" : "Send OTP"}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.googleButtonContainer]}>
                <View style={styles.googleButton}>
                    <Text style={[styles.buttonText, {color: "#1D4550"}]}>Continue with Google</Text>
                </View>
            </TouchableOpacity>
            
                <View style={styles.signUpContainer}>
                    <Text style={{marginRight: 5, fontSize: 16}}>Don't have an account?</Text>
                    <TouchableOpacity>
                        <Link to="/Signup" style={{borderBottomWidth: 1}}>Sign Up</Link>
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
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
    },
    googleButtonContainer: {
        width: "100%",
        alignItems: "flex-start",
        borderBlockColor: "#1D4550",
        marginBottom: 15
    },
    googleButton: {
        width: "100%",
        borderRadius: 5,
        paddingVertical: 12,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "#1D4550",
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
