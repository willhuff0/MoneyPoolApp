import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useApi, useSdk } from "@/api/api-provider";

export default function CreatePool() {
  const router = useRouter();
  const sdk = useSdk();
  const { refreshUser } = useApi();
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  async function onCreate() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert("Error", "Please enter a pool name");
      return;
    }

    setCreating(true);
    try {
      const poolId = await sdk.pool.createPool(trimmedName);
      if (poolId) {
        Alert.alert("Success", `Pool '${trimmedName}' created!`);
        refreshUser();
        router.push("/(root)/poolslist");
      } else {
        Alert.alert("Error", "Failed to create pool");
      }
    } catch (e) {
      console.error("Error creating pool:", e);
      Alert.alert("Error", "Failed to create pool");
    } finally {
      setCreating(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Text style={styles.sectionTitle}>Create Pool</Text>
          <Pressable onPress={() => router.replace("/(root)/poolslist")} style={{ padding: 8 }}>
            <Text style={{ color: "#1428A0", fontWeight: "600" }}>Back</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Pool name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Weekend Trip" />

        <Text style={[styles.label, { marginTop: 12 }]}>Initial amount</Text>
        <Text style={styles.amountText}>$0.00</Text>

        <View style={styles.buttonRow}>
          <Pressable style={[styles.button, creating && { backgroundColor: "#94a3b8" }]} onPress={onCreate} disabled={creating}>
            <Text style={styles.buttonText}>{creating ? "Creating Pool..." : "Create"}</Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={() => router.push("/(root)/poolslist")} disabled={creating}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F4F7",
    padding: 16,
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
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  amountText: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 4,
  },
  buttonRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#374151",
    fontWeight: "700",
  },
  button: {
    flex: 1,
    backgroundColor: "#1428A0",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
