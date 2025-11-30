import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoggedIn(true);
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
