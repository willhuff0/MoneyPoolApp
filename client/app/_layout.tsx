import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // TESTING: Skip auth check - always show root layout
      setIsLoggedIn(true);
      router.replace("/(root)/homepage");
      // const token = await AsyncStorage.getItem("sessionToken");
      // setIsLoggedIn(!!token);
      // 
      // // Navigate based on auth status
      // if (!token) {
      //   router.replace("/(auth)");
      // }
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsLoggedIn(false);
      router.replace("/(auth)");
    }
  };

  // Loading state - show nothing while checking
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
