// client/app/(auth)/index.tsx
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import AuthBg from "../../components/AuthBg";
import AuthCard from "../../components/AuthCard";
import { isEmail, normalizeUsername } from "../../utils/ident";

export default function IdentifierScreen() {
  const [id, setId] = useState("");
  const trimmed = id.trim();

  const onContinue = () => {
    if (!trimmed) {
      Alert.alert("Missing info", "Enter your email or username.");
      return;
    }
    const usesEmail = isEmail(trimmed);
    const identifier = usesEmail ? trimmed : normalizeUsername(trimmed);

    // Go to password screen; it will perform the actual login API call.
    router.push({
      pathname: "/(auth)/password",
      params: { type: usesEmail ? "email" : "username", value: identifier },
    });
  };

  return (
    <AuthBg>
      <AuthCard>
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>Sign In</Text>
          <Text style={{ color: "#334155" }}>Enter your email or username to continue.</Text>

          <Text style={{ marginTop: 6 }}>Email or Username</Text>
          <TextInput
            placeholder="you@ufl.edu or devina_t"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={id}
            onChangeText={setId}
            style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
          />

          <Pressable
            onPress={onContinue}
            style={{
              backgroundColor: "#1428A0",
              padding: 14,
              borderRadius: 10,
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>Continue</Text>
          </Pressable>
        </View>
      </AuthCard>
    </AuthBg>
  );
}
