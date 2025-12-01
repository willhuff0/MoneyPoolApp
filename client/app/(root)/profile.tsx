import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useApi } from "@/api/api-provider";
import { useRouter } from "expo-router";

export default function Settings() {
  const router = useRouter();
  const api = useApi();
  const userName = api.activeUser?.userName || "Username";

  return (
    <ScrollView contentContainerStyle={styles.container}>
        {/* Account Info*/}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{userName}</Text>
          <View style={styles.placeholder}>
             <View style={{ flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "left" }}>
                  Email
                </Text>
                <Text style={{ fontSize: 16, textAlign: "left" }}>
                  {api.activeUser?.email || "No email available"}
                </Text>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" , gap: 12 }}>
                  <Pressable style={styles.addButton} onPress={() => router.push("/(root)/editprofile")}>
                    <Text style={styles.addButtonText}>Edit Profile</Text>
                  </Pressable>
                  <Pressable style={styles.addButton} onPress={() => api.signOut()}>
                    <Text style={styles.addButtonText}>Log Out</Text>
                  </Pressable>
                </View>
            </View>
          </View>
        </View>
      </ScrollView>
  );
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
  sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
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
    alignItems: "flex-start",
    justifyContent: "center",
  },
  placeholderText: {
    color: "#888",
    fontStyle: "italic",
  },
  addButton: {
      backgroundColor: "#1428A0",
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    addButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 14,
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