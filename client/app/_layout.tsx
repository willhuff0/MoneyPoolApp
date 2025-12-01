import { ApiProvider, useApi } from "@/api/api-provider";
import { Stack, Redirect, usePathname } from "expo-router";

function LoggedInSwitcher() {
  const api = useApi();

  if (api.activeUser == null) {
    return <Redirect href="/(auth)" />;
  } else if (usePathname() === "/") {
    return <Redirect href="/(root)/homepage" />;
  }
}

export default function AppLayout() {
  return (
    <ApiProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(root)" />
      </Stack>
      <LoggedInSwitcher />
    </ApiProvider>
  )
}

//Flow: 
//Launch to homepage if logged in 
//Else go to auth screens 
//From homepage can navigate to add friends page
//Navigation bar for homepage, pools list, and settings
//From pools list -> specific pool view, create pool, manage pool