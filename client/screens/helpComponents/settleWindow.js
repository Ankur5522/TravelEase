import React, { useEffect, useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { splitAmount } from "../../actions/groupActions";


const SettleWindow = ({ setShowSettleWindow, userId, groupId }) => {
    const [amount, setAmount] = useState("");
    const dispatch = useDispatch();

    const handleAmountChange = (text) => {
        setAmount(text);
    };

    handleSplit = () => {
        dispatch(splitAmount({ amount, userId, groupId }))
            .unwrap()
            .then((res) => {
                setShowSettleWindow(false);
            })
            .catch((error) => {
                console.log('error', error)
                let errorMsg = "An error occurred";
                if (error && error.error) {
                    errorMsg = error.error;
                }
                alert(errorMsg);
            });
    }; 

    return (
        <View style={styles.container}>
            <Entypo
                name="cross"
                size={32}
                color="black"
                style={styles.crossIcon}
                onPress={() => setShowSettleWindow(false)}
            />
            <Text
                style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}
            >
                Fare Amount
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Enter the amount"
                keyboardType="numeric"
                maxLength={6}
                value={amount}
                onChangeText={handleAmountChange}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSplit}>
                    <Text style={{ fontSize: 20, fontWeight: "500" }}>
                        Split
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    crossIcon: {
        position: "absolute",
        right: 16,
        top: 16,
    },
    container: {
        position: "absolute",
        left: 20,
        right: 20,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        elevation: 4,
        zIndex: 999,
        alignItems: "center",
        paddingVertical: 15,
    },
    input: {
        height: 40,
        borderBottomColor: "gray",
        borderWidth: 0,
        borderBottomWidth: 1,
        paddingHorizontal: 10,
        fontSize: 18,
        width: "90%",
    },
    buttonContainer: {
        alignItems: "center",
        marginTop: 15,
        width: "100%",
    },
    button: {
        backgroundColor: "lightblue",
        paddingVertical: 6,
        paddingHorizontal: 22,
        borderRadius: 10,
    },
});

export default SettleWindow;
