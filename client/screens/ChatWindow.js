import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from "react-native";
import { fetchMembers, fetchChatMessages, sendNewMessage } from "../actions/groupActions";
import { FontAwesome } from "@expo/vector-icons";
import { Linking } from "react-native";
import io from "socket.io-client";

const ChatWindow = ({ route }) => {
    const [groupMembers, setGroupMembers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const { groupId, userId } = route.params;

    const flatListRef = useRef(null);

    useEffect(() => {
        const socket = io(`http://10.0.2.2:5000`)
        socket.emit('joinChat', {groupId});

        socket.on('message', (message) => {
            setMessages((messages) => [...messages, message]);
        })

        return () => {
            socket.disconnect();
        }
    }, [])

    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                const response = await fetchMembers(groupId);
                setGroupMembers(response);
            } catch (error) {
                console.error("Error fetching group members:", error);
            }
        };
        fetchGroupMembers();
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            const response = await fetchChatMessages(groupId);
            setMessages(response);
        };
        fetchMessages();
    }, []);

    const sendMessage = async () => {
        try {
            await sendNewMessage({ groupId, userId, message})
            setMessage("");
        } catch (error) {
            alert("Error sending message:", error);
        }
    };

    const handlePhoneCall = (phoneNumber) => {
        if (Platform.OS === "android") {
            Linking.openURL(`tel:${phoneNumber}`);
        } else {
            Linking.openURL(`telprompt:${phoneNumber}`);
        }
    };

    const formatTime = (time) => {
        const timeDate = new Date(time);
        return timeDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.headingContainer}>
                <Text style={styles.headingText}>Group Chat</Text>
                <Text style={{ fontSize: 18, color: "#4c948c" }}></Text>
            </View>
            <View style={styles.membersContainer}>
                <Text style={styles.memberText}>Members:</Text>
                <FlatList
                    data={groupMembers}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text style={{ fontSize: 18 }}>
                                {item.name.charAt(0).toUpperCase() +
                                    item.name.slice(1)}
                            </Text>
                            <TouchableOpacity
                                onPress={() =>
                                    handlePhoneCall(item.phoneNumber)
                                }
                            >
                                <FontAwesome
                                    name="phone"
                                    size={26}
                                    color="black"
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
            <View style={styles.chatContainer}>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                flexDirection: "row",
                                marginBottom: 10,
                                justifyContent: item.sender === userId ? "flex-end" : "flex-start",
                            }}
                        >
                            <View>
                            <Text
                                style={{
                                    backgroundColor:
                                        item.sender === userId
                                            ? "#4c948c"
                                            : "#ccc",
                                    color: item.sender === userId ? "#fff" : "#000",
                                    padding: 10,
                                    borderRadius: 10,
                                    fontSize: 18
                                }}
                            >
                                {item.content}
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                textAlign: item.sender === userId ? "right" : "left",
                                paddingHorizontal: 5
                            }}>
                                {formatTime(item.createdAt)}
                            </Text>
                            </View>
                            <Text>
                                {item.sender !== userId &&
                                    groupMembers.find((member) => member._id === item.sender).name
                                }
                            </Text>
                        </View>
                    )}
                    onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
                    onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
                />
                <View style={styles.messageInputContainer}>
                    <TextInput
                        style={styles.messageInput}
                        placeholder="Type your message..."
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={sendMessage}
                    >
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
export default ChatWindow;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    headingContainer: {
        alignItems: "center",
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    headingText: {
        fontSize: 24,
        fontWeight: "bold",
    },
    membersContainer: {
        flex: 1,
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    memberText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    chatContainer: {
        flex: 3,
        justifyContent: "flex-end",
        padding: 20,
    },
    messageInputContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    messageInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 10,
        fontSize: 16
    },
    sendButton: {
        backgroundColor: "#4c948c",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    sendButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
