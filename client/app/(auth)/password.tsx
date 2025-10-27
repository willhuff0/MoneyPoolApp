// client/app/(auth)/password.tsx
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import AuthBg from "../../components/AuthBg";
import AuthCard from "../../components/AuthCard";
import { login } from "../../lib/api";

export default function PasswordScreen() {
  // params from identifier screen
  const { type, value } = useLocalSearchParams<{ type?: string; value?: string }>();

  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onLogin = async () => {
    if (!value || !type) {
      Alert.alert("Missing info", "Please go back and enter your email or username.");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Missing password", "Please enter your password.");
      return;
    }

    try {
      setBusy(true);
      const payload =
        type === "email"
          ? { email: String(value), password }
          : { userName: String(value), password };

      const res = await login(payload);
      // Token saved automatically in AsyncStorage
      Alert.alert("Welcome!", `Logged in as ${res.displayName}`);
      router.replace("/"); 
    } catch (e: any) {
      Alert.alert("Login failed", e?.message ?? "Unknown error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthBg>
      <AuthCard>
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>Enter your password</Text>
          <Text style={{ color: "#334155" }}>
            {type === "email" ? "Email" : "Username"}:{" "}
            <Text style={{ fontWeight: "600" }}>{String(value ?? "")}</Text>
          </Text>

          <Text style={{ marginTop: 6 }}>Password</Text>
          <TextInput
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
            style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
          />

          <Pressable
            onPress={onLogin}
            disabled={busy}
            style={{
              backgroundColor: busy ? "#94a3b8" : "#1428A0",
              padding: 14,
              borderRadius: 10,
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>
              {busy ? "Signing in…" : "Sign In"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(auth)/forgot-password",
                params: { type, value },
              })
            }
            style={{ alignItems: "center", padding: 8 }}
          >
            <Text style={{ color: "#1428A0" }}>Forgot your password?</Text>
          </Pressable>

          <Pressable onPress={() => router.back()} style={{ alignItems: "center", padding: 8 }}>
            <Text style={{ color: "#1428A0" }}>Back</Text>
          </Pressable>
        </View>
      </AuthCard>
    </AuthBg>
  );
}
