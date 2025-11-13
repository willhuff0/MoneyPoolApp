import { ReactNode } from "react";
import { Platform, Text, View } from "react-native";

export default function PoolsBackground({
  title = "Pools",
  children,
}: { title?: string; children: ReactNode }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#0A2463" }}>
      <View style={{ paddingTop: Platform.select({ web: 40, default: 20 }), paddingBottom: 16, alignItems: "center" }}>
        <Text style={{ fontSize: 28, fontWeight: "700", color: "#ba7f09ff" }}>{title}</Text>
      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-start", padding: 24 }}>
        <View style={{ width: "100%", maxWidth: 840 }}>{children}</View>
      </View>
    </View>
  );
}
