import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "@/src/store/auth.store";

export default function CitizenDashboard() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <View style={{ flex: 1, padding: 24, gap: 16, justifyContent: "center" }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>
        Dashboard občana
      </Text>

      <Text>
        Přihlášený uživatel: {user?.name}
      </Text>

      <Text>
        Body: {user?.points ?? 0}
      </Text>

      <Pressable
        onPress={() => router.push("/(citizen)/report-create")}
        style={{
          borderWidth: 1,
          borderRadius: 12,
          padding: 16,
        }}
      >
        <Text>Vytvořit nové hlášení</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/(citizen)/my-reports")}
        style={{
          borderWidth: 1,
          borderRadius: 12,
          padding: 16,
        }}
      >
        <Text>Moje hlášení</Text>
      </Pressable>

      <Pressable
        onPress={() => {
          logout();
          router.replace("/(auth)/login");
        }}
        style={{
          borderWidth: 1,
          borderRadius: 12,
          padding: 16,
        }}
      >
        <Text>Odhlásit se</Text>
      </Pressable>
    </View>
  );
}
