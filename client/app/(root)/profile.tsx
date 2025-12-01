import React from "react";
import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";
import { useApi } from "@/api/api-provider";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();
  const { activeUser, signOut } = useApi();
  
  const displayName = activeUser?.displayName || "User";
  const userName = activeUser?.userName || "username";
  const email = activeUser?.email || "No email";
  const initials = displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  async function handleLogout() {
    await signOut();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.displayName}>{displayName}</Text>
        <Text style={styles.userName}>@{userName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{email}</Text>
        </View>

        <Pressable style={styles.editButton} onPress={() => router.push("/(root)/editprofile")}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </Pressable>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F4F7",
    padding: 16,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1428A0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  displayName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  userName: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  infoRow: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  editButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  editButtonText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 42,
    borderRadius: 200,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF4500",
    marginTop: "auto",
    alignSelf: "center",
    marginBottom: 32,
  },
  logoutButtonText: {
    color: "#FF4500",
    fontWeight: "600",
    fontSize: 14,
  },
});