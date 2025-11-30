import { Tabs } from "expo-router";
import { View, Image, Text } from "react-native";
import { ApiProvider } from "@/api/api-provider";

export default function RootLayout() {
  return (
    <ApiProvider>
      {/* --- Top Header --- */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 12,
          backgroundColor: "#0A2463",
        }}
      >
        <Image
          source={require("../../components/CCLogo1.png")}
          style={{ width: 32, height: 32, marginRight: 8 }}
        />
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          Chomp Change
        </Text>
      </View>

      {/* --- Bottom Tabs (3) --- */}
      <Tabs
        screenOptions={{
          headerShown: false, // We already have a custom header
          tabBarStyle: {
            backgroundColor: "#0A2463",
            borderTopColor: "#ccc",
          },
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "lightgray",
        }}
      >
        <Tabs.Screen
          name="homepage"
          options={{
            title: "Home",
            tabBarIcon: () => <Text>🏠</Text>,
          }}
        />
        <Tabs.Screen
          name="poolslist"
          options={{
            title: "Pools",
            tabBarIcon: () => <Text>💰</Text>,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: () => <Text>⚙️</Text>,
          }}
        />
      </Tabs>
    </ApiProvider>
  );
}
