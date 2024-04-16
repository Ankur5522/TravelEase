import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { fetchMembers,fetchChatId } from '../actions/groupActions';
import { FontAwesome } from '@expo/vector-icons';
import { Linking } from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = 'http://10.0.2.2:5000';

const PORT = process.env.PORT || 3070;
const socket = io(`http://10.0.2.2:${PORT}`);



const ChatWindow = ({ route }) => {
    const [groupMembers, setGroupMembers] = useState([]);
    const [ChatRoomId,setChatRoomId] = useState();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [userId,setuserId] = useState();
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

        const fetchChatRoomId = async () => {
            try {
                const response = await fetchChatId(groupId);
                const chatRoomId = response.chatRoom_id;
                console.log("chatRoomId", chatRoomId);
                setChatRoomId(chatRoomId);


                // await fetchChatMessages(ChatRoomId);

                const JSONdata = await AsyncStorage.getItem("user");
                const user = JSON.parse(JSONdata);
                setuserId(user._id)
        

            } catch (error) {
                console.error('Error fetching Chat Room Id:', error);
            }
        };


        fetchGroupMembers();
        fetchChatRoomId();

        socket.emit('joinChat', { ChatRoomId, user_Id: userId});
       
    }, [groupId]);

    // const fetchChatMessages = async (chatRoomId) => {
    //     try {
    //         const response = await axios.get(`${baseURL}/message/${chatRoomId}`);
    //         setMessages(response.data);
    //     } catch (error) {
    //         console.error('Error fetching chat messages:', error.message);
    //     }
    // };

    useEffect(()=>{
        // socket.emit('joinChat', { ChatRoomId, user_Id: userId });

        socket.on('newMessage', (message) => {
            console.log("messages",messages)
            setMessages((prevMessages) => [...prevMessages, message]);
        
            flatListRef.current.scrollToEnd({ animated: true });
          });

          socket.on('userDisconnected', (userId) => {
            console.log(`User ${userId} disconnected`);
          });

        return () => {
            socket.emit('leaveChat', { ChatRoomId, userId: userId });
            socket.off('newMessage');
            socket.off('userDisconnected');
        };
    },[ChatRoomId])

    const sendMessage = async () => {
        try {
            console.log("ChatId"+ChatRoomId);
            console.log("SenderId"+userId);
            console.log("message"+message);
            await axios.post(`${baseURL}/message`, {
                chatId: ChatRoomId, 
                senderId: userId, 
                text: message,
            });


            socket.emit('sendMessage', {
                ChatRoomId,
                userId,
                text: message,
              });

            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
           
        }
    };
    
    
    
    

    const handlePhoneCall = (phoneNumber) => {
        if(Platform.OS === 'android') {
            Linking.openURL(`tel:${phoneNumber}`);
        } else {
            Linking.openURL(`telprompt:${phoneNumber}`);
        }
    }

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
                            <TouchableOpacity
                                onPress={() => handlePhoneCall(item.phoneNumber)}
                            >
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
