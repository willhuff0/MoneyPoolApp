import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSdk, useApi } from "@/api/api-provider";

export default function SpecificPool() {
  const router = useRouter();
  const { poolId } = useLocalSearchParams();
  const sdk = useSdk();
  const { activeUser } = useApi();
  
  const [pool, setPool] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  //For testing: set true for owner and false for member
  const [isOwner, setIsOwner] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [splitMessages, setSplitMessages] = useState<any[]>([]);

  useEffect(() => {
    setPool({
      poolId: "mock-pool-1",
      displayName: "Test Trip",
      ownerUserId: activeUser?.userId,
      members: ["user1", "user2"],
      balance: 420.69,
    });

    setTransactions([
      { transactionId: "1", description: "Dinner at restaurant", amount: 45.50, userId: "user1", userName: "Alice" },
      { transactionId: "2", description: "Gas for road trip", amount: 32.00, userId: "user2", userName: "Bob" },
    ]);
    
    // loadPool();
    // loadTransactions();
  }, [poolId]);

  async function loadPool() {
    if (!poolId || typeof poolId !== 'string') return;
    
    setLoading(true);
    try {
      const poolData = await sdk.pool.getPool(poolId);
      if (poolData) {
        setPool(poolData);
        setIsOwner(poolData.ownerUserId === activeUser?.userId);
      }
    } catch (e) {
      console.error("Error loading pool:", e);
    } finally {
      setLoading(false);
    }
  }

  async function loadTransactions() {
    if (!poolId || typeof poolId !== 'string') return;
    
    try {
      const data = await sdk.transaction.getTransactions(poolId);
      if (data) {
        setTransactions(data);
      }
    } catch (e) {
      console.error("Error loading transactions:", e);
    }
  }

  function onSplitTotal() {
    if (!pool || !pool.balance) return;
    
    const memberCount = pool.members?.length || 0;
    if (memberCount === 0) {
      alert("No members in pool");
      return;
    }

    const totalBeforeSplit = pool.balance;
    const splitAmount = (pool.balance / memberCount).toFixed(2);
    
    //split message contains previous total and amount ower per pool member (including owner)
    const splitMessage = {
      id: `split-${Date.now()}`,
      message: `You pool's total of $${totalBeforeSplit.toFixed(2)} was split. You owe $${splitAmount}`,
    };
    
    setSplitMessages([...splitMessages, splitMessage]);
    
    //After splitting, balance should be 0 incase more transactions are added after 
    setPool({ ...pool, balance: 0 });
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

  if (loading) {
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
        <Text style={styles.poolName}>{pool.displayName}</Text>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${pool.balance?.toFixed(2) || "0.00"}</Text>
        </View>
      </View>

      {/* Owner View/Specific Controls */}
      {isOwner ? (
        <View style={styles.ownerControls}>
          <Pressable style={styles.ownerButton} onPress={onSplitTotal}>
            <Text style={styles.ownerButtonText}>Split Total</Text>
          </Pressable>
          <Pressable style={styles.ownerButton} onPress={onManagePool}>
            <Text style={styles.ownerButtonText}>Manage Pool</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.memberControls}>
          <Pressable style={styles.memberButton} onPress={onViewMembers}>
            <Text style={styles.memberButtonText}>View Members</Text>
          </Pressable>
        </View>
      )}

      {/* Transactions and Split Messages Feed */}
      <ScrollView style={styles.transactionsFeed} contentContainerStyle={styles.transactionsContent}>
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
      </ScrollView>

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
  ownerControls: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  ownerButton: {
    flex: 1,
    backgroundColor: "#1428A0",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  ownerButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  memberControls: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  memberButton: {
    backgroundColor: "#1428A0",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  memberButtonText: {
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