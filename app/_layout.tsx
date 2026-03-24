import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LoadingScreen } from "../src/components/ui";
import { AppQueryProvider } from "../src/providers/query-provider";
import { useAuthStore } from "../src/store/auth.store";
import { useReportsStore } from "../src/store/reports.store";

export default function RootLayout() {
  const authHydrated = useAuthStore((state) => state.hasHydrated);
  const reportsHydrated = useReportsStore((state) => state.hasHydrated);

  return (
    <SafeAreaProvider>
      <AppQueryProvider>
        {authHydrated && reportsHydrated ? (
          <Stack screenOptions={{ headerShown: false }} />
        ) : (
          <LoadingScreen />
        )}
      </AppQueryProvider>
    </SafeAreaProvider>
  );
}
