import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useApi, useSdk } from "@/api/api-provider";
import { Pool } from "@money-pool-app/shared";

export default function PoolsIndex() {
  const router = useRouter();
  const { activeUser } = useApi();
  const sdk = useSdk();

  const [pools, setPools] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeUser!.pools.length === 0) return;
        const pools = await sdk.pool.getPools(activeUser!.pools);
        setPools(pools);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const onCreatePool = () => {
    //Go to create pool page
    router.push("/(root)/create");
  };

  if (isLoading) {
    return (
      <Text style={styles.emptyText}>Loading...</Text>
    );
  } else if (error != null) {
    return (
      <Text style={styles.emptyText}>Error: {String(error)}</Text>
    );
  } else {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>My Pools</Text>
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
                <Pressable
                  key={p.poolId}
                  style={styles.poolItem}
                  onPress={() => {
                    router.push(`/(root)/specificpool?poolId=${p.poolId}`);
                  }}
                >
                  <View>
                    <Text style={styles.poolName}>{p.displayName}</Text>
                    <Text style={styles.poolBalance}>${p.balance.toFixed(2)}</Text>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    );
  }
}

//Stylesheet cohesive with homepage, reusing container, section, and sectionTitle styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F4F7",
    padding: 16,
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
    backgroundColor: "#1428A0",
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
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    minHeight: 300,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
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
    color: "#888",
    fontStyle: "italic",
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
    fontSize: 18,
    fontWeight: "700",
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
