import { ApiProvider } from "@/api/api-provider";
import { Tabs } from "expo-router";
import { View, Image, Text } from "react-native";

export default function RootLayout() {
  return (<>
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

    {/* --- Bottom Tabs (2) --- */}
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
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: () => <Text>⚙️</Text>,
          }}
        />
        <Tabs.Screen
          name="addfriends"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="addtransaction"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="editprofile"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="managepool"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="specificpool"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="splittotal"
          options={{
            href: null
          }}
        />
      </Tabs>
    </>
  );
}
