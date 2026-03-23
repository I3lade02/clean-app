import { Redirect, Slot } from "expo-router";
import { useAuthStore } from "@/src/store/auth.store";

export default function VolunteerLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (user?.role !== "volunteer") {
    return <Redirect href="/" />;
  }

  return <Slot />;
}
