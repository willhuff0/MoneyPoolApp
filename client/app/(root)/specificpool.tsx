import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSdk, useApi } from "@/api/api-provider";
import { Pool } from "@money-pool-app/shared";
import { TransactionList } from "@/components/transaction-list";

export default function SpecificPool() {
  const router = useRouter();
  const { poolId } = useLocalSearchParams();
  const { activeUser } = useApi();
  const sdk = useSdk();
  
  const [pool, setPool] = useState<Pool | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!poolId || typeof poolId !== 'string') return;
        const pools = await sdk.pool.getPools([poolId as string]);
        setPool(pools.at(0) ?? null);
        setIsOwner(pools.at(0)?.ownerUserId === activeUser!.userId);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [poolId, activeUser]);

  function onSplitTotal() {
    router.push(`/(root)/splittotal?poolId=${poolId}`);
  }

  function onManagePool() {
    router.push(`/(root)/managepool?poolId=${poolId}`);
  }

  function onViewMembers() {
    router.push(`/(root)/managepool?poolId=${poolId}`);
  }

  function onAddTransaction() {
    router.push(`/(root)/addtransaction?poolId=${poolId}`);
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!pool) {
    return (
      <View style={styles.container}>
        <Text>Pool not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Text style={styles.poolName}>{pool.displayName}</Text>
          <Pressable onPress={() => router.replace("/(root)/poolslist")} style={{ padding: 8 }}>
            <Text style={{ color: "#1428A0", fontWeight: "600" }}>Back</Text>
          </Pressable>
        </View>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${pool.balance?.toFixed(2) || "0.00"}</Text>
        </View>
      </View>

      {/* Owner View/Specific Controls */}
      {isOwner ? (
        <View style={styles.poolControls}>
          <Pressable style={styles.poolButton} onPress={onSplitTotal}>
            <Text style={styles.poolButtonText}>Split Total</Text>
          </Pressable>
          <Pressable style={styles.poolButton} onPress={onManagePool}>
            <Text style={styles.poolButtonText}>Manage Pool</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.poolControls}>
          <Pressable style={styles.poolButton} onPress={onSplitTotal}>
            <Text style={styles.poolButtonText}>Split Total</Text>
          </Pressable>
          <Pressable style={styles.poolButton} onPress={onViewMembers}>
            <Text style={styles.poolButtonText}>View Members</Text>
          </Pressable>
        </View>
      )}

      {/* Transactions and Split Messages Feed */}
      <TransactionList poolId={pool.poolId}></TransactionList>
      {/* <ScrollView style={styles.transactionsFeed} contentContainerStyle={styles.transactionsContent}>
        {transactions.length === 0 && splitMessages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Text style={styles.emptySubtext}>Add a transaction to get started</Text>
          </View>
        ) : (
          <>
            {transactions.map((transaction) => (
              <View key={transaction.transactionId} style={styles.transactionBubble}>
                <Text style={styles.transactionUser}>{transaction.userName}</Text>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionAmount}>${transaction.amount.toFixed(2)}</Text>
              </View>
            ))}
            {splitMessages.map((split) => (
              <View key={split.id} style={styles.transactionBubble}>
                <Text style={styles.splitMessageText}>{split.message}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView> */}

      {/* Add Transaction Button */}
      <View style={styles.footer}>
        <Pressable style={styles.addTransactionButton} onPress={onAddTransaction}>
          <Text style={styles.addTransactionText}>Add Transaction</Text>
        </Pressable>
      </View>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  poolName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  totalBox: {
    backgroundColor: "#F5F4F7",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF8C00",
  },
  poolControls: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  poolButton: {
    flex: 1,
    backgroundColor: "#1428A0",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  poolButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  transactionsFeed: {
    flex: 1,
  },
  transactionsContent: {
    padding: 16,
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
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
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
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  transactionUser: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1428A0",
  },
  deleteText: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "600",
  },
  transactionDescription: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF8C00",
  },
  splitMessageText: {
    fontSize: 15,
    color: "#1428A0",
    fontWeight: "bold",
    textAlign: "center",
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  addTransactionButton: {
    backgroundColor: "#1428A0",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  addTransactionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});