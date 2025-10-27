import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";
import AuthBackground from "../../components/AuthBackground";
import AuthCard from "../../components/AuthCard";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { normalizeUsername } from "../../utils/ident";

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;

export default function SignupScreen() {
  const params = useLocalSearchParams<{ email?: string; username?: string }>();
  const [email, setEmail] = useState(() => (typeof params.email === "string" ? params.email : ""));
  const [username, setUsername] = useState(() =>
    typeof params.username === "string" ? params.username.toLowerCase() : ""
  );
  const [displayName, setDisplayName] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  const normalized = useMemo(() => normalizeUsername(username), [username]);
  const debounced = useDebouncedValue(normalized, 450);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Placeholder availability (until backend auth exists)
  useEffect(() => {
    setAvailable(null);
    if (!USERNAME_RE.test(debounced)) return;
    setChecking(true);
    const id = setTimeout(() => { setAvailable(true); setChecking(false); }, 350);
    return () => clearTimeout(id);
  }, [debounced]);

  const canSubmit =
    email.trim() &&
    USERNAME_RE.test(normalized) &&
    available !== false &&
    displayName.trim().length > 0 &&
    pw.length >= 8 &&
    pw === pw2 &&
    !submitting;

  const onSignup = async () => {
    if (!canSubmit) return;
    //call createUser({ display_name: displayName, user_name: normalized, email, password: pw })
    Alert.alert("Demo", `Would create account:\nusername=${normalized}\nname=${displayName}\nemail=${email}`);
  };

  const usernameHint =
    !USERNAME_RE.test(normalized) ? "3–20 letters, numbers, or underscores"
    : checking ? "Checking…"
    : available === false ? "✗ Username taken"
    : "✓ Username looks good";

  return (
    <AuthBackground>
      <AuthCard>
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>Create your account</Text>

          <Text>Username</Text>
          <TextInput
            placeholder="e.g., devina_t"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
            style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
          />
          <Text style={{ color: available === false ? "crimson" : "#16a34a" }}>{usernameHint}</Text>

          <Text>Display Name</Text>
          <TextInput
            placeholder="Devina Tikkoo"
            value={displayName}
            onChangeText={setDisplayName}
            style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
          />

          <Text>Email</Text>
          <TextInput
            placeholder="you@ufl.edu"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
          />

          <Text>Password</Text>
          <TextInput
            placeholder="••••••••"
            secureTextEntry
            value={pw}
            onChangeText={setPw}
            style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
          />

          <Text>Confirm Password</Text>
          <TextInput
            placeholder="••••••••"
            secureTextEntry
            value={pw2}
            onChangeText={setPw2}
            style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
          />

          <Pressable
            disabled={!canSubmit}
            onPress={onSignup}
            style={{
              backgroundColor: canSubmit ? "#1428A0" : "#94a3b8",
              padding: 14, borderRadius: 10, alignItems: "center",
              marginTop: 8, flexDirection: "row", gap: 8, justifyContent: "center"
            }}
          >
            {submitting ? <ActivityIndicator color="#fff" /> : null}
            <Text style={{ color: "white", fontWeight: "600" }}>Sign Up</Text>
          </Pressable>
        </View>
      </AuthCard>
    </AuthBackground>
  );
}
