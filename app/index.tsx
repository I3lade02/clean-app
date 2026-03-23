import { Redirect } from "expo-router";
import { useAuthStore } from "../src/store/auth.store";

export default function IndexPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  switch (user?.role) {
    case "citizen":
      return <Redirect href="/(citizen)" />;
    case "volunteer":
      return <Redirect href="/(volunteer)" />;
    case "worker":
      return <Redirect href="/(worker)" />;
    case "admin":
      return <Redirect href="/(admin)" />;
    default:
      return <Redirect href="/(auth)/login" />;
  }
}
