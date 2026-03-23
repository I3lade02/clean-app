import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Link, router } from "expo-router";
import { useAuthStore } from "@/src/store/auth.store";

export default function RegisterScreen() {
  const login = useAuthStore((state) => state.login);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleRegister = () => {
    login({
      token: "demo-token",
      user: {
        id: Date.now().toString(),
        name: name.trim() || "Novy uzivatel",
        email: email.trim() || "demo@cleancity.local",
        role: "citizen",
        points: 0,
      },
    });

    router.replace("/");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>CleanCity registrace</Text>

      <TextInput
        placeholder="Jmeno"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
      />

      <TextInput
        placeholder="E-mail"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
        style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
      />

      <Pressable
        onPress={handleRegister}
        style={{ backgroundColor: "#1E88E5", padding: 14, borderRadius: 12 }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "600" }}>
          Vytvorit ucet
        </Text>
      </Pressable>

      <Link href="/(auth)/login" style={{ textAlign: "center" }}>
        Uz mam ucet
      </Link>
    </View>
  );
}
