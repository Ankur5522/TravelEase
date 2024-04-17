import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    FlatList,
    SafeAreaView,
    RefreshControl,
} from "react-native";
import UserAvatar from "react-native-user-avatar";
import TripCard from "./helpComponents/tripCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../actions/groupActions";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Link } from "@react-navigation/native";
import JoinWindow from "./helpComponents/joinWindow";

const Home = () => {
    const groupState = useSelector((state) => state.groups.groups);
    const [groups, setGroups] = useState([]);
    const [showJoinWindow, setShowJoinWindow] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const dispatch = useDispatch();
    const flatListRef = useRef();

    useEffect(() => {
        const fetchGroupsData = async () => {
            dispatch(fetchGroups())
                .unwrap()
                .then((response) => {
                    const filteredGroups = response.filter(
                        (group) => !group.confirmed
                    );
                    setGroups(filteredGroups);
                })
                .catch((error) => {
                    alert(error);
                });
        };
        fetchGroupsData();
        return () => {
            setGroups([]);
        };
    }, []);

    useEffect(() => {
        const setGroupsData = () => {
            const filteredGroups = groupState.filter(
                (group) => !group.confirmed
            );
            setGroups(filteredGroups);
        };
        setGroupsData();
    }, [groupState?.length, groupState]);

    const fetchData = () => {
        setIsRefreshing(true);
        dispatch(fetchGroups())
            .unwrap()
            .then((response) => {
                const filteredGroups = response.filter(
                    (group) => !group.confirmed
                );
                setGroups(filteredGroups);
            })
            .catch((error) => {
                alert(error);
            });
        setIsRefreshing(false);
    };

    return (
        <View style={styles.container}>
            {showJoinWindow && (
                <View style={styles.joinWindowContainer}>
                    <JoinWindow setShowJoinWindow={setShowJoinWindow} />
                </View>
            )}
            <ImageBackground
                source={require("../assets/upperPartBg.png")}
                style={styles.headingContainer}
            >
                <Link to="/Profile" style={styles.avatarContainer}>
                    <UserAvatar size={45} name="Avishay Bar" bgColor="black" />
                </Link>
                <Text style={styles.headingText}>TravelEase</Text>
                <View style={styles.joinButton}>
                    <TouchableOpacity
                        style={styles.joinButtonInside}
                        onPress={() => setShowJoinWindow(true)}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "600",
                                alignSelf: "center",
                            }}
                        >
                            Join
                        </Text>
                    </TouchableOpacity>
                </View>
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
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={fetchData}
                        />
                    }
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
    joinWindowContainer: {
        position: "absolute",
        flex: 1,
        zIndex: 99,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    headingContainer: {
        flex: 0.5,
        justifyContent: "center",
        alignItems: "center",
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
    joinButton: {
        position: "absolute",
        right: 10,
        height: 30,
        width: 70,
        justifyContent: "center",
        backgroundColor: "white",
        borderRadius: 10,
    },
    joinButtonInside: {
        height: 30,
        width: 70,
        justifyContent: "center",
        borderRadius: 10,
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
