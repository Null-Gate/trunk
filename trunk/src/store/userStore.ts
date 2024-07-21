import { create } from "zustand";
import { User } from "../utils/types";

interface FormDataState {
  user: User | null;
  token: string;
  setUserData: (data: User) => void;
  setToken: (token: string) => void;
  resetUserData: () => void;
}

const useUserStore = create<FormDataState>((set) => ({
  user: null,
  token: "",
  setUserData: (data) => set(() => ({ user: data })),
  setToken: (token) => set({ token: token }),
  resetUserData: () => set({ user: null }),
}));

export default useUserStore;
