import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchMembers } from '../actions/groupActions';
import { FontAwesome } from '@expo/vector-icons';

const ChatWindow = ({ route }) => {
    const [groupMembers, setGroupMembers] = useState([]);
    const [message, setMessage] = useState('');
    const { groupId } = route.params;

    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                const response = await fetchMembers(groupId);
                setGroupMembers(response);
            } catch (error) {
                console.error('Error fetching group members:', error);
            }
        };
        fetchGroupMembers();
    }, [groupId]);

    const sendMessage = () => {
        // Implement sending message logic here
        console.log('Message sent:', message);
        // Reset message input
        setMessage('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.headingContainer}>
                <Text style={styles.headingText}>Group Chat</Text>
            </View>
            <View style={styles.membersContainer}>
                <Text style={styles.memberText}>Members:</Text>
                <FlatList
                    data={groupMembers}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Text style={{fontSize: 18}}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
                            <TouchableOpacity>
                                <FontAwesome name="phone" size={26} color="black" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
            <View style={styles.chatContainer}>
                {/* Chat messages will be displayed here */}
                <View style={styles.messageInputContainer}>
                    <TextInput
                        style={styles.messageInput}
                        placeholder="Type your message..."
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
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
        backgroundColor: '#fff',
    },
    headingContainer: {
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headingText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    membersContainer: {
        flex: 1,
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    memberText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    chatContainer: {
        flex: 3,
        justifyContent: 'flex-end',
        padding: 20,
    },
    messageInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    messageInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#4c948c',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
