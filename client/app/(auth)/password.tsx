import { Link, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import AuthBackground from "../../components/AuthBackground";
import AuthCard from "../../components/AuthCard";

export default function PasswordScreen() {
  const { type, value } = useLocalSearchParams<{ type?: string; value?: string }>();
  const [pw, setPw] = useState("");

  const onSignIn = async () => {
    // When backend auth is ready, call startSession here.
    //Simulated success:
    if (!pw) { Alert.alert("Missing password"); return; }
    Alert.alert("Demo", `Would login with ${type}: ${value}`);
    router.replace("/"); // or to your post-login route
  };

  return (
    <AuthBackground>
      <AuthCard>
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>Enter Password</Text>
          <Text style={{ color: "#334155" }}>
            Signing in as {type}: <Text style={{ fontWeight: "700" }}>{value}</Text>
          </Text>

          <Text>Password</Text>
          <TextInput
            placeholder="••••••••"
            secureTextEntry
            value={pw}
            onChangeText={setPw}
            style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
          />

          <Pressable
            onPress={onSignIn}
            style={{ backgroundColor: "#1428A0", padding: 14, borderRadius: 10, alignItems: "center", marginTop: 8 }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>Sign In</Text>
          </Pressable>

          <Link href="/(auth)/forgot-password" style={{ color: "#1428A0", marginTop: 12, textAlign: "center" }}>
            Forgot password?
          </Link>
        </View>
      </AuthCard>
    </AuthBackground>
  );
}
