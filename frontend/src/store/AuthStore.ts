import { create } from "zustand";

type User = {
  id: number,
  username: string,
}

type AuthState = {
  user: User | null;
  accessToken: string | null;

  login: (user: User, token: string) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,

  login: (user, token) =>
    set({
      user,
      accessToken: token,
    }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
    }),

  setAccessToken: (token: string | null) => set({ accessToken: token})
}));
