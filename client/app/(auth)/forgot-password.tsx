//Forgot password screen 
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import AuthBackground from "../../components/AuthBackground";
import AuthCard from "../../components/AuthCard";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const onSubmit = () => {
    if (!email.trim()) {
      Alert.alert("Enter your email");
      return;
    }
    //Backend 
    Alert.alert("Demo", `Would request reset for ${email}`);
  };

  return (
    <AuthBackground>
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
        </View>
      </AuthCard>
    </AuthBackground>
  );
}
