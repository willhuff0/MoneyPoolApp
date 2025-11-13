import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";

export default function homepage() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* Chomp Score */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chomp Score</Text>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>[Chomp Score Content]</Text>
          </View>
        </View>
  
        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>[Notifications List]</Text>
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
    header: {
      backgroundColor: "#00008B",
      paddingVertical: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    headerText: {
      color: "orange",
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
    },
    section: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
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
      alignItems: "center",
      justifyContent: "center",
    },
    placeholderText: {
      color: "#888",
      fontStyle: "italic",
    },
  });