import { View, Text, TextInput, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";

export default function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");

  const handleLogin = (role: "citizen" | "volunteer" | "worker" | "admin") => {
    const demoUsers = {
      citizen: { id: "citizen-demo", name: "Ondra Obcan", points: 15 },
      volunteer: { id: "volunteer-demo", name: "Vera Dobrovolnice", points: 120 },
      worker: { id: "worker-demo", name: "Petr Profesional", points: 0 },
      admin: { id: "admin-demo", name: "Alice Admin", points: 0 },
    } as const;

    const demoUser = demoUsers[role];

    login({
      token: "demo-token",
      user: {
        id: demoUser.id,
        name: demoUser.name,
        email: email || "demo@cleancity.local",
        role,
        points: demoUser.points,
      },
    });

    router.replace("/");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>CleanCity login</Text>

      <TextInput
        placeholder="E-mail"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
        style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
      />

      <Pressable onPress={() => handleLogin("citizen")} style={{ borderWidth: 1, padding: 14, borderRadius: 12 }}>
        <Text>Přihlásit jako občan</Text>
      </Pressable>

      <Pressable onPress={() => handleLogin("volunteer")} style={{ borderWidth: 1, padding: 14, borderRadius: 12 }}>
        <Text>Přihlásit jako dobrovolník</Text>
      </Pressable>

      <Pressable onPress={() => handleLogin("worker")} style={{ borderWidth: 1, padding: 14, borderRadius: 12 }}>
        <Text>Přihlásit jako profesionál</Text>
      </Pressable>

      <Pressable onPress={() => handleLogin("admin")} style={{ borderWidth: 1, padding: 14, borderRadius: 12 }}>
        <Text>Přihlásit jako admin</Text>
      </Pressable>

      <Link href="/(auth)/register" style={{ textAlign: "center" }}>
        Nemam ucet
      </Link>
    </View>
  );
}
