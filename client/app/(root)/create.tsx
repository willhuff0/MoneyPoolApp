import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import PoolsBackground from "../../components/PoolsBackground";
import AuthCard from "../../components/AuthCard";

export default function CreatePool() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [initialAmount, setInitialAmount] = useState("");

  function onCreate() {
    // Placeholder: Replace with API call to create pool
    Alert.alert("Create Pool", `Pool '${name}' created (mock)`);
    router.replace("/index");
  }

  return (
    <PoolsBackground title="Create Pool">
      <View style={styles.container}>
        <AuthCard>
          <Text style={styles.label}>Pool name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Weekend Trip" />

          <Text style={[styles.label, { marginTop: 12 }]}>Initial amount</Text>
          <TextInput style={styles.input} value={initialAmount} onChangeText={setInitialAmount} placeholder="0.00" keyboardType="numeric" />

          <Pressable style={styles.button} onPress={onCreate}>
            <Text style={styles.buttonText}>Create</Text>
          </Pressable>
        </AuthCard>
      </View>
    </PoolsBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
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
  button: {
    marginTop: 16,
    backgroundColor: "#061635",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFA500",
    fontWeight: "700",
  },
});
