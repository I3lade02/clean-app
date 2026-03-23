import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "../types/user";

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (payload: { token: string; user: User }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: ({ token, user }) =>
        set({
          token,
          user,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "clean-app-auth",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
