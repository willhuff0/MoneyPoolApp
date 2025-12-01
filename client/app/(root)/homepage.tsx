import React from "react";
import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";
import { CircularProgressbar , buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useApi } from "@/api/api-provider";
import { useRouter } from "expo-router";
import { IncomingFriendRequests } from "@/components/incoming-friend-requests";
import { FriendsList } from "@/components/friends-list";

export default function Homepage() {
    const router = useRouter();
    const { activeUser } = useApi();
    const chompScore = activeUser?.chompScore || 0;
    let chompScoreText = "";
    let advice = "";
    let pathColor = "";
    let textColor = "#000000";
    if (chompScore > 67){
      chompScoreText = "Great!";
      advice = "Keep up the excellent work!";
      pathColor = `rgba(175, 214, 155, ${60})`;
    }
    else if (chompScore > 34){
      chompScoreText = "Okay";
      advice = "Make payments on time to improve your score!";
      pathColor = `rgba(255, 244, 135, ${60})`;
    }
    else {
      chompScoreText = "Poor";
      advice = "Make payments on time to increase your score!";
      pathColor = `rgba(254, 46, 46, ${60})`;
    }


    return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* Chomp Score */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chomp Score</Text>
          <View style={styles.placeholder}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 70 }}>
              <View style={{ width: 200, height: 200 }}>
                <CircularProgressbar 
                  value={chompScore} 
                  maxValue={100} 
                  text={`${chompScore}`} 
                  styles={{ path: { stroke: pathColor }, 
                  text: { fill: textColor } }} 
                />
              </View>

              <View style={{flex:1, flexDirection: "column", alignItems: "center"}}>
                <Text style={{ fontSize: 24, fontWeight: "bold", flexShrink: 1, flexWrap: "wrap" }}>{chompScoreText}</Text>
                <Text style= {{flexShrink: 1, textAlign: "center", flexWrap: "wrap"}}>{advice}</Text>
              </View>
            </View>
          </View>
        </View>
  
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Friend Requests</Text>
          <IncomingFriendRequests />
        </View>
        {/* Friend Section */}
         <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Friends</Text>
            <Pressable style={styles.addButton} onPress={() => router.push("/(root)/addfriends")}>
              <Text style={styles.addButtonText}>Add Friend</Text>
            </Pressable>
          </View>
          <FriendsList />
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

    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
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
    placeholder: {
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 8,
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    placeholderText: {
      color: "#afafafff",
      fontStyle: "italic",
    },
  });