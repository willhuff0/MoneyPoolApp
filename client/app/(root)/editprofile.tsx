import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View, StyleSheet, ScrollView } from "react-native";
//For connecting to API 
import { useApi } from "@/api/api-provider";

export default function EditProfile() {
  const api = useApi();




  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={{fontSize: 24,fontWeight: "bold",marginBottom: 16,}}>Edit Profile</Text>
        <Text style={styles.sectionTitle}>Display Name</Text>
        <TextInput
          placeholder="Enter New Display Name"
          autoCapitalize="none"
          style={styles.input}
        //   onSubmitEditing={}
        />
        <Text style={styles.sectionTitle}>Email</Text>
        <TextInput
          placeholder="Enter New Email"
          autoCapitalize="none"
          style={styles.input}
        //   onSubmitEditing={}
        />
        <Text style={styles.sectionTitle}>Password</Text>
        <TextInput
          placeholder="Enter New Password"
          autoCapitalize="none"
          style={styles.input}
        //   onSubmitEditing={}
        />


        <Pressable style={[styles.button]}>
          <Text style={{ color: "white", fontWeight: "600"}}>Save</Text>
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