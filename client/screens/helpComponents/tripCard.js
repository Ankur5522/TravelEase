import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import UserAvatar from "react-native-user-avatar";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const TripCard = () => {
    const [seatVacant, setSeatVacant] = useState(3);
    const vacantSeats = Array.from(
        { length: seatVacant },
        (_, index) => index + 1
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.nameAvatar}>
                    <UserAvatar size={50} name="Avishay Bar" />
                    <View style={{ marginLeft: 12 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                            Avishay Bar
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                            <MaterialIcons
                                name="access-time"
                                size={18}
                                color="black"
                            />
                            <Text style={{ marginLeft: 4 }}>18:00 PM</Text>
                        </View>
                    </View>
                </View>
                <View style={{flexDirection: "row"}}>
                    {vacantSeats.map((seatNumber) => (
                        <View key={seatNumber} style={styles.iconContainer}>
                            <Ionicons
                                name="person-outline"
                                size={20}
                                color="black"
                            />
                        </View>
                    ))}
                </View>
            </View>
            <View style={styles.locationContainer}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <EvilIcons name="location" size={28} color="black" />
                    <Text style={{fontSize: 17}}>Sector 62</Text>
                </View>
                <AntDesign name="arrowright" size={24} color="black" />
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <EvilIcons name="location" size={28} color="black" />
                    <Text style={{fontSize: 17}}>Sector 128</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.joinButton}>
                <Text style={{color: "white", fontSize: 18, fontWeight: "bold"}}>Join the trip</Text>
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
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginRight: 6,
        alignItems: "center",
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
        marginHorizontal: 10
    },
    joinButton: {
        backgroundColor: "#1D4550",
        justifyContent: "center",
        alignItems: "center",
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
    }
});
