import { create } from "zustand";
import { User } from "../utils/types";

interface FormDataState {
  user: User | null;
  setUserData: (data: User) => void;
  resetUserData: () => void;
}

const useUserStore = create<FormDataState>((set) => ({
  user: null,
  setUserData: (data) => set(() => ({ user: data })),
  resetUserData: () => set({ user: null }),
}));

export default useUserStore;
