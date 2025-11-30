import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import PoolsBackground from "../../components/PoolsBackground";
import AuthCard from "../../components/AuthCard";
import { useSdk } from "@/api/api-provider";

export default function PoolsIndex() {
  const router = useRouter();
  const sdk = useSdk();
  const [pools, setPools] = useState<Array<{ id: string; name: string; balance: number }>>([]);
  const [loading, setLoading] = useState(false);

  const onCreatePool = () => {
    // Navigate to create pool page
    // router.push("/(pools)/create");
  };

  return (
    <PoolsBackground title="Your Pools">
      <ScrollView contentContainerStyle={styles.container}>
        <AuthCard>
          <View style={styles.headerRow}>
            <Text style={styles.title}>My Pools</Text>
            <Pressable style={styles.createButton} onPress={onCreatePool}>
              <Text style={styles.createButtonText}>Create Pool</Text>
            </Pressable>
          </View>

          <View style={styles.list}>
            {pools.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No pools yet</Text>
                <Text style={styles.emptySubtext}>Create a pool to get started</Text>
              </View>
            ) : (
              pools.map((p) => (
                <Pressable key={p.id} style={styles.poolItem} onPress={() => {
                  // TODO: Navigate to pool details page when created
                  // router.push(`/(pools)/${p.id}`);
                }}>
                  <View>
                    <Text style={styles.poolName}>{p.name}</Text>
                    <Text style={styles.poolBalance}>${p.balance.toFixed(2)}</Text>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </AuthCard>
      </ScrollView>
    </PoolsBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  createButton: {
    backgroundColor: "#061635",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#ffffffff",
    fontWeight: "600",
  },
  list: {
    marginTop: 8,
  },
  poolItem: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  poolName: {
    fontSize: 16,
    fontWeight: "600",
  },
  poolBalance: {
    color: "#666",
    marginTop: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
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
});
