import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import UserAvatar from "react-native-user-avatar";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addMemberToGroup, deleteGroup, removeMemberFromGroup } from "../../actions/groupActions";

const TripCard = ({ group }) => {
    const [user, setUser] = useState({});
    const [isMember, setIsMember] = useState(false);
    const [seatVacant, setSeatVacant] = useState(group.seatVacant);
    const { ownerName, ownerId, from, to, members } = group;
    const dispatch = useDispatch();

    const timeFormatted = useMemo(() => {
        const timeDate = new Date(group.time);
        return timeDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }, [group.time]);

    useEffect(() => {
        const fetchUser = async () => {
            const jsonData = await AsyncStorage.getItem("user");
            const user = JSON.parse(jsonData);
            setUser(user);
            setIsMember(members.includes(user._id)); // Check if user is a member when component mounts
        };
        fetchUser();
    }, []);

    const handleTrip = async () => {
        if (user._id === ownerId) {
            await dispatch(deleteGroup(group._id));
        } else {
            if (isMember) {
                await dispatch(removeMemberFromGroup({ groupId: group._id, userId: user._id }));
                setIsMember(false);
                setSeatVacant(seatVacant + 1);
            } else {
                await dispatch(addMemberToGroup({ groupId: group._id, userId: user._id }));
                setIsMember(true);
                setSeatVacant(seatVacant - 1 < 0 ? 0 : seatVacant - 1);
            }
        }
    };

    useEffect(() => {
        setIsMember(members.includes(user._id));
    }, [members, user._id]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.nameAvatar}>
                    <UserAvatar size={50} name="Avishay Bar" />
                    <View style={{ marginLeft: 12 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                        {ownerName.charAt(0).toUpperCase() + ownerName.slice(1)}
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                            <MaterialIcons
                                name="access-time"
                                size={18}
                                color="black"
                            />
                            <Text style={{ marginLeft: 4 }}>{timeFormatted}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                    {Array.from({ length: seatVacant }, (_, index) => (
                        <Ionicons
                            name="person-outline"
                            size={24}
                            color="black"
                            key={index}
                        />
                    ))}
                </View>
            </View>
            <View style={styles.locationContainer}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <EvilIcons name="location" size={28} color="black" />
                    <Text style={{ fontSize: 17 }}>{from}</Text>
                </View>
                <AntDesign name="arrowright" size={24} color="black" />
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <EvilIcons name="location" size={28} color="black" />
                    <Text style={{ fontSize: 17 }}>{to}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.joinButton} onPress={handleTrip}>
                <Text
                    style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                >
                    {user._id === ownerId
                        ? "Cancel"
                        : isMember
                        ? "Leave"
                        : "Join"}{" "}
                    the trip
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default TripCard;


const styles = StyleSheet.create({
    container: {
        height: 190,
        padding: 20,
        backgroundColor: "white",
        marginBottom: 10,
        borderRadius: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginRight: 6,
        alignItems: "center",
        width: "100%",
    },
    nameAvatar: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        marginLeft: 5,
    },
    locationContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        marginTop: 20,
        marginHorizontal: 10,
    },
    joinButton: {
        backgroundColor: "#1D4550",
        justifyContent: "center",
        alignItems: "center",
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
    },
});
