// client/app/(auth)/signup.tsx
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import AuthBg from "../../components/AuthBg";
import AuthCard from "../../components/AuthCard";
import { useApi } from "@/api/api-provider";
import { validateDisplayName, validateEmail, validatePassword, validateUserName } from "@money-pool-app/shared";
import { useAlert } from "@/components/ui/custom-alert";

export default function SignupScreen() {
  const api = useApi();
  const { showAlert } = useAlert();
  const params = useLocalSearchParams<{ email?: string; userName?: string }>();

  const [displayName, setDisplayName] = useState("");
  const [userName, setUserName] = useState(params.userName || "");
  const [email, setEmail] = useState(params.email || "");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onSignup = async () => {
    if (!displayName.trim() || !userName.trim() || !email.trim() || !password.trim()) {
      showAlert("Missing info", "Please complete all fields.");
      return;
    }

    if (!validateDisplayName(displayName.trim())) {
      showAlert("Invalid info", "Display Name is invalid.");
      return;
    }
    if (!validateUserName(userName.trim())) {
      showAlert("Invalid info", "Username is invalid.");
      return;
    }
    if (!validateEmail(email.trim())) {
      showAlert("Invalid info", "Email is invalid.");
      return;
    }
    if (!validatePassword(password.trim())) {
      showAlert("Invalid info", "Password is invalid.");
      return;
    }

    try {
      setBusy(true);
      if (await api.signUp({ displayName: displayName.trim(), userName: userName.trim(), email: email.trim(), password })) {
        // Token stored automatically by api.ts if backend returns it
        router.replace("/(root)/homepage");
      } else {
        showAlert("Signup failed");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthBg>
      <AuthCard>
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>Create account</Text>

          <Text>Display Name</Text>
          <TextInput
            placeholder="Your Name"
            placeholderTextColor="#888"
            autoCapitalize="words"
            value={displayName}
            onChangeText={setDisplayName}
            style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
          />

          <Text>Username</Text>
          <TextInput
            placeholder="your_username"
            placeholderTextColor="#888"
            autoCapitalize="none"
            value={userName}
            onChangeText={setUserName}
            style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
          />

          <Text>Email</Text>
          <TextInput
            placeholder="you@ufl.edu"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
          />

          <Text>Password</Text>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#888"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
            style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
          />

          <Pressable
            onPress={onSignup}
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
              {busy ? "Creating…" : "Create account"}
            </Text>
          </Pressable>

          <Pressable onPress={() => router.back()} style={{ alignItems: "center", padding: 8 }}>
            <Text style={{ color: "#1428A0" }}>Back</Text>
          </Pressable>
        </View>
      </AuthCard>
    </AuthBg>
  );
}
