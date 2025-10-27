import { ReactNode } from "react";
import { Image, Platform, Text, View } from "react-native";

// Drop your transparent PNG later at: client/assets/logo.png
// Then replace 'undefined' with: require("../assets/logo.png")
const logoSrc: any = require("../assets/CCLogo1.png");

export default function AuthBackground({
  title = "Chomp Change",
  children,
}: { title?: string; children: ReactNode }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#0A2463" }}>
      <View style={{ paddingTop: Platform.select({ web: 40, default: 20 }), paddingBottom: 16, alignItems: "center" }}>
        {logoSrc ? <Image source={logoSrc} style={{ width: 72, height: 72, marginBottom: 8 }} /> : null}
        <Text style={{ fontSize: 28, fontWeight: "700", color: "white" }}>{title}</Text>
      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <View style={{ width: "100%", maxWidth: 420 }}>{children}</View>
      </View>
    </View>
  );
}