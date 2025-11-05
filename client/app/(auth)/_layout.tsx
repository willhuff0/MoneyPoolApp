import { ApiProvider } from "@/api/api-provider";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    //Tabs to go through 
    <ApiProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#0A2463" } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="password" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgot-password" />
      </Stack>
    </ApiProvider>
  );
}

//Flow 
//Index screen 
//If username/email found, go to password page
//Else sign up
//If on password page and forgot password, go to password page