import React from "react";
import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import PoolsBackground from "../../components/PoolsBackground";
import AuthCard from "../../components/AuthCard";

const samplePools = [
  { id: "1", name: "Weekend Trip", balance: 240.5 },
  { id: "2", name: "House Gifts", balance: 1200 },
  { id: "3", name: "Office Snacks", balance: 45.25 },
];

export default function PoolsIndex() {
  const router = useRouter();

  return (
    <PoolsBackground title="Your Pools">
      <ScrollView contentContainerStyle={styles.container}>
        <AuthCard>
          <View style={styles.headerRow}>
            <Text style={styles.title}>My Pools</Text>
            <Pressable style={styles.createButton} onPress={() => router.push("/pools/create")}>
              <Text style={styles.createButtonText}>Create Pool</Text>
            </Pressable>
          </View>

          <View style={styles.list}>
            {samplePools.map((p) => (
              <Pressable key={p.id} style={styles.poolItem} onPress={() => router.push(`/pools/${p.id}`)}>
                <View>
                  <Text style={styles.poolName}>{p.name}</Text>
                  <Text style={styles.poolBalance}>${p.balance.toFixed(2)}</Text>
                </View>
              </Pressable>
            ))}
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
    color: "#FFA500",
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
});
