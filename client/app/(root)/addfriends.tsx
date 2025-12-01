import React, { useState } from "react";
import { Pressable, Text, TextInput, View, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
//For connecting to API 
import { useSdk } from "@/api/api-provider";

export default function AddFriendsScreen() {
  const router = useRouter();
  const sdk = useSdk();
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  //search user by username and send friend request
  async function onSearch() {
    setError(null);
    setSuccessMessage(null);

    const trimmed = query.trim();
    if (!trimmed) {
      setError("Enter a username to search.");
      return;
    }

    setSearching(true);
    try {
      const user = await sdk.user.searchUser(trimmed);
      if (user) {
        // User found, automatically send friend request 
        const success = await sdk.user.createFriendRequest(user.userId);
        if (success) {
          setSuccessMessage(`Friend request sent to ${user.displayName || user.userName}!`);
          setQuery("");
        } else {
          setError("Failed to send friend request");
        }
      } else {
        //User not found; request will not send
        setError("Username does not exist. Please try again.");
      }
    } catch (e) {
      console.error("Search error:", e);
      setError("Username does not exist. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Find Friends</Text>
          <Pressable onPress={() => router.replace("/(root)/homepage")} style={{ padding: 8 }}>
            <Text style={{ color: "#1428A0", fontWeight: "600" }}>Back</Text>
          </Pressable>
        </View>
        <Text style={styles.subtitleText}>Enter a valid username to send a friend request.</Text>

        <TextInput
          placeholder="username"
          placeholderTextColor="#888"
          autoCapitalize="none"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
          editable={!searching}
          onSubmitEditing={onSearch}
        />

        <Pressable onPress={onSearch} style={[styles.button, { backgroundColor: searching ? "#94a3b8" : "#1428A0" }]} disabled={searching}>
          <Text style={{ color: "white", fontWeight: "600" }}>{searching ? "Searching…" : "Search"}</Text>
        </Pressable>

        {error ? <Text style={{ color: "#ef4444", marginTop: 12 }}>{error}</Text> : null}
        {successMessage ? <Text style={{ color: "#10b981", marginTop: 12, fontWeight: "600" }}>{successMessage}</Text> : null}
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
  subtitleText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  result: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#F5F4F7",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#1428A0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
});