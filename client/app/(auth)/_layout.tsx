import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
    <Stack screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="index" options={{ title: "Sign In" }} />
      <Stack.Screen name="password" options={{ title: "Enter Password" }} />
      <Stack.Screen name="signup" options={{ title: "Create Account" }} />
      <Stack.Screen name="forgot-password" options={{ title: "Forgot Password" }} />
    </Stack>)
}
