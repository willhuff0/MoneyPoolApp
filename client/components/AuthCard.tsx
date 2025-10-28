import { ReactNode } from "react";
import { View } from "react-native";

export default function AuthCard({ children }: { children: ReactNode }) {
  return (
    <View
      style={{
        width: "100%",
        maxWidth: 420,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      {children}
    </View>
  );
}
