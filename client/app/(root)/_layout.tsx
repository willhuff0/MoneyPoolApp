import { Tabs } from "expo-router";
import { View, Image, Text } from "react-native";

export default function RootLayout() {
  return (
    <>
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

      {/* --- Bottom Tabs --- */}
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
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: () => <Text>🔍</Text>,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: () => <Text>👤</Text>,
          }}
        />
      </Tabs>
    </>
  );
}
