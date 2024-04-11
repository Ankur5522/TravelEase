import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    FlatList,
    SafeAreaView,
} from "react-native";
import UserAvatar from "react-native-user-avatar";
import TripCard from "./helpComponents/tripCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../actions/groupActions";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Link } from "@react-navigation/native";

const Home = () => {
    const groupState = useSelector((state) => state.groups.groups);
    const [groups, setGroups] = useState([]);
    const dispatch = useDispatch();
    const flatListRef = useRef();

    useEffect(() => {
        const fetchGroupsData = async () => {
            dispatch(fetchGroups())
                .unwrap()
                .then((response) => {
                    const filteredGroups = response.filter(group => !group.confirmed);
                    setGroups(filteredGroups);
                })
                .catch((error) => {
                    alert(error);
                });
        };
        fetchGroupsData();
        // groups.length && flatListRef.current?.scrollToIndex({ animated: true, index: groups.length - 1 });
        return () => {
            setGroups([]);
        };
    }, []);

    useEffect(() => {
        const setGroupsData = () => {
            const filteredGroups = groupState.filter(group => !group.confirmed);
            setGroups(filteredGroups);
        };
        setGroupsData();
        groups.length && flatListRef.current?.scrollToIndex({ animated: true, index: groups.length - 1 });
    }, [groupState?.length,groupState]);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../assets/upperPartBg.png")}
                style={styles.headingContainer}
            >
                <Link to="/Profile" style={styles.avatarContainer}>
                    <UserAvatar size={45} name="Avishay Bar" bgColor="black" />
                </Link>
                <Text style={styles.headingText}>TravelEase</Text>
            </ImageBackground>
            <SafeAreaView style={styles.tripsContainer}>
                <FlatList
                    ref={flatListRef}
                    data={groups}
                    renderItem={({ item }) => <TripCard group={item} />}
                    keyExtractor={(item) => item._id}
                    getItemLayout={(data, index) => ({
                        length: 200,
                        offset: 200 * index,
                        index,
                    })}
                    scrollsToTop={true}
                    inverted={true}
                />
            </SafeAreaView>
            <TouchableOpacity>
                <Link to="/Form" style={styles.formButtonContainer}>
                    <AntDesign
                        name="pluscircle"
                        size={60}
                        color="#4c948c"
                        style={styles.formButton}
                    />
                </Link>
            </TouchableOpacity>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headingContainer: {
        flex: 0.5,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    avatarContainer: {
        position: "absolute",
        top: 14,
        left: 10,
    },
    headingText: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        color: "white",
    },
    tripsContainer: {
        flex: 5,
        backgroundColor: "#4c948c",
        paddingHorizontal: 10,
    },
    formButtonContainer: {
        position: "absolute",
        bottom: 10,
        right: 15,
    },
    formButton: {
        position: "absolute",
        bottom: 15,
        right: 15,
        borderRadius: 30,
        zIndex: 10,
    },
});
