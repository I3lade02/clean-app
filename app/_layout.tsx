import { Stack } from "expo-router";
import { AppQueryProvider } from "@/src/providers/query-provider";

export default function RootLayout() {
  return (
    <AppQueryProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AppQueryProvider>
  );
}
