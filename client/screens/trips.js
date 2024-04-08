import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ImageBackground,
    FlatList,
    SafeAreaView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import TripCard from "./helpComponents/tripCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../actions/groupActions";

const Trips = () => {
    const groupState = useSelector((state) => state.groups);
    const [groups, setGroups] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchGroups())
            .unwrap()
            .then((response) => setGroups(response))
            .catch((error) => {
                alert(error);
            });
    }, []);

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
            <SafeAreaView style={styles.tripsContainer}>
                <FlatList
                    data={groups}
                    renderItem={({ item }) => <TripCard group={item} />}
                    keyExtractor={(item) => item._id}
                />
            </SafeAreaView>
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
