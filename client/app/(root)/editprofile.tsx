import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
//For connecting to API 
import { useApi } from "@/api/api-provider";

export default function EditProfile() {
  const router = useRouter();
  const api = useApi();
  const user = api.activeUser
  const [displayName, setDisplayName] = useState(api.activeUser?.displayName || "");
  const [email, setEmail] = useState(api.activeUser?.email || "");
  const [password, setPassword] = useState(""); // for new password

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Text style={{fontSize: 24,fontWeight: "bold"}}>Edit Profile</Text>
          <Pressable onPress={() => router.replace("/(root)/profile")} style={{ padding: 8 }}>
            <Text style={{ color: "#1428A0", fontWeight: "600" }}>Back</Text>
          </Pressable>
        </View>
        <Text style={styles.sectionTitle}>Display Name</Text>
        <TextInput
          placeholder="Enter New Display Name"
          autoCapitalize="none"
          value = {displayName}
          onChangeText={setDisplayName}
          defaultValue = {user?.displayName}
          style={styles.input}

        />
        <Pressable style={[styles.button]} onPress={() => api.editUser({newDisplayName: displayName}) }>
          <Text style={{ color: "white", fontWeight: "600"}}>Save New Display Name</Text>
        </Pressable>
        <Text style={styles.sectionTitle }>Email</Text>
        <TextInput
          placeholder="Enter New Email"
          autoCapitalize="none"
          value = {email}
          onChangeText={setEmail}
          defaultValue= {user?.email}
          style={styles.input}
        />
        <Pressable style={[styles.button]} onPress={() => api.editUser({newEmail : email })}>
          <Text style={{ color: "white", fontWeight: "600"}}>Save New Email</Text>
        </Pressable>
        <Text style={styles.sectionTitle}>Password</Text>
        <TextInput
          placeholder="Enter New Password"
          autoCapitalize="none"
          value = {password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <Pressable style={[styles.button]} onPress={() => api.editUser({ newPassword : password}) }>
          <Text style={{ color: "white", fontWeight: "600"}}>Save New Password</Text>
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
    marginTop: 16,
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
    backgroundColor: "#1428A0",
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