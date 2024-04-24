// have to move current group to past group on basis of split confirmation

import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EvilIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { confirmGroup } from "../actions/groupActions";
import { useDispatch } from "react-redux";
import SettleWindow from "./helpComponents/settleWindow";

const MyGroups = ({ navigation }) => {
    const groups = useSelector((state) => state.groups.groups);
    const [currentGroups, setCurrentGroups] = useState([]);
    const [pastGroups, setPastGroups] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [showSettleWindow, setShowSettleWindow] = useState(false);
    const [pressedDetails, setPressedDetails] = useState({
        groupId: "",
        userId: "",
    });
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchGroups = async () => {
            const currentTime = new Date();
            const JSONdata = await AsyncStorage.getItem("user");
            const user = JSON.parse(JSONdata);
            setCurrentUser(user);
            const userGroups = groups.filter((group) =>
                group.members.includes(user._id)
            );
            const currentGroups = userGroups?.filter((group) => {
                return group.transactionId  === null
            });
            const pastGroups = userGroups?.filter(
                (group) => !currentGroups.includes(group) && group.confirmed
            );
            setCurrentGroups(currentGroups);
            setPastGroups(pastGroups);
        };
        fetchGroups();
    }, [groups]);

    const formatTime = (time) => {
        const timeDate = new Date(time);
        return timeDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatDate = (date) => {
        const timeDate = new Date(date);
        const options = { year: "numeric", month: "long", day: "numeric" };
        return timeDate.toLocaleDateString("en-US", options);
    };

    const handleConfirm = (id) => {
        dispatch(confirmGroup(id))
            .unwrap()
            .then(() => {
                alert("Group confirmed successfully");
            });
    };

    const handleSplitPress = ({ groupId, userId }) => {
        setPressedDetails({ groupId, userId });
        setShowSettleWindow(true);
    };

    return (
        <View style={styles.container}>
            {showSettleWindow && (
                <View style={styles.settleWindowContainer}>
                    <SettleWindow
                        setShowSettleWindow={setShowSettleWindow}
                        groupId={pressedDetails.groupId}
                        userId={pressedDetails.userId}
                    />
                </View>
            )}
            <Text style={styles.heading}>My Groups</Text>
            <View style={styles.currentGroupContainer}>
                <Text style={styles.currentText}>Current Groups</Text>
                <FlatList
                    data={currentGroups}
                    renderItem={({ item }) => (
                        <View style={styles.groupItem}>
                            <View style={styles.locationContainer}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <EvilIcons
                                        name="location"
                                        size={28}
                                        color="black"
                                    />
                                    <Text style={{ fontSize: 17 }}>
                                        {item.from}
                                    </Text>
                                </View>
                                <AntDesign
                                    name="arrowright"
                                    size={24}
                                    color="black"
                                />
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <EvilIcons
                                        name="location"
                                        size={28}
                                        color="black"
                                    />
                                    <Text style={{ fontSize: 17 }}>
                                        {item.to}
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    paddingRight: 10,
                                }}
                            >
                                <Text style={styles.timeText}>
                                    Dept Time: {formatTime(item.time)}
                                </Text>
                                <Text
                                    style={{ fontSize: 18, fontWeight: "bold" }}
                                >
                                    {item.code || "Not available"}
                                </Text>
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.viewButton}
                                    onPress={() =>
                                        navigation.navigate("ChatWindow", {
                                            groupId: item._id,
                                            userId: currentUser._id,
                                        })
                                    }
                                >
                                    <Text style={styles.buttonText}>View</Text>
                                </TouchableOpacity>
                                {currentUser._id === item.ownerId &&
                                    !item.confirmed && (
                                        <TouchableOpacity
                                            style={styles.confirmButton}
                                            onPress={() =>
                                                handleConfirm(item._id)
                                            }
                                        >
                                            <Text style={styles.buttonText}>
                                                Confirm
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                {item.confirmed && (
                                    <TouchableOpacity
                                        style={styles.confirmButton}
                                        onPress={() => handleSplitPress({
                                            groupId: item._id,
                                            userId: currentUser._id,
                                        })}
                                    >
                                        <Text style={styles.buttonText}>
                                            Split
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}
                    keyExtractor={(item) => item._id}
                    ListEmptyComponent={<Text>No current groups</Text>}
                />
            </View>
            <View style={styles.pastGroupsContainer}>
                <Text style={styles.currentText}>Past Groups</Text>
                <FlatList
                    data={pastGroups}
                    renderItem={({ item }) => (
                        <View style={styles.groupItem}>
                            <View style={styles.locationContainer}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <EvilIcons
                                        name="location"
                                        size={28}
                                        color="black"
                                    />
                                    <Text style={{ fontSize: 17 }}>
                                        {item.from}
                                    </Text>
                                </View>
                                <AntDesign
                                    name="arrowright"
                                    size={24}
                                    color="black"
                                />
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <EvilIcons
                                        name="location"
                                        size={28}
                                        color="black"
                                    />
                                    <Text style={{ fontSize: 17 }}>
                                        {item.to}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.timeText}>
                                Date: {formatDate(item.time)}
                            </Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.viewButton}
                                    onPress={() =>
                                        navigation.navigate("ChatWindow", {
                                            groupId: item._id,
                                            userId: currentUser._id,
                                        })
                                    }
                                >
                                    <Text style={styles.buttonText}>View</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    keyExtractor={(item) => item._id}
                    ListEmptyComponent={<Text>No past groups</Text>}
                />
            </View>
        </View>
    );
};

export default MyGroups;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    settleWindowContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        zIndex: 999,
        justifyContent: "center",
        alignItems: "center",
    },
    heading: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
    },
    locationContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingRight: 10,
        marginVertical: 10,
    },
    currentGroupContainer: {
        flex: 1,
        marginBottom: 20,
    },
    currentText: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },

    timeText: {
        fontSize: 16,
        marginLeft: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: "row",
    },
    viewButton: {
        flex: 2,
        backgroundColor: "blue",
        padding: 6,
        borderRadius: 6,
        marginRight: 6,
        alignItems: "center",
        justifyContent: "center",
    },
    confirmButton: {
        flex: 1,
        backgroundColor: "#4c948c",
        padding: 6,
        alignItems: "center",
        borderRadius: 6,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    pastGroupsContainer: {
        flex: 3,
    },
    groupItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        backgroundColor: "lightgreen",
        borderRadius: 10,
    },
});
