import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ImageBackground,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import TripCard from "./helpComponents/tripCard";

const Trips = () => {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../assets/upperPartBg.png")}
                style={styles.searchContainer}
            >
                <View style={styles.searchBar}>
                    <FontAwesome name="search" size={24} color="black" />
                    <TextInput
                        placeholder="Search"
                        style={{ fontSize: 19, marginLeft: 10, width: "100%" }}
                    />
                </View>
            </ImageBackground>
            <View style={styles.tripsContainer}>
                <TripCard />
            </View>
        </View>
    );
};

export default Trips;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    searchContainer: {
        flex: 1,
        justifyContent: "flex-end",
        paddingBottom: 8,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        marginHorizontal: 14,
        marginBottom: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 12,
    },
    tripsContainer: {
        flex: 5,
    },
});
