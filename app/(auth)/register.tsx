import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/store/auth.store";
import { registerSchema } from "../../src/lib/schemas";

export default function RegisterScreen() {
  const login = useAuthStore((state) => state.login);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const handleRegister = () => {
    const parsed = registerSchema.safeParse({ name, email });
    if (!parsed.success) {
      const nextErrors: { name?: string; email?: string } = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field === "name") nextErrors.name = issue.message;
        if (field === "email") nextErrors.email = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    login({
      token: "demo-token",
      user: {
        id: Date.now().toString(),
        name: parsed.data.name,
        email: parsed.data.email,
        role: "citizen",
        points: 0,
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
        <Text style={{ fontSize: 13, fontWeight: "700", color: "#2E6B52" }}>Nova registrace</Text>
        <Text style={{ fontSize: 28, fontWeight: "700", color: "#122018" }}>Vytvor obcansky ucet</Text>

        <TextInput
          placeholder="Jmeno"
          value={name}
          onChangeText={(value) => {
            setName(value);
            if (errors.name) setErrors((current) => ({ ...current, name: undefined }));
          }}
          style={{
            borderWidth: 1,
            borderRadius: 14,
            padding: 14,
            borderColor: errors.name ? "#D64545" : "#C8D7CF",
            backgroundColor: "#FAFCFB",
          }}
        />
        {errors.name ? <Text style={{ color: "#D64545" }}>{errors.name}</Text> : null}

        <TextInput
          placeholder="E-mail"
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(value) => {
            setEmail(value);
            if (errors.email) setErrors((current) => ({ ...current, email: undefined }));
          }}
          style={{
            borderWidth: 1,
            borderRadius: 14,
            padding: 14,
            borderColor: errors.email ? "#D64545" : "#C8D7CF",
            backgroundColor: "#FAFCFB",
          }}
        />
        {errors.email ? <Text style={{ color: "#D64545" }}>{errors.email}</Text> : null}

        <Pressable
          onPress={handleRegister}
          style={{ backgroundColor: "#1C7C54", padding: 15, borderRadius: 14 }}
        >
          <Text style={{ color: "white", textAlign: "center", fontWeight: "700" }}>
            Vytvorit ucet
          </Text>
        </Pressable>

        <Link href="/(auth)/login" style={{ textAlign: "center", color: "#1C7C54", fontWeight: "600" }}>
          Uz mam ucet
        </Link>
      </View>
    </SafeAreaView>
  );
}
