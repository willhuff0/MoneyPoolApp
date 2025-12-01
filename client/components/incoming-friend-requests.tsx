import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useApi, useSdk } from "@/api/api-provider";
import { User } from "@money-pool-app/shared";

export function IncomingFriendRequests() {
    const { activeUser, refreshUser } = useApi();
    const sdk = useSdk();
    const [requesters, setRequesters] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchRequesters = async () => {
            const requestIds = activeUser?.incomingFriendRequests ?? [];
            
            if (!requestIds || requestIds.length === 0) {
                if (isMounted) setRequesters([]);
                return;
            }

            setLoading(true);
            const users: User[] = [];
            await Promise.all(requestIds.map(async (id) => {
                try {
                    const u = await sdk.user.getUser(id);
                    if (u) users.push(u);
                } catch (e) {
                    console.warn(`Failed to fetch user ${id}`, e);
                }
            }));

            if (isMounted) {
                setRequesters(users);
                setLoading(false);
            }
        };

        fetchRequesters();
        return () => { isMounted = false; };
    }, [activeUser]);

    const handleAccept = async (userId: string) => {
        const success = await sdk.user.acceptFriendRequest(userId);
        if (success) {
            setRequesters(prev => prev.filter(u => u.userId !== userId));
            refreshUser();
        }
    };

    const handleIgnore = async (userId: string) => {
        const success = await sdk.user.deleteFriendRequest(userId);
        if (success) {
            setRequesters(prev => prev.filter(u => u.userId !== userId));
            refreshUser();
        }
    };

    if (loading) {
        return <ActivityIndicator size="small" color="#1428A0" />;
    }

    if (requesters.length === 0) {
        return (
            <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>No incoming friend requests</Text>
            </View>
        );
    }

    return (
        <View>
            {requesters.map(user => (
                <View key={user.userId} style={styles.requestBubble}>
                    <View style={styles.leftColumn}>
                        <Text style={styles.displayName}>{user.displayName}</Text>
                        <Text style={styles.userName}>@{user.userName}</Text>
                    </View>
                    <View style={styles.rightColumn}>
                        <Pressable style={[styles.button, styles.acceptButton]} onPress={() => handleAccept(user.userId)}>
                            <Text style={styles.buttonText}>Accept</Text>
                        </Pressable>
                        <Pressable style={[styles.button, styles.ignoreButton]} onPress={() => handleIgnore(user.userId)}>
                            <Text style={styles.buttonText}>Ignore</Text>
                        </Pressable>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    requestBubble: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    leftColumn: {
        flexDirection: "column",
        flex: 1,
    },
    rightColumn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    displayName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1428A0",
    },
    userName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1428A0",
        marginTop: 6,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    acceptButton: {
        backgroundColor: "#1428A0",
    },
    ignoreButton: {
        backgroundColor: "#FF4500",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 12,
    },
    placeholder: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    placeholderText: {
        color: "#afafafff",
        fontStyle: "italic",
    },
});
