// client/app/(auth)/index.tsx
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import AuthBg from "../../components/AuthBg";
import AuthCard from "../../components/AuthCard";
import { normalizeUsername } from "../../utils/ident";
import { useApi } from "@/api/api-provider";
import { validateEmail, validateUserName } from "@money-pool-app/shared";
import { useAlert } from "@/components/ui/custom-alert";

export default function IdentifierScreen() {
  const api = useApi();
  const { showAlert } = useAlert();

  const [id, setId] = useState("");
  const [busy, setBusy] = useState(false);
  const trimmed = id.trim();
  const isValid = trimmed.length > 0 && (validateEmail(trimmed) || validateUserName(trimmed));

  const onContinue = async () => {
    if (!trimmed) {
      showAlert("Missing info", "Enter your email or username.");
      return;
    }
    
    const usesEmail = validateEmail(trimmed);
    if (!usesEmail && !validateUserName(trimmed)) {
      showAlert("Invalid info", "Please enter a valid email or username.");
      return;
    }

    const identifier = usesEmail ? trimmed : normalizeUsername(trimmed);
    setBusy(true);
    try {
      const exists = await api.doesUserExist({
        ...(usesEmail ? { email: identifier } : { userName: identifier }),
      });

      if (exists) {
        // Go to password screen; it will perform the actual login API call.
        router.push({
          pathname: "/(auth)/password",
          params: { type: usesEmail ? "email" : "username", value: identifier },
        });
      } else {
        // Go to sign up screen; it will perform the actual sign up API call.
        router.push({
          pathname: "/(auth)/signup",
          params: usesEmail ? { email: identifier } : { userName: identifier },
        });
      }
    } catch (_e) {
      //Because of network or server error 
      showAlert("Network error", "Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthBg>
      <AuthCard>
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>Sign In</Text>
          <Text style={{ color: "#334155" }}>Enter your email or username to continue.</Text>

          <Text style={{ marginTop: 6 }}>Email or Username</Text>
          <TextInput
            placeholder="you@ufl.edu or your_username"
            placeholderTextColor="#888"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
            value={id}
            onChangeText={setId}
            style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
          />

          <Pressable
            onPress={onContinue}
            disabled={busy || !isValid}
            style={{
              backgroundColor: (busy || !isValid) ? "#94a3b8" : "#1428A0",
              padding: 14,
              borderRadius: 10,
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>{busy ? "Checking…" : "Continue"}</Text>
          </Pressable>
        </View>
      </AuthCard>
    </AuthBg>
  );
}
