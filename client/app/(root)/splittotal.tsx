import { useApi, useSdk } from "@/api/api-provider";
import { splitBalance } from "@/utils/split-balance";
import { Pool } from "@money-pool-app/shared";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from "react-native";

export default function SplitTotal() {
    const router = useRouter();
    const { poolId } = useLocalSearchParams();
    const { activeUser } = useApi();
    const sdk = useSdk();

    const [pool, setPool] = useState<Pool | null>(null);
    const [transfers, setTransfers] = useState<{
            fromUserId: string,
            toUserId: string,
            amount: number,
        }[]>([]);
    const [userDetails, setUserDetails] = useState<Record<string, { displayName: string, userName: string }>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!poolId || typeof poolId !== 'string') return;
                const pool = (await sdk.pool.getPools([poolId as string])).at(0);
                setPool(pool ?? null);
                
                const calculatedTransfers = pool == null ? [] : splitBalance(pool.members, pool.balance);
                setTransfers(calculatedTransfers);

                const userIds = new Set<string>();
                calculatedTransfers.forEach(t => {
                    userIds.add(t.fromUserId);
                    userIds.add(t.toUserId);
                });

                const details: Record<string, { displayName: string, userName: string }> = {};
                await Promise.all(Array.from(userIds).map(async (uid) => {
                    const user = await sdk.user.getUser(uid);
                    if (user) {
                        details[uid] = { displayName: user.displayName, userName: user.userName };
                    }
                }));
                setUserDetails(details);

            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [poolId, activeUser]);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#1428A0" style={{ marginTop: 20 }} />
            </View>
        );
    }

    if (!pool) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Pool not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <Text style={styles.poolName}>{pool.displayName}</Text>
                    <Pressable onPress={() => router.replace(`/(root)/specificpool?poolId=${poolId}`)} style={{ padding: 8 }}>
                        <Text style={{ color: "#1428A0", fontWeight: "600" }}>Back</Text>
                    </Pressable>
                </View>
                <Text style={styles.subtitle}>
                    Splitting the total balance evenly among members.
                </Text>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                {transfers.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No transfers needed</Text>
                        <Text style={styles.emptySubtext}>Everyone is settled up!</Text>
                    </View>
                ) : (
                    transfers.map((transfer, index) => {
                        const fromUser = userDetails[transfer.fromUserId] || { displayName: "Loading...", userName: "" };
                        const toUser = userDetails[transfer.toUserId] || { displayName: "Loading...", userName: "" };
                        return (
                            <View key={index} style={styles.transferCard}>
                                <View style={styles.transferRow}>
                                    <View style={styles.userColumn}>
                                        <Text style={styles.displayNameText} numberOfLines={1}>{fromUser.displayName}</Text>
                                        <Text style={styles.userNameText} numberOfLines={1}>@{fromUser.userName}</Text>
                                    </View>
                                    
                                    <View style={styles.arrowContainer}>
                                        <Text style={styles.arrow}>→</Text>
                                    </View>

                                    <View style={styles.userColumn}>
                                        <Text style={styles.displayNameText} numberOfLines={1}>{toUser.displayName}</Text>
                                        <Text style={styles.userNameText} numberOfLines={1}>@{toUser.userName}</Text>
                                    </View>
                                </View>
                                <Text style={styles.amount}>${transfer.amount.toFixed(2)}</Text>
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F4F7",
    },
    header: {
        backgroundColor: "#fff",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        alignItems: "center",
    },
    poolName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1428A0",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "#6b7280",
        textAlign: "center",
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    errorText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: "#999",
    },
    transferCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    transferRow: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginRight: 10,
    },
    userColumn: {
        flexDirection: "column",
    },
    displayNameText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1428A0",
    },
    userNameText: {
        fontSize: 12,
        fontWeight: "500",
        color: "#666",
        marginTop: 2,
    },
    arrowContainer: {
        paddingHorizontal: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    arrow: {
        fontSize: 20,
        color: "#999",
        fontWeight: "bold",
        marginTop: -4,
    },
    amount: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FF8C00",
        marginLeft: 4,
    },
});