//Forgot password screen
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import AuthBg from "../../components/AuthBg";
import AuthCard from "../../components/AuthCard";
import { isEmail } from "../../utils/ident";

export default function ForgotPasswordScreen() {
  //Have pre-filled email 
  const { value, type } = useLocalSearchParams<{ value?: string; type?: string }>();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (type === "email" && typeof value === "string" && isEmail(value)) {
      setEmail(value);
    }
  }, [type, value]);

  const onSubmit = async () => {
    const trimmed = email.trim();
    if (!trimmed || !isEmail(trimmed)) {
      Alert.alert("Enter a valid email");
      return;
    }
    try {
      // await requestPasswordReset({ email: trimmed });
      Alert.alert(
        "Check your inbox",
        "If an account exists for that email, you'll receive reset instructions.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (e: any) {
      //Instructions message
      Alert.alert(
        "Check your inbox",
        "If an account exists for that email, you'll receive reset instructions."
      );
    }
  };

  return (
    <AuthBg>
      <AuthCard>
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>Forgot password</Text>

          <Text>Email</Text>
          <TextInput
            placeholder="you@ufl.edu"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
          />

          <Pressable
            onPress={onSubmit}
            style={{
              backgroundColor: "#1428A0",
              padding: 14,
              borderRadius: 10,
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>Submit</Text>
          </Pressable>

          <Pressable onPress={() => router.back()} style={{ alignItems: "center", padding: 8 }}>
            <Text style={{ color: "#1428A0" }}>Back</Text>
          </Pressable>
        </View>
      </AuthCard>
    </AuthBg>
  );
}
