import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    FlatList,
    TouchableOpacity,
    Linking,
    RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUserDetails, settleAmount } from "../actions/userActions";
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const Transactions = () => {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [transactionDetails, setTransactionDetails] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const userJSON = await AsyncStorage.getItem("user");
            const user = JSON.parse(userJSON);
            await setUser(user);

            const userDetails = await fetchUserDetails(user._id);
            setTransactions(userDetails.user.transactions);
        };
        fetchUser();
    }, []);

    const fetchTransactionDetails = async () => {
        setIsRefreshing(true);
        const details = [];
        let i = 0;
        for (const transaction of transactions) {
            const singlePayment =
                transaction.amount / (transaction.receivers.length + 1);

            if (user._id === transaction.senderId) {
                for (const receiver of transaction.receivers) {
                    const receiverDetails = await fetchUserDetails(
                        receiver.receiverId
                    );
                    details.push({
                        id: `${Date.now()}-${Math.floor(
                            Math.random() * 10000
                        )}`,
                        _id: user._id,
                        transactionId: transaction._id,
                        sender: receiverDetails.user.name,
                        receiver: "You",
                        amount: singlePayment,
                        createdAt: transaction.createdAt,
                        settled: receiver.settled,
                        updatedAt: null,
                    });
                }
            } else {
                const receiverDetails = await fetchUserDetails(
                    transaction.senderId
                );
                details.push({
                    id: `${Date.now()}-${Math.floor(
                        Math.random() * 10000
                    )}`,
                    _id: user._id,
                    transactionId: transaction._id,
                    sender: "You",
                    receiver: receiverDetails.user.name,
                    amount: singlePayment,
                    createdAt: transaction.createdAt,
                    settled: transaction.receivers.filter(
                        (rec) => rec.receiverId === user._id
                    )[0].settled,
                    updatedAt: null,
                });
            }
        }

        setTransactionDetails(details);
        setIsRefreshing(false);
    };

    useEffect(() => {
        if (transactions.length > 0) {
            fetchTransactionDetails();
        }
    }, [transactions]);

    const formatTime = (createdAt) => {
        const date = new Date(createdAt);
        const optionsDate = {
            year: "numeric",
            month: "short",
            day: "numeric",
        };
        const optionsTime = {
            hour: "2-digit",
            minute: "2-digit",
        };
        const formattedDate = date.toLocaleDateString("en-US", optionsDate);
        const formattedTime = date.toLocaleTimeString("en-US", optionsTime);
        return { date: formattedDate, time: formattedTime };
    };

    const handleSettle = async ({ receiverId, transactionId, amount }) => {
        handleUpiPayment(amount);
        const response = await settleAmount({ receiverId, transactionId });
        if (response && response.message) {
            setTransactionDetails((prevDetails) =>
                prevDetails.map((transaction) => {
                    if (transaction._id === receiverId) {
                        return {
                            ...transaction,
                            settled: true,
                            updatedAt: formatTime(Date.now()).time,
                        };
                    }
                    return transaction;
                })
            );
        }
    };

    const handleUpiPayment = (amount) => {
        const upiLink = `upi://pay?pa=${user.upi}&pn=${user.name}%20Doe&mc=123456&tid=123456789&tr=12345&tn=Payment&am=${amount}`;
        Linking.canOpenURL(upiLink)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(upiLink);
                } else {
                    console.error("Cannot handle UPI links");
                }
            })
            .catch((error) => {
                console.error("Error handling UPI links", error);
            });
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../assets/upperPartBg.png")}
                style={styles.headingContainer}
            >
                <Text style={styles.headingText}>Transaction Details</Text>
            </ImageBackground>
            <View style={styles.transactionCardContainer}>
                <FlatList
                    data={transactionDetails}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.transactionCard}>
                            <View style={{ width: "80%" }}>
                                <View style={styles.transactionTextContainer}>
                                    <Text
                                        style={[
                                            styles.senderText,
                                            {
                                                color:
                                                    item.sender === "You"
                                                        ? "green"
                                                        : "#1D4550",
                                            },
                                        ]}
                                    >
                                        {item.sender}
                                    </Text>
                                    <Text style={styles.transactionText}>
                                        {" "}
                                        has to pay{" "}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.receiverText,
                                            {
                                                color:
                                                    item.receiver === "You"
                                                        ? "green"
                                                        : "#1D4550",
                                            },
                                        ]}
                                    >
                                        {item.receiver}
                                    </Text>
                                    <Text style={styles.transactionText}>
                                        {" "}
                                        ₹{item.amount}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.createTimeText}>
                                        {formatTime(item.createdAt).time} |{" "}
                                        {formatTime(item.createdAt).date}
                                    </Text>
                                </View>
                            </View>
                            {item.sender === "You" &&
                                (item.settled ? (
                                    <Text
                                        style={{ fontSize: 16, color: "gray" }}
                                    >
                                        Settled
                                        {item.updatedAt &&
                                            ` at ${item.updatedAt}`}
                                    </Text>
                                ) : (
                                    <TouchableOpacity
                                        onPress={() =>
                                            handleSettle({
                                                receiverId: item._id,
                                                transactionId:
                                                    item.transactionId,
                                                amount: item.amount,
                                            })
                                        }
                                    >
                                        <Text
                                            style={styles.settleButtonContainer}
                                        >
                                            Settle
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            {item.sender !== "You" &&
                                (item.settled ? (
                                    <Text
                                        style={{ fontSize: 16, color: "gray" }}
                                    >
                                        Settled
                                        {item.updatedAt &&
                                            ` at ${item.updatedAt}`}
                                    </Text>
                                ) : (
                                    <Text
                                        style={{ fontSize: 16, color: "red" }}
                                    >
                                        Unsettled
                                    </Text>
                                ))}
                        </View>
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={fetchTransactionDetails}
                        />
                    }
                />
            </View>
        </View>
    );
};

export default Transactions;

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
    transactionCardContainer: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        alignItems: "center",
        paddingTop: 5,
        paddingHorizontal: 5,
        width: screenWidth,
    },
    transactionCard: {
        width: "99%",
        backgroundColor: "#D3DFDEF2",
        minHeight: 80,
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginVertical: 5,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        elevation: 2,
        borderColor: "#379589F2",
        borderWidth: 2,
    },
    transactionTextContainer: {
        maxWidth: "90%",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
    },
    senderText: {
        fontSize: 19,
        fontWeight: "bold",
        color: "#2196F3",
    },
    receiverText: {
        fontSize: 19,
        fontWeight: "bold",
        color: "#4CAF50",
    },
    transactionText: {
        fontSize: 19,
        marginLeft: 5,
    },
    createTimeText: {
        fontSize: 14,
        color: "gray",
        marginTop: 2,
    },
    settleButtonContainer: {
        backgroundColor: "#327069",
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    settleButton: {
        fontSize: 17,
        fontWeight: "bold",
        color: "white",
    },
});
