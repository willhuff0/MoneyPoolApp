import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useApi, useSdk } from "@/api/api-provider";
import { Transaction } from "@money-pool-app/shared";

interface TransactionListProps {
  poolId: string;
}

export function TransactionList({ poolId }: TransactionListProps) {
  const sdk = useSdk();
  const { activeUser } = useApi(); 
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [start, setStart] = useState(0);
  const [userNames, setUserNames] = useState<Record<string, {userName: string, displayName: string}>>({});
  const LIMIT = 20;

  const fetchMissingUsers = async (txs: Transaction[]) => {
    const uniqueIds = [...new Set(txs.map(t => t.userId))];
    const missingIds = uniqueIds.filter(id => !userNames[id]);
    
    if (missingIds.length === 0) return;

    const newNames: Record<string, {userName: string, displayName: string}> = {};
    await Promise.all(missingIds.map(async (id) => {
      try {
        const user = await sdk.user.getUser(id);
        if (user) newNames[id] = {
          userName: user.userName,
          displayName: user.displayName,
        };
      } catch (e) {
        console.warn(`Failed to fetch user ${id}`, e);
      }
    }));
    
    setUserNames(prev => ({ ...prev, ...newNames }));
  };

  useEffect(() => {
    let isMounted = true;
    const fetchInitial = async () => {
      // Reset state for new poolId to avoid showing stale data or appending to it
      setTransactions([]);
      setStart(0);
      setHasMore(true);
      setIsLoading(true);

      try {
        const data = await sdk.transaction.getTransactions(poolId, 0, LIMIT);
        if (isMounted && data) {
          setTransactions(data);
          setStart(data.length);
          setHasMore(data.length >= LIMIT);
          fetchMissingUsers(data);
        }
      } catch (e) {
        console.error("Error loading transactions:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchInitial();
    return () => { isMounted = false; };
  }, [poolId, activeUser]);

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const data = await sdk.transaction.getTransactions(poolId, start, LIMIT);
      if (data && data.length > 0) {
        setTransactions((prev) => [...prev, ...data]);
        setStart((prev) => prev + data.length);
        if (data.length < LIMIT) setHasMore(false);
        fetchMissingUsers(data);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error("Error loading more transactions:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionBubble}>
      <View style={styles.leftColumn}>
        <Text style={styles.transactionUserDisplayName}>{userNames[item.userId]?.displayName}</Text>
        <Text style={styles.transactionUserName}>@{userNames[item.userId]?.userName}</Text>
      </View>
      <View style={styles.centerColumn}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
      </View>
      <View style={styles.rightColumn}>
        <Text style={styles.transactionDate}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
        <Text style={styles.transactionAmount}>${item.amount.toFixed(2)}</Text>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#1428A0" />
      </View>
    );
  };

  return (
    <FlatList
      data={transactions}
      renderItem={renderItem}
      keyExtractor={(item) => item.transactionId}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        !isLoading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  transactionBubble: {
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
  },
  leftColumn: {
    flexDirection: "column",
    marginRight: 24,
    maxWidth: "30%",
  },
  centerColumn: {
    flex: 1,
    justifyContent: "center",
  },
  rightColumn: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginLeft: 18,
  },
  transactionUserDisplayName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1428A0",
  },
  transactionUserName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1428A0",
    marginTop: 6,
  },
  transactionDate: {
    fontSize: 12,
    color: "#999",
  },
  transactionDescription: {
    fontSize: 16,
    color: "#333",
  },
  transactionAmount: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF8C00",
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
