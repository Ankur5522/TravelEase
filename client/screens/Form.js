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
    Platform,
} from "react-native";
import upperPartBg from "../assets/upperPartBg.png";
import upperFormIcon from "../assets/upperFormIcon.png";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createGroup } from "../actions/groupActions";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Form = ({ navigation }) => {
    const [date, setDate] = useState(new Date());
    const [formData, setFormData] = useState({
        from: "",
        to: "",
        time: new Date(),
        seatVacant: 0,
    });
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === "ios");
        setDate(currentDate);
        setFormData({ ...formData, time: currentDate });
    };

    const handleChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleSubmit = async () => {
        if (
            formData.from === "" ||
            formData.to === "" ||
            formData.time === "" ||
            formData.seatVacant === 0
        ) {
            alert("Please fill all the fields");
            return;
        }
        const JSONdata = await AsyncStorage.getItem("user");
        const user = JSON.parse(JSONdata);
        formData.owner = user._id;
        dispatch(createGroup({ ...formData, owner: user._id }))
            .unwrap()
            .then((res) => {
                navigation.navigate("Trips");
            })
            .catch((err) => {
                alert("Error Creating Group" + err.message);
            });
    };

    return (
        <View style={styles.container}>
            <View style={styles.upperPart}>
                <ImageBackground
                    source={upperPartBg}
                    style={{ width: "110%", minHeight: "35%"}}
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
                                    onChangeText={(text) =>
                                        handleChange("from", text)
                                    }
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
                                    onChangeText={(text) =>
                                        handleChange("to", text)
                                    }
                                />
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            <View style={styles.lowerPart}>
                <View
                    style={[
                        styles.timeContainer,
                        {
                            borderBottomWidth: 1,
                            borderBottomColor: "#D8D8D84F",
                        },
                    ]}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <MaterialIcons
                            name="access-time"
                            size={32}
                            color="black"
                        />
                        <Text
                            style={{
                                marginLeft: 5,
                                fontSize: 18,
                                fontWeight: "bold",
                            }}
                        >
                            Time
                        </Text>
                    </View>
                    {show && (
                        <DateTimePicker
                            value={date}
                            mode="time"
                            is24Hour={true}
                            display="spinner"
                            onChange={onChange}
                        />
                    )}
                    <Text
                        onPress={() => setShow(true)}
                        style={{
                            fontSize: 16,
                            fontWeight: "bold",
                        }}
                    >
                        {date.toLocaleTimeString()}
                    </Text>
                </View>
                <View style={styles.timeContainer}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <MaterialCommunityIcons
                            name="account-outline"
                            size={34}
                            color="black"
                        />
                        <Text
                            style={{
                                marginLeft: 5,
                                fontSize: 18,
                                fontWeight: "bold",
                            }}
                        >
                            Seats Vacant
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Entypo
                            name="minus"
                            size={28}
                            color="black"
                            onPress={() => {
                                setFormData({
                                    ...formData,
                                    seatVacant:
                                        formData.seatVacant > 0
                                            ? formData.seatVacant - 1
                                            : 0,
                                });
                            }}
                        />
                        <TextInput
                            style={{
                                fontSize: 22,
                                textAlign: "center",
                                fontWeight: "bold",
                                marginHorizontal: 3,
                            }}
                            value={formData.seatVacant.toString()}
                            onChangeText={(value) => {
                                if (!isNaN(value)) {
                                    setFormData({
                                        ...formData,
                                        seatVacant: parseInt(value),
                                    });
                                }
                            }}
                            keyboardType="numeric"
                        />
                        <Entypo
                            name="plus"
                            size={28}
                            color="black"
                            onPress={() =>
                                setFormData({
                                    ...formData,
                                    seatVacant: formData.seatVacant + 1,
                                })
                            }
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={handleSubmit}>
                    <View style={styles.offerRideButton}>
                        <Text
                            style={{
                                color: "white",
                                fontSize: 18,
                                fontWeight: "bold",
                                marginRight: 10,
                            }}
                        >
                            Offer Ride
                        </Text>
                        <AntDesign name="right" size={18} color="white" />
                    </View>
                </TouchableOpacity>
            </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    upperPart: {
        flex: 1,
        backgroundColor: "lightblue",
        position: "fixed",
        zIndex: 999,
        minHeight: "33%",
        maxHeight: "33%",
    },
    upperFormContainer: {
        marginTop: 30,
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
        marginTop: 14,
        alignSelf: "left",
    },
    upperInputContainer: {
        flex: 1,
        flexDirection: "row",
        paddingLeft: 10,
        alignItems: "center",
    },
    lowerPart: {
        justifyContent: "flex-start",
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
    timeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 30,
        height: 60,
        marginTop: 10,
        position: "fixed",
    },
    offerRideButton: {
        flexDirection: "row",
        backgroundColor: "#1D4550",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 30,
        borderRadius: 10,
        marginTop: 30,
    },
});

export default Form;
