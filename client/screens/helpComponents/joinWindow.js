import React, { useEffect, useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { verifyCode } from "../../actions/groupActions";

const JoinWindow = ({ setShowJoinWindow }) => {
    const [code, setCode] = useState("");
    const [userId, setUserId] = useState("");
    const groups = useSelector((state) => state.groups.groups);
    const errorMsg = useSelector((state) => state.groups.error);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            const JSONUser = await AsyncStorage.getItem("user");
            const user = JSON.parse(JSONUser);
            setUserId(user._id);
        };
        fetchUser();
    }, []);

    const handleCodeChange = (text) => {
        setCode(text);
    };

    handleJoin = () => {
        dispatch(verifyCode({ code, userId }))
            .unwrap()
            .then((response) => {
                setShowJoinWindow(false);
            })
            .catch((error) => {
                let errorMsg = 'An error occurred';
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
                onPress={() => setShowJoinWindow(false)}
            />
            <Text
                style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}
            >
                Join Group
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Enter six-digit code"
                keyboardType="numeric"
                maxLength={6}
                value={code}
                onChangeText={handleCodeChange}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleJoin}>
                    <Text style={{ fontSize: 20, fontWeight: "500" }}>
                        Join
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

export default JoinWindow;
