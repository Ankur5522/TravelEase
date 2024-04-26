import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ImageBackground,
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
    const [displayPastGroups, setDisplayPastGroups] = useState(false);
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
                return group.transactionId === null;
            });
            const pastGroups = userGroups?.filter(
                (group) => !currentGroups.includes(group) && group.confirmed
            );
            setCurrentGroups(currentGroups);
            setPastGroups(pastGroups);
        };
        fetchGroups();
    }, [groups]);

    useEffect(() => {
        // Automatically show current groups when the component mounts
        setDisplayPastGroups(false);
    }, []);

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

    const toggleDisplayPastGroups = () => {
        // Check if the current state is already showing current groups
        if (!displayPastGroups) {
            // Prevent toggling if already showing current groups
            return;
        }
        setDisplayPastGroups(!displayPastGroups);
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../assets/upperPartBg.png")}
                style={styles.headingContainer}
            >
                <Text style={styles.headingText}>My Groups</Text>
                </ImageBackground>
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            !displayPastGroups && styles.selectedButton,
                        ]}
                        onPress={toggleDisplayPastGroups}
                    >
                        <Text style={styles.mainbuttonText}>Current Groups</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            displayPastGroups && styles.selectedButton,
                        ]}
                        onPress={setDisplayPastGroups.bind(null, true)}
                    >
                        <Text style={styles.mainbuttonText}>Past Groups</Text>
                    </TouchableOpacity>
                </View>
            {showSettleWindow && (
                <View style={styles.settleWindowContainer}>
                    <SettleWindow
                        setShowSettleWindow={setShowSettleWindow}
                        groupId={pressedDetails.groupId}
                        userId={pressedDetails.userId}
                    />
                </View>
            )}
            <View style={styles.groupContainer}>
                {displayPastGroups ? (
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
                                        style={{
                                            fontSize: 18,
                                            fontWeight: "bold",
                                        }}
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
                                        <Text style={styles.buttonText}>
                                            View
                                        </Text>
                                    </TouchableOpacity>
                                    {/* Hide the Split button for past groups */}
                                </View>
                            </View>
                        )}
                        keyExtractor={(item) => item._id}
                        ListEmptyComponent={<Text>No past groups</Text>}
                    />
                ) : (
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
                                        style={{
                                            fontSize: 18,
                                            fontWeight: "bold",
                                        }}
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
                                        <Text style={styles.buttonText}>
                                            View
                                        </Text>
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
                                            onPress={() =>
                                                handleSplitPress({
                                                    groupId: item._id,
                                                    userId: currentUser._id,
                                                })
                                            }
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
                )}
            </View>
        </View>
    );
};

export default MyGroups;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headingContainer: {
        width: "100%",
        height: 90,
        justifyContent: "center",
        alignItems: "center",
      },
      headingText: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        color: "white",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    button: {
        flex: 1,
        paddingVertical: 15,
        backgroundColor: "#F3F3F3", 
        borderBottomWidth: 4, 
        borderColor: "transparent",
    },
    mainbuttonText: {
        fontSize: 18,
        color: "#454545",
        fontWeight: "bold",
        textAlign: "center",
    },
    buttonText: {
        fontSize: 18,
        color: "#F1F1F1",
        fontWeight: "bold",
        textAlign: "center",
    },
    selectedButton: {
        borderColor: "#4c948c", // Change border color to indicate selection
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
    groupContainer: {
        flex: 1,
    },
    groupItem: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: "#D3DFDE",
        borderColor: "#379589",
        marginLeft:2, 
        borderTopWidth: 1, 
        borderRightWidth: 1, 
        borderBottomWidth: 1, 
        borderLeftWidth: 1, 
        width: "99%", 
        height: 146, 
        borderRadius: 12, 
        opacity: 1, 
    },
    locationContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingRight: 10,
        marginVertical: 10,
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
        flex: 1,
        backgroundColor: "#327069",
        padding: 6,
        borderRadius: 6,
        marginRight: 6,
        alignItems: "center",
        justifyContent: "center",
    },
    confirmButton: {
        flex: 1,
        backgroundColor: "#327069",
        padding: 6,
        alignItems: "center",
        borderRadius: 6,
    },
});