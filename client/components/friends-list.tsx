import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useApi, useSdk } from "@/api/api-provider";
import { User } from "@money-pool-app/shared";

export function FriendsList() {
    const { activeUser, refreshUser } = useApi();
    const sdk = useSdk();
    const [friends, setFriends] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchFriends = async () => {
            const friendIds = activeUser?.friends ?? [];
            
            if (!friendIds || friendIds.length === 0) {
                if (isMounted) setFriends([]);
                return;
            }

            setLoading(true);
            const users: User[] = [];
            await Promise.all(friendIds.map(async (id) => {
                try {
                    const u = await sdk.user.getUser(id);
                    if (u) users.push(u);
                } catch (e) {
                    console.warn(`Failed to fetch user ${id}`, e);
                }
            }));

            if (isMounted) {
                setFriends(users);
                setLoading(false);
            }
        };

        fetchFriends();
        return () => { isMounted = false; };
    }, [activeUser]);

    const handleRemoveFriend = async (userId: string) => {
        try {
            if (await sdk.user.deleteFriend(userId)) refreshUser();
        } catch (e) {
            console.warn(`Failed to remove friend ${userId}`, e);
        }
    };

    if (loading) {
        return <ActivityIndicator size="small" color="#1428A0" />;
    }

    if (friends.length === 0) {
        return (
            <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>No friends yet</Text>
            </View>
        );
    }

    return (
        <View>
            {friends.map(user => (
                <View key={user.userId} style={styles.friendBubble}>
                    <View style={styles.leftColumn}>
                        <Text style={styles.displayName}>{user.displayName}</Text>
                        <Text style={styles.userName}>@{user.userName}</Text>
                    </View>
                    <Pressable style={styles.removeButton} onPress={() => handleRemoveFriend(user.userId)}>
                        <Text style={styles.removeButtonText}>Remove</Text>
                    </Pressable>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    friendBubble: {
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
    removeButton: {
        backgroundColor: "#FF4500",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    removeButtonText: {
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
        marginTop: 10,
    },
    placeholderText: {
        color: "#afafafff",
        fontStyle: "italic",
    },
});
