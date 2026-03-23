import { create } from "zustand";
import { User } from "@/src/types/user";

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (payload: { token: string; user: User }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
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
}));
