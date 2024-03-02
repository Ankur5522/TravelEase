import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TextInput,
    Image,
    TouchableOpacity,
    Animated,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import upperPartBg from "../assets/upperPartBg.png";
import upperFormIcon from "../assets/upperFormIcon.png";

const Home = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [sliderAnimation] = useState(new Animated.Value(0));

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        Animated.timing(sliderAnimation, {
            toValue: option === "offer" ? 0 : 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    return (
            <View style={styles.container}>
            <View style={styles.upperPart}>
                <ImageBackground
                    source={upperPartBg}
                    style={{ width: "110%", height: "100%" }}
                >
                    <View style={styles.upperFormContainer}>
                        <Text style={styles.upperTextName}>Hi Name</Text>
                        <Text style={styles.upperText}>
                            Lets explore some rides
                        </Text>
                        <View style={styles.upperForm}>
                            <View style={styles.upperInputContainer}>
                                <Image
                                    source={upperFormIcon}
                                    style={{
                                        width: 34,
                                        height: 34,
                                        marginRight: 14,
                                    }}
                                />
                                <TextInput
                                    placeholder="Leaving From"
                                    style={{
                                        fontSize: 15,
                                        fontWeight: "700",
                                        width: "100%",
                                    }}
                                />
                            </View>
                            <View style={styles.upperInputContainer}>
                                <Image
                                    source={upperFormIcon}
                                    style={{
                                        width: 34,
                                        height: 34,
                                        marginRight: 14,
                                    }}
                                />
                                <TextInput
                                    placeholder="Going To"
                                    style={{
                                        fontSize: 15,
                                        fontWeight: "700",
                                        width: "100%",
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 2}}>
                <View style={styles.lowerPart}>
                    <View style={styles.optionContainer}>
                        <TouchableOpacity
                            onPress={() => handleOptionSelect("offer")}
                            style={{ width: "50%", alignItems: "center"}}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    selectedOption === "offer" &&
                                        styles.selectedOption,
                                ]}
                            >
                                Offer Ride
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleOptionSelect("request")}
                            style={{ width: "50%", alignItems: "center"}}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    selectedOption === "request" &&
                                        styles.selectedOption,
                                ]}
                            >
                                Request Ride
                            </Text>
                        </TouchableOpacity>
                        <Animated.View
                            style={[
                                styles.slider,
                                {
                                    left: sliderAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ["0%", "50%"],
                                    }),
                                },
                            ]}
                        />
                    </View>
                    {selectedOption && (
                        <View style={styles.selectedContent}>
                            <Text>You selected: {selectedOption}</Text>
                            {/* Add your content for the selected option here */}
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    upperPart: {
        flex: 1.3,
        backgroundColor: "lightblue",
    },
    upperFormContainer: {
        marginTop: 110,
        paddingLeft: 19,
        paddingRight: 19,
    },
    upperTextName: {
        fontSize: 24,
        fontWeight: "500",
        color: "#EAEAEA",
    },
    upperText: {
        fontSize: 26,
        fontWeight: "900",
        color: "#EAEAEA",
    },
    upperForm: {
        backgroundColor: "white",
        width: "90%",
        height: 113,
        borderRadius: 17,
        marginTop: 16,
        alignSelf: "left",
    },
    upperInputContainer: {
        flex: 1,
        flexDirection: "row",
        paddingLeft: 10,
        alignItems: "center",
    },
    lowerPart: {
        flex: 2,
    },
    optionContainer: {
        flexDirection: "row",
        backgroundColor: "#C0C0C040",
        height: 53,
        alignItems: "center",
    },
    optionText: {
        marginRight: 20,
        fontSize: 18,
        color: "black",
    },
    selectedOption: {
        fontWeight: "bold",
    },
    slider: {
        position: "absolute",
        bottom: 1,
        width: "50%",
        height: 3,
        backgroundColor: "#858585",
    },
    selectedContent: {
        backgroundColor: "white",
        height: "100%"
    },
});

export default Home;
