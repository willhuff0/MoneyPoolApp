import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";

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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Create Pool</Text>

        <Text style={styles.label}>Pool name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Weekend Trip" />

        <Text style={[styles.label, { marginTop: 12 }]}>Initial amount</Text>
        <TextInput style={styles.input} value={initialAmount} onChangeText={setInitialAmount} placeholder="0.00" keyboardType="numeric" />

        <Pressable style={styles.button} onPress={onCreate}>
          <Text style={styles.buttonText}>Create</Text>
        </Pressable>
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
  button: {
    marginTop: 16,
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
