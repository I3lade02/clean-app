import { View, Text, TextInput, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/store/auth.store";
import { loginSchema } from "../../src/lib/schemas";

export default function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (role: "citizen" | "volunteer" | "worker" | "admin") => {
    const parsed = loginSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Neplatny e-mail.");
      return;
    }

    setError("");

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
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#F4F8F6" }}
    >
      <View
        style={{
          borderRadius: 24,
          padding: 24,
          gap: 14,
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#D8E4DD",
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: "700", color: "#2E6B52" }}>CleanCity</Text>
        <Text style={{ fontSize: 28, fontWeight: "700", color: "#122018" }}>Vyber roli a prihlas se</Text>
        <Text style={{ color: "#5A6B62", lineHeight: 20 }}>
          Demo prihlaseni pouziva jednu e-mailovou adresu a role prepina pracovni pohled aplikace.
        </Text>

        <TextInput
          placeholder="E-mail"
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(value) => {
            setEmail(value);
            if (error) setError("");
          }}
          style={{
            borderWidth: 1,
            borderRadius: 14,
            padding: 14,
            borderColor: error ? "#D64545" : "#C8D7CF",
            backgroundColor: "#FAFCFB",
          }}
        />
        {error ? <Text style={{ color: "#D64545" }}>{error}</Text> : null}

        <Pressable
          onPress={() => handleLogin("citizen")}
          style={{ backgroundColor: "#1C7C54", padding: 15, borderRadius: 14 }}
        >
          <Text style={{ color: "white", fontWeight: "700", textAlign: "center" }}>Prihlasit jako obcan</Text>
        </Pressable>

        <Pressable
          onPress={() => handleLogin("volunteer")}
          style={{ borderWidth: 1, padding: 15, borderRadius: 14, borderColor: "#C8D7CF" }}
        >
          <Text style={{ fontWeight: "600", textAlign: "center" }}>Prihlasit jako dobrovolnik</Text>
        </Pressable>

        <Pressable
          onPress={() => handleLogin("worker")}
          style={{ borderWidth: 1, padding: 15, borderRadius: 14, borderColor: "#C8D7CF" }}
        >
          <Text style={{ fontWeight: "600", textAlign: "center" }}>Prihlasit jako profesional</Text>
        </Pressable>

        <Pressable
          onPress={() => handleLogin("admin")}
          style={{ borderWidth: 1, padding: 15, borderRadius: 14, borderColor: "#C8D7CF" }}
        >
          <Text style={{ fontWeight: "600", textAlign: "center" }}>Prihlasit jako admin</Text>
        </Pressable>

        <Link href="/(auth)/register" style={{ textAlign: "center", color: "#1C7C54", fontWeight: "600" }}>
          Nemam ucet
        </Link>
      </View>
    </SafeAreaView>
  );
}
