import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import AuthBackground from "../../components/AuthBackground";
import AuthCard from "../../components/AuthCard";
import { addTodo, getTodos } from "../../lib/api";
import { isEmail, normalizeUsername } from "../../utils/ident";

function DbDemo() {
  const [count, setCount] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    try {
      const items = await getTodos();
      setCount(items.length);
    } catch {
      setCount(null);
    }
  };
  useEffect(() => { refresh(); }, []);

  const create = async () => {
    try {
      setBusy(true);
      await addTodo(`Demo from UI @ ${new Date().toLocaleTimeString()}`);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderColor: "#e5e7eb", gap: 8 }}>
      <Text style={{ fontWeight: "700" }}>Backend Connection Demo</Text>
      <Text>Todo docs in DB: {count === null ? "…" : count}</Text>
      <Pressable
        onPress={create}
        disabled={busy}
        style={{ backgroundColor: busy ? "#94a3b8" : "#0ea5e9", padding: 12, borderRadius: 8, alignItems: "center" }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>
          {busy ? "Writing…" : "Create a DB record"}
        </Text>
      </Pressable>
    </View>
  );
}

export default function IdentifierScreen() {
  const [id, setId] = useState("");
  const trimmed = id.trim();

  const onContinue = async () => {
    if (!trimmed) { Alert.alert("Missing info", "Enter your email or username."); return; }
    const usesEmail = isEmail(trimmed);
    const identifier = usesEmail ? trimmed : normalizeUsername(trimmed);

    // No backend check yet — go to password; if user not found there, you’ll route to signup.
    router.push({ pathname: "/(auth)/password", params: { type: usesEmail ? "email" : "username", value: identifier } });
  };

  return (
    <AuthBackground>
      <AuthCard>
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>Sign In</Text>
          <Text style={{ color: "#334155" }}>Enter your email or username to continue.</Text>

          <Text style={{ marginTop: 6 }}>Email or Username</Text>
          <TextInput
            placeholder="you@ufl.edu or devina_t"
            autoCapitalize="none"
            value={id}
            onChangeText={setId}
            style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
          />

          <Pressable
            onPress={onContinue}
            style={{ backgroundColor: "#1428A0", padding: 14, borderRadius: 10, alignItems: "center", marginTop: 8 }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>Continue</Text>
          </Pressable>

          {/* FE → BE → DB demo using /api/todos */}
          <DbDemo />
        </View>
      </AuthCard>
    </AuthBackground>
  );
}
