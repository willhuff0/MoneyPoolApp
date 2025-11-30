import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useApi } from "@/api/api-provider";

export default function Homepage() {
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
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 100 }}>
              <View style={{ width: 200, height: 200 }}>
                <CircularProgressbar value={chompScore} maxValue={100} text={`${chompScore}`} styles={{ path: { stroke: pathColor }, text: { fill: textColor } }} />
              </View>
              <View style={{flexDirection: "column", alignItems: "center"}}>
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>{chompScoreText}</Text>
                <Text>{advice}</Text>
              </View>
            </View>
          </View>
        </View>
  
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Friend Requests</Text>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>[Incoming Friend Requests]</Text>
          </View>
        </View>
        {/* Friend Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Friends</Text>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>[Press Add Friends to get started!]</Text>
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