import { Redirect, Slot } from "expo-router";
import { useAuthStore } from "@/src/store/auth.store";

export default function WorkerLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (user?.role !== "worker") {
    return <Redirect href="/" />;
  }

  return <Slot />;
}
