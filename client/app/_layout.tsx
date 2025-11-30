import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { loadTokens } from "@/api/tokens";

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Load tokens from secure storage and consider user logged in if a session token exists.
      const tokens = await loadTokens();
      setIsLoggedIn(!!tokens.sessionToken);
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsLoggedIn(false);
    }
  };

  //Check if logged in and redirect to home page if so 
  useEffect(() => {
    if (isLoggedIn === null) return;
    if (isLoggedIn) {
      router.replace("/(root)/homepage");
    } else {
      router.replace("/(auth)");
    }
  }, [isLoggedIn]);

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(root)" />
    </Stack>
  );
}

//Flow: 
//Launch to homepage if logged in 
//Else go to auth screens 
//From homepage can navigate to add friends page
//Navigation bar for homepage, pools list, and settings
//From pools list -> specific pool view, create pool, manage pool