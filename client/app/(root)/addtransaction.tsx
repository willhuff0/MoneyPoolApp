import React, { useState } from "react";
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSdk } from "@/api/api-provider";

export default function AddTransaction() {
  const router = useRouter();
  const { poolId } = useLocalSearchParams();
  const sdk = useSdk();
  
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const parsedAmount = parseFloat(amount);
    
    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }
    
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    setSaving(true);
    try {
      const transactionId = await sdk.transaction.createTransaction(
        poolId as string,
        parsedAmount,
        description.trim()
      );

      if (transactionId) {
        router.replace(`/(root)/specificpool?poolId=${poolId}`);
      } else {
        Alert.alert("Error", "Failed to add transaction");
        setSaving(false);
      }
    } catch (e) {
      console.error("Error adding transaction:", e);
      Alert.alert("Error", "Failed to add transaction");
      setSaving(false);
    }
  }

  function handleCancel() {
    router.replace(`/(root)/specificpool?poolId=${poolId}`);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Transaction</Text>

        <Text style={styles.label}>Purpose of Transaction</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Bought gas"
          value={description}
          onChangeText={setDescription}
          editable={!saving}
        />

        <Text style={[styles.label, { marginTop: 12 }]}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="$0.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          editable={!saving}
        />

        <View style={styles.buttonContainer}>
          

          <Pressable 
            style={[styles.button, saving && styles.disabled]} 
            onPress={handleSave}
            disabled={saving}
>
            <Text style={styles.buttonText}>{saving ? "Saving..." : "Save"}</Text>
          </Pressable>

          <Pressable 
            style={[styles.button, styles.cancelButton]} 
            onPress={handleCancel}
            disabled={saving}
          >
            <Text style={styles.buttonText}>Cancel</Text>
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
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  button: {
    flex: 1,
    backgroundColor: "#1428A0",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#6b7280",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  disabled: {
    opacity: 0.5,
  },
});
