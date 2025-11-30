import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import AuthBg from "../../components/AuthBg";
import AuthCard from "../../components/AuthCard";
//For connecting to API 
import { useSdk } from "@/api/api-provider";

export default function AddFriendsScreen() {
  const sdk = useSdk();
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [found, setFound] = useState<{ userId: string; userName: string; displayName: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  //search user by username using onSearch API 
  async function onSearch() {
    setError(null);
    setFound(null);

    const trimmed = query.trim();
    if (!trimmed) {
      setError("Enter a username to search.");
      return;
    }

    setSearching(true);
    try {
      const user = await sdk.user.searchUser(trimmed);
      if (user) {
        setFound({ userId: user.userId, userName: user.userName, displayName: user.displayName });
      } else {
        setError("no user found with this username");
      }
    } catch (e) {
      console.error("Search error:", e);
      setError("Error searching for user");
    } finally {
      setSearching(false);
    }
  }

  //Send friend request using create Friend request API 
  async function onAddFriend() {
    if (!found) return;

    try {
      const success = await sdk.user.createFriendRequest(found.userId);
      if (success) {
        Alert.alert("Friend request sent", `Friend request sent to ${found.displayName}`);
        setFound(null);
        setQuery("");
      } else {
        Alert.alert("Error", "Failed to send friend request");
      }
    } catch (e) {
      console.error("Friend request error:", e);
      Alert.alert("Error", "Failed to send friend request");
    }
  }

  return (
    <AuthBg title="Find Friends">
      <AuthCard>
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>Find friends by username</Text>

          <TextInput
            placeholder="username"
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

          {error ? <Text style={{ color: "#ef4444" }}>{error}</Text> : null}

          {found ? (
            <View style={styles.result}>
              <View>
                <Text style={{ fontWeight: "700" }}>{found.displayName ?? found.userName}</Text>
                <Text style={{ color: "#6b7280" }}>@{found.userName}</Text>
              </View>
              <Pressable style={styles.addButton} onPress={onAddFriend}>
                <Text style={{ color: "#061635", fontWeight: "700" }}>Add</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </AuthCard>
    </AuthBg>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
  },
  button: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  result: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#c87119ff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
});

