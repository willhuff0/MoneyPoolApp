// 


//For demo purposes running without image in background 
import { ReactNode } from "react";
import { Platform, Text, View } from "react-native";

export default function AuthBackground({
  title = "Chomp Change",
  children,
}: { title?: string; children: ReactNode }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#0A2463" }}>
      <View style={{ paddingTop: Platform.select({ web: 40, default: 20 }), paddingBottom: 16, alignItems: "center" }}>
        <Text style={{ fontSize: 28, fontWeight: "700", color: "white" }}>{title}</Text>
      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <View style={{ width: "100%", maxWidth: 420 }}>{children}</View>
      </View>
    </View>
  );
}
